import { RequisicoesHTTP } from '../../../services/httpbase.service.js';
import { LoginUser } from '../../../class/user-model.js';
import { LogData } from '../../../class/logdata-model.js';
import { DatabaseService } from '../../../services/database.service.js';

const requisicoes = new RequisicoesHTTP();
const UserData = new LoginUser();
const databaseService = new DatabaseService();

let submitButton = document.getElementById("button-login");
let AccessToken = localStorage.getItem('AccessToken');

document.getElementById('errorDiv').style.display = 'none';

document.getElementById('toogle-theme').addEventListener('mouseup', () => { changeMode(false); });

if (submitButton != null) {
    submitButton?.addEventListener("click", async (event) => {
        // Impede o envio padrão do formulário
        event.preventDefault();
        hideMsgError();

        UserData.Email = document.getElementById('user').value;
        UserData.Password = document.getElementById('password').value;

        if (UserData.verifyUserData(UserData) == 'empty') {
            showMsgError('Preencha todos os campos para efetuar a autenticação!')
            return
        }

        var response = null;
        response = await requisicoes.post('/auth/signin', UserData);
        if (response?.Result) {
            UserData.Password = '*';
            let userData = { ...UserData }
            userData.Token = response.Result
            localStorage.setItem("AccessToken", userData.Token)
            logAndInsertData("Login autenticado com sucesso", userData);
            await gerarTokenSession();
            reloadPage();
        } else {
            showMsgError(response)
            logAndHandleError("Não foi possível autenticar o usuário", response);
        }
    });
}

async function gerarTokenSession() {
    const response = await requisicoes.post('/session/generate-token', {});

    if (response?.Result) {
        logAndInsertData("SessionToken gerado com sucesso", response);
        return
    } else {
        logAndHandleError("Houve algum problema ao gerar o SessionToken", response);
        return
    }
}

function reloadPage() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        let extensionId = chrome.runtime.id;
        let optionsPageURL = `chrome-extension://${extensionId}/src/templates/app/app.html`;
        chrome.tabs.update(tabs[0].id, { url: optionsPageURL });
    });
}

function showMsgError(msg) {
    let errorMsgElement = document.getElementById('errorMsg');
    let errorDiv = document.getElementById('errorDiv');
    errorDiv.style.display = 'block';
    errorMsgElement.textContent = msg;
    setTimeout(() => {
        hideMsgError();
    }, 4000);
}

function hideMsgError() {
    let errorMsgElement = document.getElementById('errorMsg');
    let errorDiv = document.getElementById('errorDiv');
    errorDiv.style.display = 'none';
    errorMsgElement.textContent = '';
}

function cleanInputs() {
    document.getElementById('user').value = '';
    document.getElementById('password').value = '';
}

function changeMode(init) {
    let theme = localStorage.getItem('theme');
    let body = document.body;
    
    if (init === true) {
        if (theme === 'dark') {
            let newColor = '#2d2d31';
            document.documentElement.style.setProperty('--scrollbar-thumb-color', newColor);
        } else if (theme === 'light') {
            let newColor = '#f5f6fa';
            document.documentElement.style.setProperty('--scrollbar-thumb-color', newColor);
        }
    } else if (init === false) {
        if (theme === 'dark') {
            localStorage.setItem('theme', 'light');
            body.classList.remove("is-dark");
            let newColor = '#f5f6fa';
            document.documentElement.style.setProperty('--scrollbar-thumb-color', newColor);
        } else if (theme === 'light') {
            localStorage.setItem('theme', 'dark');
            body.classList.add("is-dark");
            let newColor = '#2d2d31';
            document.documentElement.style.setProperty('--scrollbar-thumb-color', newColor);
        }
    }
}

function logAndInsertData(message, data) {
    const logData = new LogData(message, data);
    databaseService.insertData(logData);
}

function logAndHandleError(message, error) {
    const logError = new LogData(message, error);
    databaseService.insertData(logError);
}