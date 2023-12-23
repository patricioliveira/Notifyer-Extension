import { RequisicoesHTTP } from '../../services/httpbase.service.js';
import { LoginUser } from '../../class/user.model.js';

const requisicoes = new RequisicoesHTTP();
const UserData = new LoginUser();

let submitButton = document.getElementById("button-login");
let logoutButton = document.getElementById("button-logout");

if (submitButton != null) {  
  submitButton?.addEventListener("click", async (event) => {
    // Impede o envio padrão do formulário
    event.preventDefault();

    UserData.username = document.getElementById('user').value;
    UserData.password = document.getElementById('password').value;
    
    UserData.username = 'admin2';
    UserData.password = 'password123';

    UserData.verifyUserData(UserData);

    console.log("Usuário: " + UserData.username + " - Senha: " + UserData.password);
    submitButton.classList.add('is-loading');
    var response = await requisicoes.post('/auth');
    showCentralStatusPanel();
    submitButton.classList.remove('is-loading');
    console.log(response);

  });
}

if(logoutButton != null){
  hideCentralStatusPanel();
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



