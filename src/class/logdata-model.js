// log-model.js

export class LogData {
    constructor(action, details) {
        this.action = action;
        this.details = details;
        this.timestamp = this.getCurrentTimestamp();
    }

    getCurrentTimestamp() {
        // Criando uma nova data
        let dataAtual = new Date();

        // Configurando o fuso horário para Brasília (GMT-3)
        const brasiliaTimeZone = 'America/Sao_Paulo';
        const offset = -3 * 60; // Offset em minutos

        dataAtual.setMinutes(dataAtual.getMinutes() - dataAtual.getTimezoneOffset() - offset);

        // Formatando a data conforme o padrão desejado
        let options = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
            timeZone: brasiliaTimeZone
        };

        return dataAtual.toLocaleString('pt-BR', options);
    }
}
