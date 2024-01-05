# DOCUMENTAÇÃO PARA DESENVOLVEDORES - NOTIFYER TEAM

> **Análise do Projeto Notifyer Extension:**

O projeto Notifyer Extension apresenta uma extensão do Chrome que permite aos usuários notificar clientes por meio do WhatsApp a partir do painel de pedidos. Abaixo, fornecerei uma análise geral do código e como os diferentes componentes interagem entre si.

1. **Estrutura do Projeto:**
   - O projeto segue uma estrutura organizada, com diretórios distintos para CSS, imagens, libs, src, e arquivos específicos, como manifest.json e README.md.
   - A divisão em subdiretórios como `class`, `pages`, e `scripts` ajuda a manter a organização e a modularidade do código.

   - *Notifyer Extension:*
      - `css/`: Arquivos de estilo CSS.
      - `images/`: Imagens usadas na extensão.
      - `libs/`: Bibliotecas externas.
      - `src/`: Código-fonte da extensão.
         - `class/`: Classes JavaScript.
         - `pages/`: Páginas HTML específicas.
         - `scripts/`: Scripts JavaScript.
      - `manifest.json`: Configuração da extensão.
      - `README.md`: Informações restritas aos desenvolvedores internos.

2. **Manifest.json:**
   - O arquivo manifest.json configura a extensão, definindo permissões, scripts de fundo, scripts de conteúdo, ícones, etc.
   - Permite acesso a URLs específicas relacionadas ao Instadelivery.
   - Define comandos de teclado e configurações de interface do usuário.

3. **Service Worker:**
   - O arquivo `service-worker.service.js` controla eventos como instalação, atualização, ativação de guia e comandos do teclado.
   - Utiliza o IndexedDB para armazenamento local de logs da extensão.
   - Interage com outros scripts, como `logdata-model.js` e `database.service.js`.

4. **Scripts de Conteúdo e Interceptação:**
   - O script `content-script.js` é injetado nas páginas do Instadelivery e interage com elementos da interface do usuário.
   - `interceptor.js` é um script injetado para interceptar requisições AJAX específicas na página do Instadelivery.

5. **Classes e Modelos:**
   - `logdata-model.js` define a classe `LogData` para representar informações de log.
   - `user-model.js` define a classe `LoginUser` para gerenciar dados de login.
   - `database.service.js` fornece funcionalidades para interagir com o IndexedDB.

6. **HTTP Requests:**
   - O arquivo `httpbase.service.js` contém a classe `RequisicoesHTTP` para realizar requisições HTTP utilizando fetch.

7. **Página Pop-up e Opções:**
   - `popup.js` controla a interação com a página pop-up da extensão, manipulando eventos como login, logout, e exibição de mensagens de erro.
   - A página de opções está configurada em `options.html`.

8. **Conteúdo Relacionado ao WhatsApp:**
   - O script `interceptor.js` captura informações de pedidos e os envia para um servidor WhatsApp, permitindo notificações aos clientes.

----------------------------------------------------------------------------------------------------------------------------------------------------------------------

> **logdata-model.js - Documentação**

Este arquivo, `logdata-model.js`, contém a definição da classe `LogData`, responsável por representar dados de log na extensão Notifyer para o Chrome.

**Classe: LogData**

A classe `LogData` é projetada para encapsular informações relacionadas a ações específicas realizadas pela extensão. Cada instância desta classe contém os seguintes atributos:

- `action` (string): Ação específica realizada que será registrada no log.
- `details` (string): Detalhes adicionais sobre a ação, proporcionando informações contextuais para o log.
- `timestamp` (string): Marca de tempo representando o momento da criação do objeto `LogData`. O timestamp é gerado no formato ISO 8601.

**Método Construtor:**

```javascript
/**
 * @constructor
 * @param {string} action - Ação realizada que será registrada no log.
 * @param {string} details - Detalhes adicionais sobre a ação para o log.
 */
constructor(action, details) {
    this.action = action;
    this.details = details;
    this.timestamp = new Date().toISOString();
}
```

O método construtor aceita dois parâmetros, `action` e `details`, para inicializar os atributos da instância. Além disso, o timestamp é automaticamente gerado durante a criação do objeto `LogData`.

----------------------------------------------------------------------------------------------------------------------------------------------------------------------


> **user-model.js - Documentação**

Este arquivo, `user-model.js`, contém a definição da classe `LoginUser`, que é responsável por realizar operações relacionadas ao login de usuários na extensão Notifyer para o Chrome.

**Classe: LoginUser**

A classe `LoginUser` possui os seguintes atributos:

