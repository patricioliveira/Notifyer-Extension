import { DatabaseService } from "./database.service.js";
import { LogData } from "../class/logdata-model.js";

const URLBASE = 'http://localhost:3000/api';
const databaseService = new DatabaseService(); 
export class RequisicoesHTTP {
    constructor(baseURL = URLBASE) {
      this.baseURL = baseURL;
    }
      
    fazerRequisicao = async (url, metodo, dados) => {
        let cookie = ""
        if(!cookie)
          cookie = localStorage.getItem("access_token");

        var myHeaders = new Headers();
          myHeaders.append("Accept", "application/json");
          myHeaders.append("Accept-Language", "pt-PT,pt;q=0.9,en-US;q=0.8,en;q=0.7");
          myHeaders.append("Connection", "keep-alive");
          myHeaders.append("Content-Type", "application/json");
          myHeaders.append("Sec-Fetch-Dest", "empty");
          myHeaders.append("Sec-Fetch-Mode", "cors");
          myHeaders.append("Sec-Fetch-Site", "same-site");
          myHeaders.append("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36");
          myHeaders.append("sec-ch-ua", "\"Chromium\";v=\"116\", \"Not)A;Brand\";v=\"24\", \"Google Chrome\";v=\"116\"");
          myHeaders.append("sec-ch-ua-mobile", "?0");
          myHeaders.append("sec-ch-ua-platform", "\"Windows\"");
          if (cookie)
            myHeaders.append("Cookie", "access_token=" + cookie);

        var requestOptions = {
          method: metodo,
          headers: myHeaders,
          body: dados ? JSON.stringify(dados) : undefined,
          redirect: 'follow'
        };
    
        try {
          const response = await fetch(`${this.baseURL}${url}`, requestOptions)
            
          if (!response.ok) {
            let erro = response.status == 401 ? "Usuário não autenticado! Verifique suas informações de login!" : `Erro na requisição: ${response.status} - ${response.statusText}`;
            let logData = new LogData(erro, JSON.stringify(dados));
            databaseService.insertData(logData);
            throw new Error(`${erro}`);
          }else{
            const jsonResponse = await response.json();
            if (requestOptions.method === 'POST' && (url.includes('signin') || url.includes('generate-token'))){
              chrome.cookies.set({
                "name": "access_token",
                "url": "https://instadelivery.com.br/",
                "value": jsonResponse.Result
              });
              localStorage.setItem("access_token", jsonResponse.Result)
            }

            return jsonResponse;
          }
        } catch (error) {return error}
      };
    
      get = (url) => this.fazerRequisicao(url, 'GET');
    
      post = (url, dados) => this.fazerRequisicao(url, 'POST', dados);
    
      put = (url, dados) => this.fazerRequisicao(url, 'PUT', dados);
    
      delete = url => this.fazerRequisicao(url, 'DELETE');
  }