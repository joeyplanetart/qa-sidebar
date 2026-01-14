// Background Service Worker for Chrome Extension
/// <reference types="chrome"/>

// 初始化：创建右键菜单
chrome.runtime.onInstalled.addListener(() => {
  console.log('内容管理器已安装');
  
  // 创建右键菜单
  chrome.contextMenus.create({
    id: 'save-selection',
    title: '保存选中文本为片段',
    contexts: ['selection'],
  });

  chrome.contextMenus.create({
    id: 'insert-snippet',
    title: '插入片段',
    contexts: ['editable'],
  });
});

// 打开 side panel
chrome.action.onClicked.addListener((tab: chrome.tabs.Tab) => {
  if (tab.id) {
    chrome.sidePanel.open({ tabId: tab.id });
  }
});

// 监听右键菜单点击
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (!tab?.id) return;

  if (info.menuItemId === 'save-selection' && info.selectionText) {
    // 打开 side panel 并传递选中的文本
    chrome.sidePanel.open({ tabId: tab.id }).then(() => {
      setTimeout(() => {
        chrome.runtime.sendMessage({
          type: 'QUICK_SAVE',
          data: {
            content: info.selectionText,
            sourceUrl: tab.url,
          },
        });
      }, 500);
    });
  } else if (info.menuItemId === 'insert-snippet') {
    // 打开 side panel 并显示片段选择器
    chrome.sidePanel.open({ tabId: tab.id }).then(() => {
      setTimeout(() => {
        chrome.runtime.sendMessage({
          type: 'SHOW_INSERT_MODE',
          data: { tabId: tab.id },
        });
      }, 500);
    });
  }
});

// 监听来自 content script 和 side panel 的消息
chrome.runtime.onMessage.addListener(
  (
    request: { type?: string; action?: string; data?: any; text?: string; contentId?: string },
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: any) => void
  ) => {
    console.log('Background received message:', request);

    // 兼容旧消息格式
    if (request.type === 'SAVE_CONTENT') {
      if (sender.tab?.id) {
        chrome.sidePanel.open({ tabId: sender.tab.id });
        setTimeout(() => {
          chrome.runtime.sendMessage({
            type: 'NEW_CONTENT',
            data: request.data,
          });
        }, 500);
      }
      sendResponse({ success: true });
      return true;
    }

    // 处理保存选中文本
    if (request.action === 'saveSelectedText') {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          chrome.sidePanel.open({ tabId: tabs[0].id }).then(() => {
            setTimeout(() => {
              chrome.runtime.sendMessage({
                type: 'QUICK_SAVE',
                data: {
                  content: request.text,
                },
              });
            }, 500);
          });
        }
      });
      sendResponse({ success: true });
      return true;
    }

    // 处理插入文本到页面
    if (request.action === 'insertToPage') {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          chrome.tabs.sendMessage(
            tabs[0].id,
            {
              action: 'insertText',
              text: request.text,
            },
            (response) => {
              sendResponse(response);
            }
          );
        }
      });
      return true; // 保持消息通道开放
    }

    // 处理获取选中文本
    if (request.action === 'getSelectedText') {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          chrome.tabs.sendMessage(
            tabs[0].id,
            { action: 'getSelectedText' },
            (response) => {
              sendResponse(response);
            }
          );
        }
      });
      return true;
    }

    return true;
  }
);

// 监听快捷键命令
chrome.commands.onCommand.addListener((command) => {
  console.log('Command received:', command);

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    if (!tab?.id) return;

    if (command === 'insert-snippet' && tab.id) {
      // Ctrl+Shift+V - 插入片段
      chrome.sidePanel.open({ tabId: tab.id }).then(() => {
        setTimeout(() => {
          chrome.runtime.sendMessage({
            type: 'SHOW_INSERT_MODE',
            data: { tabId: tab.id },
          });
        }, 500);
      });
    } else if (command === 'save-selection' && tab.id) {
      // Ctrl+Shift+S - 保存选中文本
      chrome.tabs.sendMessage(tab.id, { action: 'getSelectedText' }, (response) => {
        if (response?.text && tab.id) {
          chrome.sidePanel.open({ tabId: tab.id }).then(() => {
            setTimeout(() => {
              chrome.runtime.sendMessage({
                type: 'QUICK_SAVE',
                data: {
                  content: response.text,
                },
              });
            }, 500);
          });
        }
      });
    }
  });
});

export {};