- `username` (string): O nome de usuário do usuário.
- `password` (string): A senha do usuário (inicializada como uma string vazia por padrão).

**Método: verifyUserData**

Este método é responsável por verificar os dados do usuário durante o processo de login. Ele aceita um parâmetro `loginData`, que representa os dados de login do usuário, e lança uma exceção se os dados não são válidos.

```javascript
/**
 * Verifica os dados do usuário.
 * @param {LoginData} loginData - Os dados de login do usuário.
 * @throws {Exception} Lança uma exceção se os dados do usuário forem inválidos.
 */
verifyUserData(loginData) {
    // Lógica de verificação dos dados do usuário aqui.
    // Lança uma exceção se os dados não são válidos.
    if (loginData.username === '' || loginData.password === '') {
        throw new Exception("Inserir dados para fazer o login");
    }
}
```

Este método utiliza uma lógica simples para verificar se tanto o nome de usuário quanto a senha foram fornecidos. Se algum dos campos estiver vazio, uma exceção é lançada, indicando que é necessário inserir dados para realizar o login.

---------------------------------------------------------------------------------------------------------------------------------------------------------------------


> **popup.js - Documentação**

Este arquivo, `popup.js`, implementa o comportamento associado à interface de popup da extensão Notifyer para o Chrome. Ele lida com operações relacionadas ao login do usuário e exibição de mensagens de erro.

**Módulos Importados:**
- `RequisicoesHTTP`: Módulo para realizar requisições HTTP, importado de `httpbase.service.js`.
- `LoginUser`: Classe que representa dados de usuário e contém métodos para verificar dados de login, importada de `user-model.js`.
- `LogData`: Classe que representa dados de log, importada de `logdata-model.js`.
- `DatabaseService`: Serviço para interagir com um banco de dados, importado de `database.service.js`.

**Instâncias:**
- `requisicoes`: Instância da classe `RequisicoesHTTP` para realizar requisições HTTP.
- `UserData`: Instância da classe `LoginUser` para armazenar dados do usuário.
- `databaseService`: Instância do serviço `DatabaseService` para interação com o banco de dados.

**Elementos do DOM:**
- `submitButton`: Botão para enviar formulário de login.
- `logoutButton`: Botão para efetuar logout.
- `token`: Variável que armazena o token do usuário (recuperado do armazenamento local).
- `errorDiv`: Elemento do DOM para exibir mensagens de erro.

**Funcionalidades:**
1. **Autenticação do Usuário:**
   - O código intercepta o clique no botão de login (`submitButton`) e realiza as seguintes ações:
     - Impede o envio padrão do formulário.
     - Recupera os dados do usuário do formulário.
     - Verifica os dados do usuário usando o método `verifyUserData` da classe `LoginUser`.
     - Envia uma requisição de login (`POST /login`) usando a instância `requisicoes`.
     - Se a autenticação for bem-sucedida, exibe o painel central e armazena o token no armazenamento local.
     - Registra a ação de login no banco de dados usando a classe `LogData` e `databaseService`.
     - Em caso de falha na autenticação, exibe uma mensagem de erro e registra a falha no banco de dados.

2. **Logout do Usuário:**
   - O código intercepta o clique no botão de logout (`logoutButton`) e oculta o painel central. Remove o token do armazenamento local.

3. **Funções Auxiliares:**
   - `showCentralStatusPanel`: Exibe o painel central, ocultando o painel de login.
   - `hideCentralStatusPanel`: Oculta o painel central, exibindo o painel de login.
   - `showMsgError`: Exibe uma mensagem de erro no painel de erro, com a mensagem fornecida como parâmetro.
   - `hideMsgError`: Oculta o painel de erro.

Este arquivo fornece a lógica necessária para interação com a interface de usuário relacionada ao login na extensão Notifyer.

----------------------------------------------------------------------------------------------------------------------------------------------------------------------

> **content-script.js - Documentação**

Este arquivo, `content-script.js`, atua como um script de conteúdo para a extensão Notifyer no Chrome. Ele é responsável por injetar dinamicamente o script `interceptor.js` na página web em que a extensão está ativa.

**Funções e Código:**

1. **Função `nullthrows`:**
   - Esta função é uma função utilitária que lança um erro se o valor passado como argumento for `null` ou `undefined`.
   ```javascript
   const nullthrows = (v) => {
       if (v == null) throw new Error("it's a null");
       return v;
   }
   ```

