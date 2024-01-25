import { RequisicoesHTTP } from '../../services/httpbase.service.js';
import { LoginUser } from '../../class/user-model.js';
import { LogData } from '../../class/logdata-model.js';
import { DatabaseService } from '../../services/database.service.js';

const requisicoes = new RequisicoesHTTP();
const UserData = new LoginUser();
const databaseService = new DatabaseService();

document.addEventListener('DOMContentLoaded', () => {
    let AccessToken = localStorage.getItem('AccessToken');
    AccessToken ? navigateTo('home') : navigateTo('auth');
    changeMode(true);
    onClickNavButtons();
});

function onClickNavButtons() {
    let navButtonPainel = document.getElementById('painel-navbar-menu');
    navButtonPainel?.addEventListener("click", async (event) => {
        event.preventDefault(); 
        navigateTo('painel')
    });
    let navButtonRecarga = document.getElementById('recarga-navbar-menu');
    navButtonRecarga?.addEventListener("click", async (event) => {
        event.preventDefault();
        navigateTo('recarga')
    });
    let navButtonMarketing = document.getElementById('marketing-navbar-menu');
    navButtonMarketing?.addEventListener("click", async (event) => {
        event.preventDefault();
        navigateTo('marketing')
    });
    let navButtonConta = document.getElementById('conta-navbar-menu');
    navButtonConta?.addEventListener("click", async (event) => {
        event.preventDefault();
        navigateTo('conta');
    });
};

export function navigateTo(route) {
    let container = document.getElementById('app-container');

    switch (route) {
        case 'home':
            setTimeout(() => {
                let painelHome = document.getElementById("painel-navbar-menu");
                painelHome.classList.add("is-active");
            }, 500);
            loadSPA('../pages/painel/painel.html', '../pages/painel/painel.css', '../pages/painel/painel.js', container);
            break;
        case 'painel':
            setTimeout(() => {
                let painelHome = document.getElementById("painel-navbar-menu");
                painelHome.classList.add("is-active");
            }, 500);
            loadSPA('../pages/painel/painel.html', '../pages/painel/painel.css', '../pages/painel/painel.js', container);
            break;
        case 'marketing':
                const marketing = document.getElementById("marketing-navbar-menu");
                marketing.classList.add("is-active");
            // loadSPA('../pages/marketing/marketing.html', '../pages/marketing/marketing.css', '../pages/marketing/marketing.js', container);
            loadSPA('../pages/manutenção/manutencao.html', '../pages/manutenção/manutencao.css', '../pages/manutenção/manutencao.js', container);
            break;
        case 'conta':
                const conta = document.getElementById("conta-navbar-menu");
                conta.classList.add("is-active");
            // loadSPA('../pages/conta/conta.html', '../pages/conta/conta.css', '../pages/conta/conta.js', container);
            loadSPA('../pages/manutenção/manutencao.html', '../pages/manutenção/manutencao.css', '../pages/manutenção/manutencao.js', container);
            break;
        case 'recarga':
                const recarga = document.getElementById("recarga-navbar-menu");
                recarga.classList.add("is-active");
            // loadSPA('../pages/recarga/recarga.html', '../pages/recarga/recarga.css', '../pages/recarga/recarga.js', container);
            loadSPA('../pages/manutenção/manutencao.html', '../pages/manutenção/manutencao.css', '../pages/manutenção/manutencao.js', container);
            break;
        case 'auth':
        default:
            loadSPA('../pages/auth/auth.html', '../pages/auth/auth.css', '../pages/auth/auth.js', container);
            hideNavAndFooterForAuth();
            break;
    }
}

export function loadSPA(htmlFile, cssFile, jsFile, container) {
    // Use AJAX ou outra forma de carregar o conteúdo do arquivo HTML
    // e adicionar ao container.
    
    // Remova o HTML anterior
    container.innerHTML = '';

    // Remova os scripts CSS e JS antigos
    const oldStyle = document.head.querySelector('style[data-spa]');
    const oldScript = document.head.querySelector('script[data-spa]');

    if (oldStyle) {
        document.head.removeChild(oldStyle);
    }

    if (oldScript) {
        document.head.removeChild(oldScript);
    }

    Promise.all([
        fetch(htmlFile).then(response => response.text()),
        fetch(cssFile).then(response => response.text())
    ])
        .then(([htmlContent, cssContent]) => {
            container.innerHTML = htmlContent;

            // Carregue o script JavaScript associado
            const script = document.createElement('script');
            script.src = jsFile;
            script.type = 'module';
            script.setAttribute('data-spa', 'true'); // Adicione um atributo para identificar o script
            document.head.appendChild(script);

            // Carregue os estilos CSS associados
            const style = document.createElement('style');
            style.textContent = cssContent;
            style.setAttribute('data-spa', 'true'); // Adicione um atributo para identificar o estilo
            document.head.appendChild(style);
        })
        .catch(error => console.error('Erro ao carregar SPA:', error));
}

const logoutButton = document.getElementById("button-logout");
if (logoutButton != null) {
    logoutButton?.addEventListener("click", async (event) => {
        // Impede o envio padrão do formulário
        event.preventDefault();
        let AccessToken = localStorage.getItem('AccessToken');
        let response = await requisicoes.post('/auth/signout', {});
        if (response.Status) {
            localStorage.removeItem('AccessToken');
            localStorage.removeItem('full_token_session');
            let logData = new LogData("Usuário deslogado com sucesso e AccessToken removido do Local Storage!", AccessToken)
            databaseService.insertData(logData)
            reloadPage();
        } else {
            localStorage.removeItem('AccessToken');
            alert(response);
            reloadPage();
        }
    });
}

export function reloadPage(){
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        let extensionId = chrome.runtime.id;
        let optionsPageURL = `chrome-extension://${extensionId}/src/templates/app/app.html`;
        chrome.tabs.update(tabs[0].id, { url: optionsPageURL });
    });
}

function hideNavAndFooterForAuth(){
    let nav = document.getElementById('huro-nav');
    let footer = document.getElementById('footer');
    nav.style.display = 'none';
    footer.style.display = 'none';
};

function changeMode(init) {
    let theme = localStorage.getItem('theme');
    if (init === true) {
        if (theme === 'dark') {
            let newColor = '#2d2d31';
            document.documentElement.style.setProperty('--scrollbar-thumb-color', newColor);
        } else if (theme === 'light') {
            let newColor = '#f5f6fa';
            document.documentElement.style.setProperty('--scrollbar-thumb-color', newColor);
        }
    } else if (init === false) {
        if (theme === 'dark') {
            let newColor = '#f5f6fa';
            document.documentElement.style.setProperty('--scrollbar-thumb-color', newColor);
        } else if (theme === 'light') {
            let newColor = '#3B3B41';
            document.documentElement.style.setProperty('--scrollbar-thumb-color', newColor);
        }
    }
}
