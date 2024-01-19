import { RequisicoesHTTP } from './httpbase.service.js';
import { LoginUser } from '../class/user-model.js';
import { LogData } from '../class/logdata-model.js';
import { DatabaseService } from './database.service.js';

export class AuthService {
    constructor() {
        this.requisicoes = new RequisicoesHTTP();
        this.UserData = new LoginUser();
        this.databaseService = new DatabaseService();

        this.submitButton = document.getElementById("button-login");
        this.logoutButton = document.getElementById("button-logout");
        this.accessToken = localStorage.getItem('AccessToken');

        document.getElementById('errorDiv').style.display = 'none';
        this.hideMsgError();

        if (this.accessToken) {
            this.showCentralStatusPanel();
        }

        this.setupEventListeners();
    }

    setupEventListeners() {
        if (this.submitButton) {
            this.submitButton.addEventListener("click", async (event) => {
                event.preventDefault();
                this.hideMsgError();

                this.UserData.Email = document.getElementById('user').value;
                this.UserData.Password = document.getElementById('password').value;

                this.UserData.verifyUserData(this.UserData);

                this.submitButton.classList.add('is-loading');
                const response = await this.requisicoes.post('/auth/signin', this.UserData);
                if (response?.Result) {
                    this.showCentralStatusPanel();
                    this.UserData.Password = '*';
                    const userData = { ...this.UserData };
                    userData.Token = response.Result;
                    localStorage.setItem("AccessToken", userData.Token);
                    const logData = new LogData("Login autenticado com sucesso", userData);
                    this.databaseService.insertData(logData);
                } else {
                    this.showMsgError(response);
                }
                this.submitButton.classList.remove('is-loading');
            });
        }

        if (this.logoutButton) {
            this.logoutButton.addEventListener("click", async (event) => {
                event.preventDefault();
                this.logoutButton.classList.add('is-loading');
                this.accessToken = localStorage.getItem('AccessToken');
                const response = await this.requisicoes.post('/auth/signout', {});
                if (response.Status) {
                    this.cleanInputs();
                    localStorage.removeItem('AccessToken');
                    const logData = new LogData("Usuário deslogado com sucesso e AccessToken removido do Local Storage!", this.accessToken);
                    this.databaseService.insertData(logData);
                    this.hideCentralStatusPanel();
                } else {
                    this.showMsgError(response);
                }
                this.logoutButton.classList.remove('is-loading');
            });
        }
    }

    showCentralStatusPanel() {
        const container = document.getElementsByClassName('container');
        container[0].style.display = 'none';
        container[1].style.display = 'flex';
    }

    hideCentralStatusPanel() {
        const container = document.getElementsByClassName('container');
        container[0].style.display = 'flex';
        container[1].style.display = 'none';
    }

    showMsgError(msg) {
        const errorMsgElement = document.getElementById('errorMsg');
        const errorDiv = document.getElementById('errorDiv');
        errorDiv.style.display = 'block';
        errorMsgElement.textContent = msg;
        setTimeout(() => {
            this.hideMsgError();
        }, 4000);
    }

    hideMsgError() {
        const errorMsgElement = document.getElementById('errorMsg');
        const errorDiv = document.getElementById('errorDiv');
        errorDiv.style.display = 'none';
        errorMsgElement.textContent = '';
    }

    cleanInputs() {
        document.getElementById('user').value = '';
        document.getElementById('password').value = '';
    }
};
