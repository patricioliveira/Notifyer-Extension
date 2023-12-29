import { RequisicoesHTTP } from '../../services/httpbase.service.js';
import { LoginUser } from '../../class/user-model.js';
import { LogData } from '../../class/logdata-model.js';
import { DatabaseService } from '../../services/database.service.js';

// importScripts('../../services/database.service.js');
// importScripts('../../class/logdata-model.js');

const requisicoes = new RequisicoesHTTP();
const UserData = new LoginUser();
const databaseService = new DatabaseService();

let submitButton = document.getElementById("button-login");
let logoutButton = document.getElementById("button-logout");
let token = localStorage.getItem('token');

if(token){
  showCentralStatusPanel();
}

if (submitButton != null) {  
  submitButton?.addEventListener("click", async (event) => {
    // Impede o envio padrão do formulário
    event.preventDefault();
    hideMsgError();

    UserData.username = document.getElementById('user').value;
    UserData.password = document.getElementById('password').value;
    
    //UserData.username = 'eve.holt@reqres.in';
    //UserData.password = 'cityslicka';

    UserData.verifyUserData(UserData);

    submitButton.classList.add('is-loading');

    var response = await requisicoes.post('/login', UserData);
    if(response['token']){
      showCentralStatusPanel();
      localStorage.setItem("token", response['token'])
      const logData = new LogData("Login autenticado com sucesso", UserData)
      databaseService.insertData(logData)
    }else{
      const logData = new LogData("Falha na autenticação", response['error'])
      databaseService.insertData(logData)
      showMsgError(response['error'])
    }

    submitButton.classList.remove('is-loading');
    console.log(response);

  });
}

if(logoutButton != null){
  logoutButton?.addEventListener("click", async (event) => {
    hideCentralStatusPanel();
    localStorage.removeItem('token');
  })
}

function showCentralStatusPanel(){
  let container = document.getElementsByClassName('container');
  container[0].style.display = 'none';
  container[1].style.display = 'flex';

}

function hideCentralStatusPanel(){
  let container = document.getElementsByClassName('container');
  container[0].style.display = 'flex';
  container[1].style.display = 'none';
}

function showMsgError(msg){
  let errorMsgElement = document.getElementById('errorMsg');
  errorMsgElement.textContent = msg;
}

function hideMsgError(){
  let errorMsgElement = document.getElementById('errorMsg');
  errorMsgElement.textContent = '';
}


