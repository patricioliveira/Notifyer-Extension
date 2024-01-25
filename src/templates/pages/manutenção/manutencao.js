import { navigateTo, reloadPage } from "../../app/app.js";

let goBackButton = document.getElementById("goBack");
if (goBackButton != null) {
    goBackButton?.addEventListener("click", async (event) => {
        // Impede o envio padrão do formulário
        event.preventDefault();
        goBack();
        reloadPage();
    });
}

function goBack() {
    disableActiveButtons();
    navigateTo('painel');
}

function disableActiveButtons(){
    let menu = document.getElementById('webapp-navbar-menu');
    let activeItem = [...menu.children].find(item => item.classList.contains('is-active'));
    activeItem.classList.remove("is-active");
};