2. **Função `injectCode`:**
   - Esta função é responsável por injetar o script `interceptor.js` na página web.
   - Exibe um alerta indicando que a extensão Notifyer está processando a integração com o painel de pedidos e solicita que a página seja recarregada.
   - Cria um elemento `<script>` e define seu atributo `src` para o caminhao do script `interceptor.js`.
   - Quando o script é carregado com sucesso, exibe outro alerta indicando que a integração foi concluída com sucesso.
   ```javascript
   function injectCode(src) {
       const script = document.createElement('script');
       alert("O notifyer está processando a integração com seu painel de pedidos, por favor recarregar a página!");
       script.src = src;
       script.onload = function() {
           alert("Integração com o painel de pedidos foi concluída com sucesso!");
           console.log("Script carregado com sucesso.");
       };
       nullthrows(document.head || document.documentElement).appendChild(script);
   }
   ```

3. **Chamada para `injectCode`:**
   - Finalmente, há uma chamada para `injectCode` que injeta o script `interceptor.js` na página.
   ```javascript
   injectCode(chrome.runtime.getURL('src/scripts/interceptor.js'));
   ```

Este arquivo facilita a integração do script `interceptor.js` na página web e fornece uma mensagem visual para o usuário sobre o processo de integração.

----------------------------------------------------------------------------------------------------------------------------------------------------------------------


> **interceptor.js - Documentação**

Este arquivo, `interceptor.js`, atua como um script de interceptação para a extensão Notifyer no Chrome. Ele intercepta requisições XMLHttpRequest realizadas para a URL padrão específica e envia notificações através de uma API de mensagens.

**Classes:**

1. **Classe `Order`:**
   - Esta classe é responsável por representar dados de um pedido. Ela possui atributos que correspondem aos diferentes campos associados a um pedido.

   **Método `convertToWhatsAppFormat`:**
   - Este método converte a mensagem original do pedido para um formato adequado para o WhatsApp, removendo quebras de linha duplicadas, asteriscos extras e partes específicas.

2. **Classe `Notification` (herda de `Order`):**
   - Esta classe estende a classe `Order` e adiciona funcionalidades específicas para notificações, incluindo a capacidade de enviar mensagens através de uma API.

   **Atributos:**
   - `sessionToken`: Token de sessão para autenticação na API de mensagens.
   - `method`: Método da API de mensagens a ser utilizado.
   - `urlApi`: URL completa da API de mensagens, incluindo o token de sessão e o método.

   **Método `sendToAPI`:**
   - Este método envia uma mensagem para a API de mensagens, utilizando a mensagem formatada do pedido. Ele realiza uma requisição POST para a API, tratando os resultados e erros.

**Função Principal (IIFE):**
- O arquivo inclui uma função imediatamente invocada (IIFE) que intercepta a função `open` do `XMLHttpRequest` para capturar informações sobre requisições realizadas para a URL desejada.

**Comentários Adicionais:**
- O script faz uso do padrão de URL `https://app.instadelivery.com.br/api/stores/orders/` para identificar requisições relevantes.
- A função `open` do `XMLHttpRequest` é interceptada para monitorar pedidos realizados pelo cliente.
- A resposta do pedido é processada para criar uma instância da classe `Notification`, que, por sua vez, envia a mensagem formatada para a API de mensagens.

**Observação:**
- O código possui comentários informativos, mas pode ser útil revisar detalhes específicos de implementação, como as condições para envio de mensagem na função `sendToAPI` e a manipulação de status do pedido.

----------------------------------------------------------------------------------------------------------------------------------------------------------------------


> **database.service.js - Documentação**

Este arquivo, `database.service.js`, define a classe `DatabaseService` responsável por interagir com um banco de dados IndexedDB para armazenar dados de log da extensão Notifyer no Chrome.

**Classe: `DatabaseService`**

1. **Atributos:**
   - `DB_NAME` (string): Nome do banco de dados.
   - `DB_VERSION` (number): Versão do banco de dados.
   - `db` (IndexedDB): Referência para o banco de dados.
   - `resolve` (function): Função de resolução da Promise.
   - `reject` (function): Função de rejeição da Promise.

2. **Método `openDB`:**
   - Este método abre ou cria o banco de dados, retornando uma Promise que é resolvida com a referência para o banco de dados.
   - Utiliza o IndexedDB para interagir com o banco.

3. **Método `insertData`:**
   - Este método insere dados no banco de dados. Aceita um objeto `Data` com atributos `action`, `details`, e `timestamp`.
   - Retorna uma Promise que é resolvida se a operação for bem-sucedida e rejeitada em caso de erro.

4. **Método `updateData`:**
   - Este método atualiza dados no banco de dados com base no ID fornecido. Aceita um ID e um objeto `newData` para atualização.
   - Retorna uma Promise que é resolvida se a operação for bem-sucedida e rejeitada em caso de erro.

