const URLBASE = 'http://localhost:3000/api';
 
export class RequisicoesHTTP {
    constructor(baseURL = URLBASE) {
      this.baseURL = baseURL;
    }
  
    fazerRequisicao = async (url, metodo, dados) => {
        var myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Accept-Language", "pt-PT,pt;q=0.9,en-US;q=0.8,en;q=0.7");
        myHeaders.append("Connection", "keep-alive");
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Origin", "http://localhost:3000");
        myHeaders.append("Referer", "http://localhost:3000/");
        myHeaders.append("Sec-Fetch-Dest", "empty");
        myHeaders.append("Sec-Fetch-Mode", "cors");
        myHeaders.append("Sec-Fetch-Site", "same-site");
        myHeaders.append("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36");
        myHeaders.append("sec-ch-ua", "\"Chromium\";v=\"116\", \"Not)A;Brand\";v=\"24\", \"Google Chrome\";v=\"116\"");
        myHeaders.append("sec-ch-ua-mobile", "?0");
        myHeaders.append("sec-ch-ua-platform", "\"Windows\"");


        var requestOptions = {
          method: metodo,
          headers: myHeaders,
          body: dados ? JSON.stringify(dados) : undefined,
          redirect: 'follow'
        };
    
        try {
          const response = await fetch(`${this.baseURL}${url}`, requestOptions)
          
          if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
          }

          const jsonResponse = await response.json();
          
          if (response.status === 200 && requestOptions.method === 'POST' && jsonResponse.Result) {
            document.cookie = jsonResponse.Result;
            console.log('Cookie definido:', document.cookie);
          }

          return jsonResponse;
        } catch (error) {
          console.error(`Erro no ${metodo.toUpperCase()}:`, error);
        }
      };
    
      get = url => this.fazerRequisicao(url, 'GET');
    
      post = (url, dados) => this.fazerRequisicao(url, 'POST', dados);
    
      put = (url, dados) => this.fazerRequisicao(url, 'PUT', dados);
    
      delete = url => this.fazerRequisicao(url, 'DELETE');
  }