//inject.js

const meuCookieNome = 'access_token';

const nullthrows = (v) => {
    if (v == null) throw new Error("it's a null");
    return v;
}

function cookieValido(cookieNome) {
    const cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();

        if (cookie.startsWith(cookieNome + '=')) {
            const cookieInfo = cookie.substring(cookieNome.length + 1);
            const cookieValor = decodeURIComponent(cookieInfo.split(';')[0]);

            // Verifica se o valor do cookie não está vazio
            if (cookieValor === '') {
                return false;
            }

            // Verifica o tempo de expiração do cookie
            const cookieExpira = cookieInfo.match(/expires=([^;]*)/);
            if (cookieExpira) {
                const expiraData = new Date(cookieExpira[1]);
                if (expiraData < new Date()) {
                    return false; // Cookie expirado
                }
            }

            return true; // Cookie presente, com valor e não expirado
        }
    }

    // Retorna falso se o cookie não for encontrado
    return false;
}

function injectCode(src) {
    const script = document.createElement('script');
    // This is why it works!
    script.src = src;
    script.onload = () => {
        alert("Integração do Notifyer com o painel de pedidos foi concluída com sucesso!");
    };
    // This script runs before the <head> element is created,
    // so we add the script to <html> instead.
    nullthrows(document.head || document.documentElement).appendChild(script);
}

let cookieEstaPresente = cookieValido(meuCookieNome);

let fullTokenSession = localStorage.getItem('full_token_session');

if (cookieEstaPresente && fullTokenSession) {
    injectCode(chrome.runtime.getURL('src/scripts/interceptor.js'));
};