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
        await startSession();
    });
}

const pollingInterval = 5000; // Intervalo de polling em milissegundos
let pollingActive = false; // Flag para indicar se o polling está ativo

async function startSession() {
    if (!buttonToLoading.classList.contains('disabled')) {
        buttonToLoading.classList.add('disabled', 'is-loading');

        try {
            const AccessToken = localStorage.getItem('access_token');

            if (AccessToken) {
                const responseStartSession = await requisicoes.post('/session/start-session', {});

                if (responseStartSession?.Result?.status == 'success') {
                    logAndInsertData("Sessão iniciada com sucesso", responseStartSession);
                    getQrCode();
                } else {
                    handleStartSessionStatus(responseStartSession?.Result?.status);
                }
            }
        } catch (error) {
            logAndHandleError('Erro:', error);
        }

        buttonToLoading.classList.remove('disabled', 'is-loading');
    }
}

function handleStartSessionStatus(status) {
    if (status == 'CLOSED') {
        startPolling(startSession);
    } else if (status == 'INITIALIZING') {
        startPolling(verifyStartSession);
    } else {
        logAndHandleError("Houve algum problema ao iniciar a sessão", { status });
    }
}

function startPolling(callback) {
    if (!pollingActive) {
        pollingActive = true;
        const intervalId = setInterval(async () => {
            try {
                const responseStartSession = await requisicoes.get('/session/status-session');

                if (responseStartSession?.Result?.status !== 'CLOSED' && responseStartSession?.Result?.status !== 'INITIALIZING') {
                    clearInterval(intervalId);
                    pollingActive = false;
                    handleStartSessionStatus(responseStartSession?.Result?.status);
                }
            } catch (error) {
                logAndHandleError('Erro:', error);
            }
        }, pollingInterval);
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
                setTimeout(verifyStartSession, 0);
            }
        } catch (error) {
            logAndHandleError('Erro:', error);
        }
    }, 5000);
}

async function getQrCode(){
    const responseQrcode = await requisicoes.get('/session/qrcode-session');

    if (responseQrcode?.Result) {
        exibirImagemBase64(responseQrcode?.Result);
        logAndInsertData("QR code gerado com sucesso", responseStartSession);
        setTimeout(verifyStartSession, 0);
    } else {
        logAndInsertData("Houve algum problema ao gerar o QRCODE", responseStartSession);
        localStorage.setItem("isConnected", 'false');
        console.error(responseQrcode);
    }
}

// async function verifyConnectionStatus() {
//     const intervalId = setInterval(async () => {
//         try {
//             const connectionStatus = await requisicoes.get('/session/check-connection-session');
//             if (connectionStatus?.Result.status == true && connectionStatus?.Result.message == "Connected") {
//                 console.log(connectionStatus)
//                 localStorage.setItem("isConnected", 'true');
//                 clearInterval(intervalId);
//             } else if (connectionStatus?.Result.status == false && connectionStatus?.Result.message == "Disconnected") {
//                 localStorage.setItem("isConnected", 'false');
//                 console.log(connectionStatus)
//                 await verifyConnectionStatus();
//             }
//         } catch (error) {
//             logAndHandleError('Erro:', error);
//         }
//     }, 5000);
// }

function exibirImagemBase64(codigoBase64) {
    // Obtém o elemento de imagem com o ID "qrcode-image"
    const imgElement = document.getElementById('qrcode-image');

    // Certifica-se de que codigoBase64 é uma string
    const base64String = String(codigoBase64);

    // Atribui o código base64 como a fonte da imagem
    imgElement.src = base64String.includes('data:image/png;base64,') ? base64String : ('data:image/png;base64,' + base64String);
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