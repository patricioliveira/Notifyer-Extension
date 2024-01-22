import { RequisicoesHTTP } from '../../services/httpbase.service.js';
import { LoginUser } from '../../class/user-model.js';
import { LogData } from '../../class/logdata-model.js';
import { DatabaseService } from '../../services/database.service.js';

const requisicoes = new RequisicoesHTTP();
const UserData = new LoginUser();
const databaseService = new DatabaseService();

let submitButton = document.getElementById("button-login");
let logoutButton = document.getElementById("button-logout");
let AccessToken = localStorage.getItem('AccessToken');

document.getElementById('errorDiv').style.display = 'none';

document.addEventListener('DOMContentLoaded', () => { 
    let AccessToken = localStorage.getItem('AccessToken');
    AccessToken ? showCentralStatusPanel() : hideCentralStatusPanel();
    changeMode(true);
    hideMsgError(); 
});

document.getElementById('toogle-theme').addEventListener('click', () => { changeMode(false) });

if (submitButton != null) {
    submitButton?.addEventListener("click", async (event) => {
        // Impede o envio padrão do formulário
        event.preventDefault();
        hideMsgError();

        UserData.Email = document.getElementById('user').value;
        UserData.Password = document.getElementById('password').value;

        if(UserData.verifyUserData(UserData) == 'empty'){
            showMsgError('Preencha todos os campos para efetuar a autenticação!')
            return
        }

        var response = null;
        response = await requisicoes.post('/auth/signin', UserData);
        if (response?.Result) {
            showCentralStatusPanel();
            UserData.Password = '*';
            let userData = { ...UserData }
            userData.Token = response.Result
            localStorage.setItem("AccessToken", userData.Token)
            let logData = new LogData("Login autenticado com sucesso", userData)
            databaseService.insertData(logData)
        } else {
            showMsgError(response)
        }
    });
}

if (logoutButton != null) {
    logoutButton?.addEventListener("click", async (event) => {
        // Impede o envio padrão do formulário
        event.preventDefault();
        AccessToken = localStorage.getItem('AccessToken');
        let response = await requisicoes.post('/auth/signout', {});
        if (response.Status) {
            localStorage.removeItem('AccessToken');
            let logData = new LogData("Usuário deslogado com sucesso e AccessToken removido do Local Storage!", AccessToken)
            databaseService.insertData(logData)
        } else {
            localStorage.removeItem('AccessToken');
            alert(response);
        }
        hideCentralStatusPanel();
    })
}

function changeMode(init) {
    let theme = localStorage.getItem('theme');
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
            let newColor = '#f5f6fa';
            document.documentElement.style.setProperty('--scrollbar-thumb-color', newColor);
        } else if (theme === 'light') {
            let newColor = '#2d2d31';
            document.documentElement.style.setProperty('--scrollbar-thumb-color', newColor);
        }
    }
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

function showCentralStatusPanel() {
    let body = document.getElementsByTagName('body');
    let app = document.getElementById('huro-app');
    let auth = document.getElementById('huro-auth');

    auth.style.display = 'none';
    app.style.display = 'block';
}

function hideCentralStatusPanel() {
    let body = document.getElementsByTagName('body');
    let app = document.getElementById('huro-app');
    let auth = document.getElementById('huro-auth');

    auth.style.display = 'block';
    body[0].style.overflowY = 'hidden';
    app.style.display = 'none';
}

function cleanInputs() {
    document.getElementById('user').value = '';
    document.getElementById('password').value = '';
}