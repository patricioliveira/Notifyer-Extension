import { RequisicoesHTTP } from './js/httpbase.js';

const requisicoes = new RequisicoesHTTP();

let btntest = document.getElementById("button-login");
if(btntest != null){
  btntest?.addEventListener("click", async () => {
    console.log("teste");
    var response = await requisicoes.get('/posts/1');
    console.log(response);

  });
}
