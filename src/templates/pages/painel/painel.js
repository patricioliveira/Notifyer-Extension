import { RequisicoesHTTP } from '../../../services/httpbase.service.js';
import { LogData } from '../../../class/logdata-model.js';
import { DatabaseService } from '../../../services/database.service.js';
import { notyf } from '../../assets/vendor/js/components.js';

const requisicoes = new RequisicoesHTTP();
const databaseService = new DatabaseService();

const buttonGetTokenSession = document.getElementById('button-session');
const buttonToLoading = document.getElementById('button-session-link');

document.addEventListener('DOMContentLoaded', () => {
    notyf.info('Você está desconectado do WhatsApp! Gere o QR CODE e conecte agora mesmo!');
});


if (buttonGetTokenSession != null) {
    buttonGetTokenSession?.addEventListener("click", async (event) => {
        event.preventDefault();
        if (!buttonToLoading.classList.contains('disabled')) {
            initLoad();
            await startSession();
        }   
    });
}

const pollingInterval = 5000; // Intervalo de polling em milissegundos
let pollingActive = false; // Flag para indicar se o polling está ativo

async function startSession() {
    try {
        const AccessToken = localStorage.getItem('access_token');

        if (AccessToken) {
            const responseStartSession = await requisicoes.post('/session/start-session', {});

            if (responseStartSession?.Result?.status == 'success' || responseStartSession?.Result?.status == 'QRCODE') {
                logAndInsertData("Sessão iniciada com sucesso", responseStartSession);
                getQrCode(responseStartSession?.Result?.qrcode);
            } else {
                handleStartSessionStatus(responseStartSession?.Result?.status);
            }
        }
    } catch (error) {
        disableLoad();
        logAndHandleError('Erro:', error);
    }
}

function handleStartSessionStatus(status) {
    if (status == 'CLOSED') {
        startPolling(startSession);
    } else if (status == 'INITIALIZING') {
        startPolling(verifyStartSession);
    } else if (status == 'QRCODE'){
        getQrCode();
    } else if (status == 'CONNECTED') {
        notyf.success('Sua conexão já está ativa com sua sessão!');
        disableLoad();
    } else {
        disableLoad();
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
                disableLoad();
            }
        }, pollingInterval);
    }
}

async function verifyStartSession() {
    const intervalId = setInterval(async () => {
        try {
            const responseStartSession = await requisicoes.get('/session/status-session');
            if (responseStartSession?.Result.status !== 'CLOSED' && responseStartSession?.Result.status !== 'INITIALIZING') {
                
                logAndInsertData("QR code gerado com sucesso", responseStartSession);
                exibirImagemBase64(responseStartSession?.Result);
                clearInterval(intervalId);
                setTimeout(verifyStartSession, 0);
            }
            //todo: implementar outro else if para verificar a conexão após mostrar o qr code
        } catch (error) {
            logAndHandleError('Erro:', error);
            disableLoad();
        }
    }, 5000);
}

async function getQrCode(qrcode){
    
    qrcode ? qrcode : qrcode = await requisicoes.get('/session/qrcode-session');

    if (qrcode.Result ? qrcode.Result : qrcode) {
        exibirImagemBase64(qrcode.Result ? qrcode.Result : qrcode);
        disableLoad();
        logAndInsertData("QR code gerado com sucesso", qrcode.Result ? qrcode.Result : qrcode);
        setTimeout(verifyConnectionStatus, 5000);
    } else {
        logAndInsertData("Houve algum problema ao gerar o QRCODE", qrcode.Result ? qrcode.Result : qrcode);
        localStorage.setItem("isConnected", 'false');
        console.error(qrcode.Result ? qrcode.Result : qrcode);
        disableLoad();
    }
}

async function verifyConnectionStatus() {
    const intervalId = setInterval(async () => {
        try {
            const connectionStatus = await requisicoes.get('/session/check-connection-session');
            if (connectionStatus?.Result.status == true && connectionStatus?.Result.message == "Connected") {
                console.log(connectionStatus);
                localStorage.setItem("isConnected", 'true');
                notyf.success('Você está conectado ao WhatsApp!');
                clearInterval(intervalId);
                setTimeout(() => {clearQRCode()}, 10000);
            } else if (connectionStatus?.Result.status == false && connectionStatus?.Result.message == "Disconnected") {
                localStorage.setItem("isConnected", 'false');
                console.log(connectionStatus);
                clearInterval(intervalId);
                setTimeout(verifyConnectionStatus, 5000);
                setTimeout(() => { clearQRCode() }, 15000);
            }
        } catch (error) {
            logAndHandleError('Erro:', error);
            disableLoad();
        }
    }, 5000);
}

function exibirImagemBase64(codigoBase64) {
    // Obtém o elemento de imagem com o ID "qrcode-image"
    const imgElement = document.getElementById('qrcode-image');

    // Certifica-se de que codigoBase64 é uma string
    const base64String = String(codigoBase64);

    // Atribui o código base64 como a fonte da imagem
    imgElement.src = base64String.includes('data:image/png;base64,') ? base64String : ('data:image/png;base64,' + base64String);
    notyf.success('QR Code gerado com sucesso!');
    setTimeout(verifyConnectionStatus, 5000);
}

function clearQRCode(){
    const imgElement = document.getElementById('qrcode-image');
    imgElement.src = ''
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

function initLoad(){
    buttonToLoading.classList.add('disabled', 'is-loading');
}

function disableLoad() {
    buttonToLoading.classList.remove('disabled', 'is-loading');
}