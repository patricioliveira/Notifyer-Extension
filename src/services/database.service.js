// database.service.js

export class DatabaseService {
    constructor() {
        this.DB_NAME = "NotifyerDB";
        this.DB_VERSION = 1;
        this.db = null;
        this.resolve = null;
        this.reject = null;
    }

    openDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

            request.onerror = (event) => {
                reject(`Error opening database: ${event.target.errorCode}`);
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                this.db = event.target.result;
                this.setupObjectStore();
            };
        });
    }

    setupObjectStore() {
        const objectStore = this.db.createObjectStore("logbook", { keyPath: "id", autoIncrement: true });
        // Adicione mais configurações de object store, se necessário
    }

    async insertData(data) {
        const db = await this.openDB();
        const transaction = db.transaction(["logbook"], "readwrite");
        const objectStore = transaction.objectStore("logbook");

        const dataEntry = {
            action: data.action,
            details: data.details,
            timestamp: data.timestamp,
        };

        return new Promise((resolve, reject) => {
            const request = objectStore.add(dataEntry);

            request.onsuccess = () => {
                resolve("Data inserted successfully!");
            };

            request.onerror = (event) => {
                reject(`Error inserting data: ${event.target.error}`);
            };
        });
    }

    async updateData(id, newData) {
        const db = await this.openDB();
        const transaction = db.transaction(["logbook"], "readwrite");
        const objectStore = transaction.objectStore("logbook");

        return new Promise((resolve, reject) => {
            const getRequest = objectStore.get(id);

            getRequest.onsuccess = (event) => {
                const existingData = event.target.result;

                if (existingData) {
                    Object.assign(existingData, newData);

                    const updateRequest = objectStore.put(existingData);

                    updateRequest.onsuccess = () => {
                        resolve("Data updated successfully!");
                    };

                    updateRequest.onerror = (event) => {
                        reject(`Error updating data: ${event.target.error}`);
                    };
                } else {
                    reject(`Record not found for id: ${id}`);
                }
            };

            getRequest.onerror = (event) => {
                reject(`Error getting data for id ${id}: ${event.target.error}`);
            };
        });
    }

    async deleteData(id) {
        const db = await this.openDB();
        const transaction = db.transaction(["logbook"], "readwrite");
        const objectStore = transaction.objectStore("logbook");

        return new Promise((resolve, reject) => {
            const request = objectStore.delete(id);

            request.onsuccess = () => {
                resolve("Data deleted successfully!");
            };

            request.onerror = (event) => {
                reject(`Error deleting data: ${event.target.error}`);
            };
        });
    }

    async getAllData() {
        const db = await this.openDB();
        const transaction = db.transaction(["logbook"], "readonly");
        const objectStore = transaction.objectStore("logbook");

        return new Promise((resolve, reject) => {
            const request = objectStore.getAll();

            request.onsuccess = (event) => {
                const data = event.target.result;
                resolve(data);
            };

            request.onerror = (event) => {
                reject(`Error listing data: ${event.target.error}`);
            };
        });
    }

    async downloadLogbook() {
        const logbookData = await this.getAllData();

        if (logbookData.length === 0) {
            console.warn("o Logbook está vazio. Nada para baixar.");
            return;
        }

        const formattedData = this.formatLogbook(logbookData);
        const blob = new Blob([formattedData], { type: "text/plain" });

        const downloadLink = document.createElement("a");
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = "logbook.txt";

        document.body.appendChild(downloadLink);
        downloadLink.click();

        document.body.removeChild(downloadLink);
    }

    formatLogbook(logbookData) {
        // Personalize o formato do logbook conforme necessário
        // Aqui, estamos convertendo cada objeto para uma linha de texto formatada
        return logbookData.map(entry => {
            const formattedEntry = {
                action: entry.action,
                details: entry.details,
                timestamp: entry.timestamp,
                id: entry.id
            };

            return JSON.stringify(formattedEntry, null, 2); // 2 espaços de indentação para uma formatação mais legível
        }).join('\n');
    }
}