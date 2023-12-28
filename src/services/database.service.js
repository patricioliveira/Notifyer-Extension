// database.service.js

class DatabaseService {
    constructor() {
        this.DB_NAME = "NotifyerLogsDB";
        this.DB_VERSION = 1;
        this.db = null;
        this.resolve = null;
        this.reject = null;
    }

    openDB() {
        return new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;

            const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

            request.onerror = (event) => {
                this.reject(`Error opening database: ${event.target.errorCode}`);
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                this.resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                this.db = event.target.result;
                const objectStore = this.db.createObjectStore("logbook", { keyPath: "id", autoIncrement: true });
                // Add more object store configuration if needed
            };
        });
    }

    async insertData(Data) {
        const db = await this.openDB();
        const transaction = db.transaction(["logbook"], "readwrite");
        const objectStore = transaction.objectStore("logbook");

        // Garanta que o objeto a ser armazenado siga a estrutura desejada
        const dataEntry = {
            action: Data.action,
            details: Data.details,
            timestamp: Data.timestamp,
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
}
