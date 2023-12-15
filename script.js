(function() {
    // Intercepta a função open do XMLHttpRequest para capturar informações
    var originalOpen = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function() {
        console.log('Método: ' + arguments[0]); // Método da solicitação (GET, POST, etc.)
        console.log('URL: ' + arguments[1]); // URL da solicitação
        console.log('Cabeçalhos: ', this.getAllResponseHeaders()); // Todos os cabeçalhos da resposta
        console.log('Passou aqui!')

        // Adicione um ouvinte para capturar o corpo da resposta
        this.addEventListener('load', function() {
            console.log('Corpo da resposta: ' + this.responseText);
        });

        // Chama a função open original
        originalOpen.apply(this, arguments);
    };
})()