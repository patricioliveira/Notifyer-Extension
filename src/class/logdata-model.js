// log-model.js

export class LogData {
    constructor(action, details) {
        this.action = action;
        this.details = details;
        //todo: ajustar timestampz de acordo com a região do cliente e e ver um formato mais fácil de analisar;
        this.timestamp = new Date().toISOString();
    }
}
