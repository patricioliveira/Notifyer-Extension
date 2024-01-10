import { RequisicoesHTTP } from '../../services/httpbase.service.js';
import { LoginUser } from '../../class/user-model.js';
import { LogData } from '../../class/logdata-model.js';
import { DatabaseService } from '../../services/database.service.js';

const requisicoes = new RequisicoesHTTP();
const UserData = new LoginUser();
const databaseService = new DatabaseService();

let submitButton = document.getElementById("button-login");
let logoutButton = document.getElementById("button-logout");
let token = localStorage.getItem('token');
document.getElementById('errorDiv').style.display = 'none';

if(token){
  showCentralStatusPanel();
}

if (submitButton != null) {  
  submitButton?.addEventListener("click", async (event) => {
    // Impede o envio padrão do formulário
    event.preventDefault();
    hideMsgError();

    UserData.Email = document.getElementById('user').value;
    UserData.Password = document.getElementById('password').value;
    
    //UserData.username = 'eve.holt@reqres.in';
    //UserData.password = 'cityslicka';

    UserData.verifyUserData(UserData);

    submitButton.classList.add('is-loading');

    var response = await requisicoes.post('/auth/signin', UserData);
    if(response['token'] ? response['token'] : response){
      showCentralStatusPanel();
      // UserData.token = response['token']
      localStorage.setItem("token", response['token'])
      const logData = new LogData("Login autenticado com sucesso", UserData)
      databaseService.insertData(logData)
    }else{
      const logData = new LogData("Falha na autenticação", response['error'] ? response['error'] : response)
      databaseService.insertData(logData)
      showMsgError(response['error'] ? response['error'] : response)
    }

    submitButton.classList.remove('is-loading');
    
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
  let errorDiv = document.getElementById('errorDiv');
  errorDiv.style.display = 'block';
  errorMsgElement.textContent = msg;
}

function hideMsgError(){
  let errorMsgElement = document.getElementById('errorMsg');
  let errorDiv = document.getElementById('errorDiv');
  errorDiv.style.display = 'none';
  errorMsgElement.textContent = '';
}