5. **Método `deleteData`:**
   - Este método exclui dados do banco de dados com base no ID fornecido.
   - Retorna uma Promise que é resolvida se a operação for bem-sucedida e rejeitada em caso de erro.

6. **Método `getAllData`:**
   - Este método retorna todos os dados armazenados no banco de dados.
   - Retorna uma Promise que é resolvida com uma matriz de dados ou rejeitada em caso de erro.

**Uso Geral:**
- A classe `DatabaseService` é projetada para interagir com um banco de dados IndexedDB e fornece métodos para operações comuns, como inserção, atualização, exclusão e recuperação de dados.

**Observações:**
- O código utiliza o IndexedDB para a manipulação do banco de dados, uma API de banco de dados embutida nos navegadores modernos.
- A estrutura do banco de dados inclui uma única loja de objetos chamada "logbook" para armazenar os registros de log.

----------------------------------------------------------------------------------------------------------------------------------------------------------------------


> **httpbase.service.js - Documentação**

Este arquivo, `httpbase.service.js`, define a classe `RequisicoesHTTP` responsável por realizar requisições HTTP utilizando o Fetch API. A classe simplifica a comunicação com a API fornecendo métodos para realizar operações comuns de CRUD.

**Classe: `RequisicoesHTTP`**

1. **Constante:**
   - `URLBASE` (string): URL base para as requisições, definida como `'https://reqres.in/api'`.

2. **Método Construtor:**
   - Constrói uma instância da classe com a URL base fornecida como parâmetro. Se nenhuma URL base for fornecida, utiliza a constante `URLBASE`.

3. **Método `fazerRequisicao`:**
   - Este método é utilizado internamente para realizar a requisição HTTP básica utilizando o Fetch API.
   - Aceita uma URL, um método (GET, POST, PUT, DELETE), e dados opcionais para o corpo da requisição.
   - Retorna uma Promise que é resolvida com os dados JSON da resposta ou imprime um erro no console em caso de falha.

4. **Método `get`:**
   - Este método utiliza o método `fazerRequisicao` para realizar uma requisição GET.
   - Aceita uma URL como parâmetro.
   - Retorna uma Promise que é resolvida com os dados JSON da resposta.

5. **Método `post`:**
   - Este método utiliza o método `fazerRequisicao` para realizar uma requisição POST.
   - Aceita uma URL e dados para o corpo da requisição como parâmetros.
   - Retorna uma Promise que é resolvida com os dados JSON da resposta.

6. **Método `put`:**
   - Este método utiliza o método `fazerRequisicao` para realizar uma requisição PUT.
   - Aceita uma URL e dados para o corpo da requisição como parâmetros.
   - Retorna uma Promise que é resolvida com os dados JSON da resposta.

7. **Método `delete`:**
   - Este método utiliza o método `fazerRequisicao` para realizar uma requisição DELETE.
   - Aceita uma URL como parâmetro.
   - Retorna uma Promise que é resolvida com os dados JSON da resposta.

**Uso Geral:**
- A classe `RequisicoesHTTP` fornece uma interface simples para realizar requisições HTTP utilizando o Fetch API.
- A URL base pode ser personalizada ao criar uma instância da classe, mas é definida como `'https://reqres.in/api'` por padrão.

**Observações:**
- Os métodos `get`, `post`, `put`, e `delete` são métodos de conveniência que encapsulam a lógica do método `fazerRequisicao`.
- O código utiliza a API Fetch, que é nativa nos navegadores modernos, para realizar requisições assíncronas.


----------------------------------------------------------------------------------------------------------------------------------------------------------------------


> **service-worker.service.js - Documentação**

Este arquivo, `service-worker.service.js`, contém um script do Service Worker para a extensão Notifyer no Chrome. Ele utiliza o Service Worker para realizar ações específicas em eventos como a instalação, atualização e interações com guias.

**Importações:**
1. `DatabaseService`: Importação da classe `DatabaseService` do arquivo `database.service.js`.
2. `LogData`: Importação da classe `LogData` do arquivo `logdata-model.js`.

**Variáveis:**
1. `databaseService`: Instância da classe `DatabaseService` para interação com o banco de dados IndexedDB.

**Eventos:**

1. **`chrome.runtime.onInstalled` (Instalação/Atualização):**
   - Este evento é acionado quando a extensão é instalada ou atualizada.
   - Durante a instalação, cria ou abre o IndexedDB usando a instância de `DatabaseService` e insere um registro de log indicando a instalação.
   - Durante a atualização, insere um registro de log indicando a atualização.

