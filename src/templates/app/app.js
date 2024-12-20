import { RequisicoesHTTP } from '../../services/httpbase.service.js';
import { LoginUser } from '../../class/user-model.js';
import { LogData } from '../../class/logdata-model.js';
import { DatabaseService } from '../../services/database.service.js';
import { notyf } from '../assets/vendor/js/components.js';

const requisicoes = new RequisicoesHTTP();
const UserData = new LoginUser();
const databaseService = new DatabaseService();

document.addEventListener('DOMContentLoaded', () => {
    let AccessToken = localStorage.getItem('AccessToken');
    AccessToken ? (verifyConnectionStatus(), navigateTo('home'), getStoreInformation(AccessToken)) : (navigateTo('auth'), localStorage.setItem('isConnected', false));
    changeMode(true);
    onClickNavButtons();
    getLogbook();
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
            let connected = localStorage.getItem('isConnected')
            if (connected == 'false') notyf.open({ type: 'info', message: 'Você está desconectado do WhatsApp! Gere o QR CODE e conecte-se agora mesmo!' });
            else if (connected == 'true') notyf.open({ type: 'info', message: 'Você já está conectado ao WhatsApp!' });
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
        .catch(error => logAndHandleError('Erro ao carregar SPA:', error));
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
            localStorage.removeItem('access_token');
            localStorage.setItem('isConnected', false);
            logAndInsertData("Usuário deslogado com sucesso e AccessToken removido do Local Storage!", AccessToken);
            reloadPage();
        } else {
            logAndHandleError('Erro ao tentar deslogar usuário', response); 
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
    let appcontainer = document.getElementById('app-container');
    appcontainer.style.marginBottom = '0 !important';
    nav.style.display = 'none';
    footer.parentElement.removeChild(footer);
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

async function verifyConnectionStatus() {
        try {
            const connectionStatus = await requisicoes.get('/session/check-connection-session');
            if (connectionStatus?.Result.status == true && connectionStatus?.Result.message == "Connected") {
                localStorage.setItem("isConnected", 'true');
            } else if (connectionStatus?.Result.status == false && connectionStatus?.Result.message == "Disconnected") {
                localStorage.setItem("isConnected", 'false');
            }
        } catch (error) {
            logAndHandleError('Houve algum problema ao verificar a conexão da sessão.', error);
        }
}

function getStoreInformation(token) {
    try {
        const [, tokenPayload] = token.split('.');
        const decodedPayload = atob(tokenPayload);
        const decodedURIComponentPayload = decodeURIComponent(escape(decodedPayload));
        const firstLetter = JSON.parse(decodedURIComponentPayload).name.charAt(0);
        setStoreName(firstLetter, JSON.parse(decodedURIComponentPayload).name);
    } catch (error) {
        logAndHandleError('Erro ao obter informações da loja a partir do token:', error);
        return error;
    }
}

function setStoreName(firstLetter, storeName){
    const app = document.getElementById('app-onboarding');
    const spanLetter = document.getElementById('firstLetter')
    app.setAttribute('data-page-title', storeName);
    spanLetter.innerText = `${firstLetter}`;
}

function getLogbook(){
    const button = document.getElementById('logButton');
    button?.addEventListener("click", async (event) => {
        exportLogbook();
    });
}

async function exportLogbook(){
    databaseService.downloadLogbook();
}

function logAndInsertData(message, data) {
    const logData = new LogData(message, data);
    databaseService.insertData(logData);
}

function logAndHandleError(message, error) {
    const logError = new LogData(message, error);
    databaseService.insertData(logError);
}
