import { RequisicoesHTTP } from '../../../services/httpbase.service.js';
import { LogData } from '../../../class/logdata-model.js';
import { DatabaseService } from '../../../services/database.service.js';

const requisicoes = new RequisicoesHTTP();
const databaseService = new DatabaseService();

const buttonGetTokenSession = document.getElementById('button-session');
if (buttonGetTokenSession != null) {
    buttonGetTokenSession?.addEventListener("click", async (event) => {
        // Impede o envio padrão do formulário
        event.preventDefault();

        let AccessToken = localStorage.getItem('AccessToken');
        let full_token_session = localStorage.getItem('full_token_session');

        if (AccessToken && full_token_session) {
            try {
                const responseStartSession = await requisicoes.post('/session/start-session', full_token_session);

                if (responseStartSession?.Result?.status == 'success') {
                    let logData = new LogData("Sessão iniciada com sucesso", responseStartSession);
                    databaseService.insertData(logData);

                    const responseQrcode = await requisicoes.get('/session/qrcode-session');

                    if (responseQrcode?.Result) {
                        let logData = new LogData("QR code gerado com sucesso", responseQrcode);
                        databaseService.insertData(logData);
                        exibirImagemBase64(responseQrcode?.Result);
                        localStorage.setItem("isConnected", 'true');
                    } else {
                        let logError = new LogData("Houve algum problema ao gerar o QRCODE", responseQrcode);
                        databaseService.insertData(logError);
                        localStorage.setItem("isConnected", 'false');
                        console.error(responseQrcode);
                    }
                } else if (responseStartSession?.Result.status == 'CLOSED' || responseStartSession?.Result.status == 'INITIALIZING') {
                    await repeatStartSession(full_token_session);
                } else if (responseStartSession?.Result.status == 'QRCODE') {
                    let logData = new LogData("Sessão iniciada com sucesso", responseStartSession);
                    databaseService.insertData(logData);
                    let logData1 = new LogData("QR code gerado com sucesso", responseStartSession);
                    databaseService.insertData(logData1);
                    exibirImagemBase64(responseStartSession?.Result.qrcode);
                    localStorage.setItem("isConnected", 'true');
                } else {
                    let logError = new LogData("Houve algum problema ao iniciar a sessão", responseStartSession);
                    databaseService.insertData(logError);
                    localStorage.setItem("isConnected", 'false');
                    console.error(responseStartSession);
                }
            } catch (error) {
                console.error('Erro:', error);
            }
        }
    });
}

async function repeatStartSession(param) {
    try {
        const responseStartSession = await requisicoes.post('/session/start-session', param);

        if (responseStartSession?.Result?.status == 'success') {
            let logData = new LogData("Sessão iniciada com sucesso", responseStartSession);
            databaseService.insertData(logData);

            const responseQrcode = await requisicoes.get('/session/qrcode-session');

            if (responseQrcode?.Result) {
                let logData = new LogData("QR code gerado com sucesso", responseQrcode);
                databaseService.insertData(logData);
                exibirImagemBase64(responseQrcode?.Result);
                localStorage.setItem("isConnected", 'true');
            } else {
                let logError = new LogData("Houve algum problema ao gerar o QRCODE", response);
                databaseService.insertData(logError);
                localStorage.setItem("isConnected", 'false');
                console.error(response);
            }
        } else if (responseStartSession?.Result.status == 'CLOSED' || responseStartSession?.Result.status == 'INITIALIZING') {
            await repeatStartSession(param);
        } else if (responseStartSession?.Result.status == 'QRCODE') {
            let logData = new LogData("Sessão iniciada com sucesso", responseStartSession);
            databaseService.insertData(logData);
            let logData1 = new LogData("QR code gerado com sucesso", responseStartSession);
            databaseService.insertData(logData1);
            exibirImagemBase64(responseStartSession?.Result.qrcode);
            localStorage.setItem("isConnected", 'true');
        } else {
            let logError = new LogData("Houve algum problema ao iniciar a sessão", response);
            databaseService.insertData(logError);
            localStorage.setItem("isConnected", 'false');
            console.error(response);
        }
    } catch (error) {
        console.error('Erro:', error);
    }
}

function exibirImagemBase64(codigoBase64) {
    // Obtém o elemento de imagem com o ID "qrcode-image"
    const imgElement = document.getElementById('qrcode-image');

    // Atribui o código base64 como a fonte da imagem
    imgElement.src = codigoBase64.includes('data:image/png;base64,') ? codigoBase64 : ('data:image/png;base64,' + codigoBase64);
}