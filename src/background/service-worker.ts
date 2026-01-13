// Background Service Worker for Chrome Extension
/// <reference types="chrome"/>

chrome.runtime.onInstalled.addListener(() => {
  console.log('内容管理器已安装');
});

// 打开 side panel
chrome.action.onClicked.addListener((tab: chrome.tabs.Tab) => {
  if (tab.id) {
    chrome.sidePanel.open({ tabId: tab.id });
  }
});

// 监听来自 content script 的消息
chrome.runtime.onMessage.addListener(
  (
    request: { type: string; data?: any },
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: any) => void
  ) => {
    if (request.type === 'SAVE_CONTENT') {
      // 打开 side panel 并传递内容
      if (sender.tab?.id) {
        chrome.sidePanel.open({ tabId: sender.tab.id });
        // 延迟发送消息，确保 side panel 已打开
        setTimeout(() => {
          chrome.runtime.sendMessage({
            type: 'NEW_CONTENT',
            data: request.data,
          });
        }, 500);
      }
      sendResponse({ success: true });
    }
    return true;
  }
);

export {};