2. **`chrome.tabs.onUpdated` (Atualização de Guia):**
   - Este evento é acionado quando uma guia é atualizada.
   - Verifica se a guia foi completamente carregada e se a URL inicia com "https://instadelivery.com.br/store/orders/".
   - Se a condição for atendida, registra no logbook informações sobre a recarga da guia do Painel de Pedidos do Instadelivery.

3. **`chrome.tabs.onActivated` (Ativação de Guia):**
   - Este evento é acionado quando uma guia é ativada.
   - Registra no logbook informações sobre a ativação da guia do Painel de Pedidos.

4. **`chrome.storage.local.get` (Recuperação de Dados do Armazenamento Local):**
   - Este evento é acionado para recuperar dados do armazenamento local.
   - Registra no logbook informações sobre os dados recuperados do armazenamento local.

5. **`chrome.commands.onCommand` (Comandos do Teclado):**
   - Este evento é acionado quando um comando do teclado é executado.
   - Verifica se o comando é "openOptions" e, se for, abre a página de opções da extensão.

**Uso Geral:**
- O script do Service Worker é utilizado para executar ações específicas em resposta a eventos como instalação, atualização e interações com guias e comandos do teclado.

**Observações:**
- O código utiliza o IndexedDB para a persistência local de logs da extensão.
- Eventos específicos são registrados no logbook, proporcionando uma visão das interações e eventos significativos da extensão.


---------------------------------------------------------------------------------------------------------------------------------------------------------------------


> **manifest.json - Documentação**

O arquivo `manifest.json` é um arquivo de manifesto que fornece informações essenciais sobre a extensão Notifyer. Ele contém detalhes sobre a estrutura da extensão, permissões necessárias, configurações de interface e outros elementos essenciais.

**Principais Campos:**

1. **`manifest_version`:**
   - Indica a versão do manifesto. O valor "3" indica que é um manifesto compatível com a versão 3 da extensão do Chrome.

2. **`name`:**
   - Nome da extensão. No caso, "Notifyer Extension".

3. **`description`:**
   - Descrição breve da extensão. No caso, "Notifique os clientes do seu negócio pelo WhatsApp a partir do seu painel de pedidos."

4. **`version`:**
   - Número de versão da extensão. No caso, "1.0".

5. **`author`:**
   - Autor da extensão. No caso, "Notifyer Team".

6. **`permissions`:**
   - Lista de permissões necessárias para a extensão. Inclui "debugger", "tabs", "storage" e "scripting".

7. **`host_permissions`:**
   - Permissões concedidas a URLs específicas. Neste caso, a extensão tem acesso a URLs que começam com "https://instadelivery.com.br/".

8. **`options_page`:**
   - Página de opções da extensão. No caso, "/src/pages/options/options.html".

9. **`action`:**
   - Configurações para a ação da extensão.
     - `default_popup`: Página popup padrão ao clicar no ícone.
     - `default_icon`: Ícones padrão para diferentes tamanhos.

10. **`icons`:**
    - Ícones da extensão para diferentes tamanhos.

11. **`background`:**
    - Configurações para o script de fundo.
      - `service_worker`: Especifica o Service Worker utilizado.
      - `script`: Lista de scripts de fundo.
      - `type`: Tipo de módulo, indicando que os scripts de fundo são módulos JavaScript.

12. **`content_scripts`:**
    - Configurações para scripts de conteúdo injetados em páginas específicas.
      - `matches`: URLs correspondentes às quais o script será injetado.
      - `js`: Lista de scripts a serem injetados.
      - `run_at`: Momento em que o script deve ser executado, neste caso, "document_end".

13. **`web_accessible_resources`:**
    - Recursos da extensão que podem ser acessados por páginas web.
      - `resources`: Lista de recursos.
      - `matches`: URLs correspondentes autorizadas a acessar esses recursos.

14. **`commands`:**
    - Comandos de teclado definidos para a extensão.
      - `openOptions`: Comando para abrir as opções da extensão.
        - `suggested_key`: Tecla sugerida para o comando, neste caso, "Ctrl+Shift+Y".
        - `description`: Descrição do comando, neste caso, "Abre as opções da extensão".

**Uso Geral:**
- O manifesto define a estrutura e o comportamento da extensão Notifyer, incluindo permissões, scripts de fundo, scripts de conteúdo e configurações da interface do usuário.

**Observações:**
- O manifesto é essencial para configurar e descrever uma extensão do Chrome.
- Os campos específicos, como permissões e URLs correspondentes, são cruciais para o funcionamento correto da extensão.

----------------------------------------------------------------------------------------------------------------------------------------------------------------------

