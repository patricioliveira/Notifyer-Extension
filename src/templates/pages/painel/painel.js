import { RequisicoesHTTP } from '../../../services/httpbase.service.js';
import { LogData } from '../../../class/logdata-model.js';
import { DatabaseService } from '../../../services/database.service.js';

const requisicoes = new RequisicoesHTTP();
const databaseService = new DatabaseService();

const buttonGetTokenSession = document.getElementById('button-session');
const buttonToLoading = document.getElementById('button-session-link');

if (buttonGetTokenSession != null) {
    buttonGetTokenSession?.addEventListener("click", async (event) => {
        event.preventDefault();
        startSession();
    });
}

async function startSession() {
    if (!buttonToLoading.classList.contains('disabled')) {
        buttonToLoading.classList.add('disabled', 'is-loading');

        try {
            const AccessToken = localStorage.getItem('AccessToken');
            const full_token_session = localStorage.getItem('full_token_session');

            if (AccessToken) {
                const responseStartSession = await requisicoes.post('/session/start-session', {});

                if (responseStartSession?.Result?.status == 'success') {
                    logAndInsertData("Sessão iniciada com sucesso", responseStartSession);
                    const responseQrcode = await requisicoes.get('/session/qrcode-session');

                    if (responseQrcode?.Result) {
                        exibirImagemBase64(responseQrcode?.Result);
                        logAndInsertData("QR code gerado com sucesso", responseStartSession);
                        localStorage.setItem("isConnected", 'true');
                    } else {
                        logAndInsertData("Houve algum problema ao gerar o QRCODE", responseStartSession);
                        localStorage.setItem("isConnected", 'false');
                        console.error(responseQrcode);
                    }
                } else if (responseStartSession?.Result.status == 'CLOSED') {
                    startSession();
                } else if (responseStartSession?.Result.status == 'INITIALIZING') {
                    await verifyStartSession(full_token_session);
                } else if (responseStartSession?.Result.status == 'QRCODE') {
                    logAndInsertData("QR code gerado com sucesso", responseStartSession);
                    exibirImagemBase64(responseStartSession?.Result.qrcode);
                    await verifyConnectionStatus();
                } else {
                    logAndHandleError("Houve algum problema ao iniciar a sessão", responseStartSession);
                }
            }
        } catch (error) {
            logAndHandleError('Erro:', error);
        }

        buttonToLoading.classList.remove('disabled', 'is-loading');
    }
}

async function verifyStartSession(param) {
    const intervalId = setInterval(async () => {
        try {
            const responseStartSession = await requisicoes.get('/session/status-session');
            if (responseStartSession?.Result.status !== 'CLOSED' && responseStartSession?.Result.status !== 'INITIALIZING') {
                logAndInsertData("QR code gerado com sucesso", responseStartSession);
                exibirImagemBase64(responseStartSession?.Result);
                clearInterval(intervalId);
                verifyConnectionStatus();
            }
        } catch (error) {
            logAndHandleError('Erro:', error);
        }
    }, 5000);
}

async function verifyConnectionStatus() {
    try {
        const connectionStatus = await requisicoes.get('/session/check-connection-session');
        if (connectionStatus?.Result.status == true && connectionStatus?.Result.message == "Connected") {
            console.log(connectionStatus)
            localStorage.setItem("isConnected", 'true');
        } else if (connectionStatus?.Result.status == false && connectionStatus?.Result.message == "Disconnected") {
            localStorage.setItem("isConnected", 'false');
            console.log(connectionStatus)
            await verifyConnectionStatus();
        }
    } catch (error) {
        logAndHandleError('Erro:', error);
    }
}

function logAndInsertData(message, data) {
    const logData = new LogData(message, data);
    databaseService.insertData(logData);
}

function logAndHandleError(message, error) {
    console.error(message, error);
    const logError = new LogData(message, error);
    databaseService.insertData(logError);
}
