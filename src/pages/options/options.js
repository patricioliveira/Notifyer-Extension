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
hideMsgError();

if (AccessToken) {
    showCentralStatusPanel();
}

if (submitButton != null) {
    submitButton?.addEventListener("click", async (event) => {
        // Impede o envio padrão do formulário
        event.preventDefault();
        hideMsgError();

        UserData.Email = document.getElementById('user').value;
        UserData.Password = document.getElementById('password').value;

        UserData.verifyUserData(UserData);

        // submitButton.classList.add('is-loading');
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
        // submitButton.classList.remove('is-loading');
    });
}

if (logoutButton != null) {
    logoutButton?.addEventListener("click", async (event) => {
        // Impede o envio padrão do formulário
        event.preventDefault();
        // logoutButton.classList.add('is-loading');
        AccessToken = localStorage.getItem('AccessToken');
        let response = await requisicoes.post('/auth/signout', {});
        if (response.Status) {
            localStorage.removeItem('AccessToken');
            let logData = new LogData("Usuário deslogado com sucesso e AccessToken removido do Local Storage!", AccessToken)
            databaseService.insertData(logData)
        } else {
            alert(response)
        }
        // logoutButton.classList.remove('is-loading');
        hideCentralStatusPanel();
    })
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
    let app = document.getElementById('huro-app');
    let auth = document.getElementById('huro-auth');

    auth.style.display = 'none';
    app.style.display = 'block';
}

function hideCentralStatusPanel() {
    let app = document.getElementById('huro-app');
    let auth = document.getElementById('huro-auth');

    auth.style.display = 'block';
    app.style.display = 'none';
}

function cleanInputs() {
    document.getElementById('user').value = '';
    document.getElementById('password').value = '';
}