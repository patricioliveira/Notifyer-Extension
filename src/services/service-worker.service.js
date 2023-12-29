// background.js

import { DatabaseService} from './database.service.js';
import { LogData } from '../class/logdata-model.js';

const databaseService = new DatabaseService();

chrome.runtime.onInstalled.addListener(async (details) => {
  // Criar uma instância da classe DatabaseService

  // Criar ou abrir o IndexedDB durante a instalação
  if (details.reason === 'install'){
    const db = await databaseService.openDB();
    const logData = new LogData("Extensão instalada", details);
    databaseService.insertData(logData);
  }

  else if (details.reason === 'update') {
    const logData = new LogData("Extensão atualizada", details);
    databaseService.insertData(logData);
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Ação baseada na atualização da guia
  if (changeInfo.status === "complete" && tab.url.toString().startsWith("https://instadelivery.com.br/store/orders/")){
    // Registre no logbook
    const logData = new LogData(`Recarregada a guia do Painel de Pedidos do Instadelivery da loja com id: ${tab.url.substring(42)}`, tab);
    // Chame um método para inserir os dados no IndexedDB
    databaseService.insertData(logData);
  }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  const logData = new LogData('Guia do painel de pedidos ativada e em operação', activeInfo);
  databaseService.insertData(logData)
});

chrome.storage.local.get(['key'], (result) => {
  const logData = new LogData('Dados recuperados do armazenamento local:', result);
  databaseService.insertData(logData)
});