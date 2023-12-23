const URLBASE = 'https://restful-booker.herokuapp.com';

export class RequisicoesHTTP {
    constructor(baseURL = URLBASE) {
      this.baseURL = baseURL;
    }
  
    fazerRequisicao = async (url, metodo, dados) => {
        const options = {
          method: metodo,
          headers: {
            'Content-Type': 'application/json',
          },
          body: dados ? JSON.stringify(dados) : undefined,
        };
    
        try {
          const response = await fetch(`${this.baseURL}${url}`, options);          
          return response.json();
        } catch (error) {
          console.error(`Erro no ${metodo.toUpperCase()}:`, error);
        }
      };
    
      get = url => this.fazerRequisicao(url, 'GET');
    
      post = (url, dados) => this.fazerRequisicao(url, 'POST', dados);
    
      put = (url, dados) => this.fazerRequisicao(url, 'PUT', dados);
    
      delete = url => this.fazerRequisicao(url, 'DELETE');
  }