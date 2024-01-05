# Notifyer Extension

<img src="./images/logo_readme.jpg" alt="Notifyer">

Uma extensão personalizada para o Chrome projetada exclusivamente para uso interno, permitindo que a equipe de desenvolvimento da Notifyer Team notifique os clientes pelo WhatsApp diretamente do painel de pedidos do Instadelivery.

## Visão Geral do Projeto

O projeto consiste em uma extensão do Chrome desenvolvida para facilitar a comunicação com os clientes por meio do WhatsApp. Aqui estão alguns detalhes importantes:

- **Estrutura do Projeto:**
  - `css/`: Arquivos de estilo CSS.
  - `images/`: Imagens usadas na extensão.
  - `libs/`: Bibliotecas externas.
  - `src/`: Código-fonte da extensão.
    - `class/`: Classes JavaScript.
    - `pages/`: Páginas HTML específicas.
    - `scripts/`: Scripts JavaScript.
  - `manifest.json`: Configuração da extensão.
  - `README.md`: Informações restritas aos desenvolvedores.

- **Principais Recursos:**
  - Integração com o painel de pedidos do Instadelivery. (EM BREVE OUTRAS PLATAFORMAS)
  - Envio automático de mensagens via WhatsApp.

## Instruções para Desenvolvedores

### Pré-requisitos

- Acesso ao painel de pedidos do Instadelivery.
- Ambiente de desenvolvimento com Node.js e npm instalados.

### Configuração Local

1. Peça para ser colaborador e depois clone o repositório:
   ```bash
   git clone github.com/patricioliveira/Notifyer-Extension
   ```

2. Navegue até o diretório do projeto:
   ```bash
   cd Notifyer-Extension
   ```

3. Instale as dependências:
   ```bash
   npm install
   ```

### Testes Locais

1. Abra o Google Chrome.

2. Acesse `chrome://extensions/`.

3. Ative o modo de desenvolvedor.

4. Clique em "Carregar sem compactação" e selecione a pasta do projeto.

### Recursos Chave

- A extensão intercepta eventos relacionados aos pedidos do Instadelivery.
- As mensagens de log são armazenadas localmente no IndexedDB.

### Comandos Úteis

- `Ctrl+Shift+Y`: Abre as opções da extensão.

### Avisos Importantes

- Garanta as permissões necessárias para acessar o painel de pedidos do Instadelivery.
- Realize testes cuidadosos antes de enviar alterações.
- As alterações devem ser feitas obrigatóriamente na branch Working e após testar e confirmar alterações fazer o merge para a Main.

### Contato

Para dúvidas ou assistência, entre em contato com Patrício Oliveira ou Paulo Sérgio.

### Licença

Este projeto é restrito e não possui uma licença pública.

---

# Integração com o Notifyer Connect Server

Esta extensão funciona em conjunto com o Notifyer Connect Server, que é a API responsável por buscar dados em `interceptor.js`.
