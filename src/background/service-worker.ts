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
  const tabId = tab?.id;
  if (!tabId) return;

  if (info.menuItemId === 'save-selection' && info.selectionText) {
    // 必须立即打开 side panel（在用户手势的同步响应中）
    const fallbackText = info.selectionText || '';
    const sourceUrl = tab?.url;
    
    // 立即打开 side panel
    chrome.sidePanel.open({ tabId }).then(() => {
      // 打开成功后，尝试从 content script 获取富文本内容
      chrome.tabs.sendMessage(
        tabId,
        { action: 'getSelectedContent' },
        (response) => {
          // 处理 content script 未响应的情况（如 chrome:// 页面）
          const lastError = chrome.runtime.lastError;
          if (lastError) {
            console.log('Content script not available:', lastError.message);
          }
          
          const text = response?.text || fallbackText;
          const formattedHtml = response?.html || '';
          
          // 发送消息给 side panel
          setTimeout(() => {
            chrome.runtime.sendMessage({
              type: 'QUICK_SAVE',
              data: {
                content: text,
                formattedHtml: formattedHtml || undefined,
                sourceUrl,
              },
            });
          }, 300);
        }
      );
    }).catch((err) => {
      console.error('Failed to open side panel:', err);
    });
  } else if (info.menuItemId === 'insert-snippet') {
    // 打开 side panel 并显示片段选择器
    chrome.sidePanel.open({ tabId }).then(() => {
      setTimeout(() => {
        chrome.runtime.sendMessage({
          type: 'SHOW_INSERT_MODE',
          data: { tabId },
        });
      }, 500);
    }).catch((err) => {
      console.error('Failed to open side panel:', err);
    });
  }
});

// 监听来自 content script 和 side panel 的消息
chrome.runtime.onMessage.addListener(
  (
    request: { type?: string; action?: string; data?: any; text?: string; html?: string; contentId?: string },
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: any) => void
  ) => {
    console.log('Background received message:', request);

    // 兼容旧消息格式
    if (request.type === 'SAVE_CONTENT') {
      const senderTabId = sender.tab?.id;
      if (senderTabId) {
        chrome.sidePanel.open({ tabId: senderTabId }).then(() => {
          setTimeout(() => {
            chrome.runtime.sendMessage({
              type: 'NEW_CONTENT',
              data: request.data,
            });
          }, 300);
        }).catch((err) => {
          // 如果无法打开 side panel，直接发送消息
          console.log('Could not auto-open side panel:', err);
          chrome.runtime.sendMessage({
            type: 'NEW_CONTENT',
            data: request.data,
          });
        });
      }
      sendResponse({ success: true });
      return true;
    }

    // 处理保存选中文本（来自 content script 的快捷键）
    // 注意：这个调用可能会失败，因为不是直接的用户手势响应
    // 但 Chrome 对快捷键有特殊处理，可能会允许
    if (request.action === 'saveSelectedText') {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTabId = tabs[0]?.id;
        if (activeTabId) {
          // 尝试打开 side panel，如果失败则忽略（用户可以手动打开）
          chrome.sidePanel.open({ tabId: activeTabId }).then(() => {
            setTimeout(() => {
              chrome.runtime.sendMessage({
                type: 'QUICK_SAVE',
                data: {
                  content: request.text,
                  formattedHtml: request.html || undefined,
                },
              });
            }, 300);
          }).catch((err) => {
            // 如果无法打开 side panel，直接发送消息（假设 side panel 已经打开）
            console.log('Could not auto-open side panel, sending message anyway:', err);
            chrome.runtime.sendMessage({
              type: 'QUICK_SAVE',
              data: {
                content: request.text,
                formattedHtml: request.html || undefined,
              },
            });
          });
        }
      });
      sendResponse({ success: true });
      return true;
    }

    // 处理插入文本到页面
    if (request.action === 'insertToPage') {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTabId = tabs[0]?.id;
        if (activeTabId) {
          chrome.tabs.sendMessage(
            activeTabId,
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
        const activeTabId = tabs[0]?.id;
        if (activeTabId) {
          chrome.tabs.sendMessage(
            activeTabId,
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
    const tabId = tab?.id;
    if (!tabId) return;

    if (command === 'insert-snippet') {
      // Ctrl+Shift+V - 插入片段
      chrome.sidePanel.open({ tabId }).then(() => {
        setTimeout(() => {
          chrome.runtime.sendMessage({
            type: 'SHOW_INSERT_MODE',
            data: { tabId },
          });
        }, 500);
      }).catch((err) => {
        console.error('Failed to open side panel:', err);
      });
    } else if (command === 'save-selection') {
      // Alt+Shift+S / Cmd+Shift+D - 保存选中文本
      // 必须立即打开 side panel（在用户手势的同步响应中）
      chrome.sidePanel.open({ tabId }).then(() => {
        // 打开成功后，获取选中内容
        chrome.tabs.sendMessage(tabId, { action: 'getSelectedContent' }, (response) => {
          // 处理 content script 未响应的情况
          const lastError = chrome.runtime.lastError;
          if (lastError) {
            console.log('Content script not available:', lastError.message);
          }
          
          const content = response?.text;
          if (content) {
            setTimeout(() => {
              chrome.runtime.sendMessage({
                type: 'QUICK_SAVE',
                data: {
                  content,
                  formattedHtml: response?.html || undefined,
                },
              });
            }, 300);
          }
        });
      }).catch((err) => {
        console.error('Failed to open side panel:', err);
      });
    }
  });
});

export {};
