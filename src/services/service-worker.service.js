import { DatabaseService } from './database.service.js';
import { LogData } from '../class/logdata-model.js';

const databaseService = new DatabaseService();

chrome.runtime.onInstalled.addListener(async (details) => {
  // Criar ou abrir o IndexedDB durante a instalação
  if (details.reason === 'install') {
    try {
      const db = await databaseService.openDB();
      const logData = new LogData("Extensão instalada", details);
      await databaseService.insertData(logData);
    } catch (error) {
      console.error('Erro durante a instalação:', error);
    }
  } else if (details.reason === 'update') {
    const logData = new LogData("Extensão atualizada", details);
    await databaseService.insertData(logData);
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Ação baseada na atualização da guia
  if (changeInfo.status === "complete" && tab.url.startsWith("https://instadelivery.com.br/store/orders/")) {
    // Registre no logbook
    const logData = new LogData(`Recarregada a guia do Painel de Pedidos do Instadelivery da loja com id: ${tab.url.substring(42)}`, tab);
    // Chame um método para inserir os dados no IndexedDB
    databaseService.insertData(logData).catch(error => {
      console.error('Erro durante a atualização da guia:', error);
    });
  }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  const logData = new LogData('Guia do painel de pedidos ativada e em operação', activeInfo);
  databaseService.insertData(logData).catch(error => {
    console.error('Erro durante a ativação da guia:', error);
  });
});

chrome.commands.onCommand.addListener(function (command) {
  if (command === "openOptions") {
    // Lógica para abrir as opções da extensão
    chrome.runtime.openOptionsPage();
    const logData = new LogData('Usuário executou o comando de abertura do options', command);
    databaseService.insertData(logData).catch(error => {
      console.error('Erro durante a abertura das opções:', error);
    });
  }
});

// chrome.cookies.onChanged.addListener((changeInfo) => {
//   // Verifica se o cookie foi removido ou se foi uma adição
//   if (changeInfo.removed || (changeInfo.cause && changeInfo.cause === 'expired')) {
//     // Adiciona a lógica para inserir no log apenas para adições e expirações
//     const logData = new LogData('Alteração em cookies', changeInfo);
//     databaseService.insertData(logData).catch(error => {
//       console.error('Erro durante a alteração de cookies:', error);
//     });
//   }
// });

// Manifest V3: Substitua chrome.extension.onConnect por chrome.runtime.onConnect
chrome.runtime.onConnect.addListener((port) => {
  const logData = new LogData('Pop-up aberto', port.sender);
  databaseService.insertData(logData).catch(error => {
    console.error('Erro durante a abertura do pop-up:', error);
  });
});
