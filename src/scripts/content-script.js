//inject.js

const nullthrows = (v) => {
    if (v == null) throw new Error("it's a null");
    return v;
}

function injectCode(src) {
    const script = document.createElement('script');
    alert("O notifyer está processando a integração com seu painel de pedidos, por favor recarregar a página!");
    // This is why it works!
    script.src = src;
    script.onload = function() {
        alert("integração com o painel de pedidos foi concluída com sucesso!");
        console.log("script")
    };
    // This script runs before the <head> element is created,
    // so we add the script to <html> instead.
    nullthrows(document.head || document.documentElement).appendChild(script);
}


injectCode(chrome.runtime.getURL('src/scripts/interceptor.js'));