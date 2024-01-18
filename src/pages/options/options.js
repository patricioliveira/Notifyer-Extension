import { RequisicoesHTTP } from '../../services/httpbase.service.js';
import { LoginUser } from '../../class/user-model.js';
import { LogData } from '../../class/logdata-model.js';
import { DatabaseService } from '../../services/database.service.js';

const requisicoes = new RequisicoesHTTP();
const UserData = new LoginUser();
const databaseService = new DatabaseService();

let logoutButton = document.getElementById("button-logout");
let AccessToken = localStorage.getItem('AccessToken');

if (logoutButton != null) {
    logoutButton?.addEventListener("click", async (event) => {
        // Impede o envio padrão do formulário
        event.preventDefault();
        logoutButton.classList.add('is-loading');
        AccessToken = localStorage.getItem('AccessToken');
        let response = await requisicoes.post('/auth/signout', {});
        if (response.Status) {
            localStorage.removeItem('AccessToken');
            let logData = new LogData("Usuário deslogado com sucesso e AccessToken removido do Local Storage!", AccessToken)
            databaseService.insertData(logData)
        } else {
            alert(response)
        }
        logoutButton.classList.remove('is-loading');  
        hideCentralStatusPanel();
    })
}

//todo: ajustar template do options

function showCentralStatusPanel() {
    let container = document.getElementById('company-info');
    container[0].style.display = 'none';
    container[1].style.display = 'flex';
}

function hideCentralStatusPanel() {
    let container = document.getElementById('company-info');
    container[0].style.display = 'flex';
    container[1].style.display = 'none';
}