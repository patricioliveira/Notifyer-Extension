import { RequisicoesHTTP } from './js/httpbase.js';

const requisicoes = new RequisicoesHTTP();

let usuario = document.getElementById("user").v;
let senha = document.getElementById("password");

let submitButton = document.getElementById("button-login");

if (submitButton != null && usuario != null && senha != null) {
  submitButton?.addEventListener("click", async () => {
    console.log(usuario + " - " + senha);
    var response = await requisicoes.get('/posts/1');
    console.log(response);

  });
}
