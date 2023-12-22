import { RequisicoesHTTP } from '../../services/httpbase.service.js';
import { LoginUser } from '../../class/user.model.js';

const requisicoes = new RequisicoesHTTP();
const UserData = new LoginUser();

let submitButton = document.getElementById("button-login");

if (submitButton != null) {
  submitButton?.addEventListener("click", async (event) => {
    // Impede o envio padrão do formulário
    event.preventDefault();

    UserData.username = document.getElementById('user').value;
    UserData.password = document.getElementById('password').value;

    UserData.verifyUserData(UserData);

    console.log("Usuário: " + UserData.username + " - Senha: " + UserData.password);
    var response = await requisicoes.get('/posts/1');
    console.log(response);

  });
}


