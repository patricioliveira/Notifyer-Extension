// background.js

importScripts('./src/class/logdata-model.js');
importScripts('./src/services/database.service.js');

chrome.runtime.onInstalled.addListener(async (details) => {
  // Criar uma instância da classe DatabaseService
  const databaseService = new DatabaseService();

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
  const databaseService = new DatabaseService();

  if (changeInfo.status === "complete" && tab.url.toString().startsWith("https://instadelivery.com.br/store/orders/")){
    // Registre no logbook
    const logData = new LogData(`Recarregada a guia do Painel de Pedidos do Instadelivery da loja com id: ${tab.url.substring(42)}`, tab);
    // Chame um método para inserir os dados no IndexedDB
    databaseService.insertData(logData);
  }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  const databaseService = new DatabaseService();

  const logData = new LogData('Guia do painel de pedidos ativada e em operação', activeInfo);
  databaseService.insertData(logData)
});

chrome.storage.local.get(['key'], (result) => {
  const databaseService = new DatabaseService();

  const logData = new LogData('Dados recuperados do armazenamento local:', result);
  databaseService.insertData(logData)
});