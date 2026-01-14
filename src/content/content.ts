// Content Script - 与网页交互
// 处理文本插入和选中文本保存

console.log('QA sidePanel content script loaded');

// 监听来自 background 的消息
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  console.log('Content script received message:', message);

  if (message.action === 'insertText') {
    // 插入文本到当前焦点元素
    insertTextToActiveElement(message.text);
    sendResponse({ success: true });
  } else if (message.action === 'getSelectedText') {
    // 获取选中的文本
    const selectedText = window.getSelection()?.toString() || '';
    sendResponse({ text: selectedText });
  }

  return true; // 保持消息通道开放以进行异步响应
});

/**
 * 将文本插入到当前激活的输入元素
 */
function insertTextToActiveElement(text: string) {
  const activeElement = document.activeElement as HTMLElement;

  // 处理 input 和 textarea
  if (
    activeElement instanceof HTMLInputElement ||
    activeElement instanceof HTMLTextAreaElement
  ) {
    insertIntoFormElement(activeElement, text);
    return;
  }

  // 处理 contenteditable 元素
  if (activeElement.contentEditable === 'true') {
    insertIntoContentEditable(activeElement, text);
    return;
  }

  // 如果没有焦点元素，尝试插入到选区
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(document.createTextNode(text));
    range.collapse(false);
    return;
  }

  // 如果都不行，显示通知
  showNotification('请先点击输入框或可编辑区域', 'warning');
}

/**
 * 插入文本到 input/textarea
 */
function insertIntoFormElement(
  element: HTMLInputElement | HTMLTextAreaElement,
  text: string
) {
  const start = element.selectionStart || 0;
  const end = element.selectionEnd || 0;
  const value = element.value;

  // 插入文本
  const newValue = value.substring(0, start) + text + value.substring(end);
  element.value = newValue;

  // 设置光标位置
  const newCursorPos = start + text.length;
  element.setSelectionRange(newCursorPos, newCursorPos);

  // 触发 input 事件（为了兼容 React 等框架）
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));

  // 聚焦元素
  element.focus();

  showNotification('文本已插入', 'success');
}

/**
 * 插入文本到 contenteditable 元素
 */
function insertIntoContentEditable(element: HTMLElement, text: string) {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    element.focus();
    const range = document.createRange();
    range.selectNodeContents(element);
    range.collapse(false);
    selection?.removeAllRanges();
    selection?.addRange(range);
  }

  const range = selection!.getRangeAt(0);
  range.deleteContents();
  
  // 保持换行符
  const textNode = document.createTextNode(text);
  range.insertNode(textNode);
  range.collapse(false);

  // 触发 input 事件
  element.dispatchEvent(new Event('input', { bubbles: true }));

  showNotification('文本已插入', 'success');
}

/**
 * 显示页面通知
 */
function showNotification(message: string, type: 'success' | 'warning' | 'error' = 'success') {
  // 创建通知元素
  const notification = document.createElement('div');
  notification.textContent = message;
  
  // 样式
  Object.assign(notification.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '12px 20px',
    backgroundColor: type === 'success' ? '#10b981' : type === 'warning' ? '#f59e0b' : '#ef4444',
    color: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    zIndex: '999999',
    fontSize: '14px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    animation: 'slideIn 0.3s ease-out',
  });

  // 添加动画
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);

  // 添加到页面
  document.body.appendChild(notification);

  // 3秒后移除
  setTimeout(() => {
    notification.style.animation = 'slideIn 0.3s ease-out reverse';
    setTimeout(() => {
      document.body.removeChild(notification);
      document.head.removeChild(style);
    }, 300);
  }, 3000);
}

// 监听快捷键（作为备份，主要由 commands API 处理）
document.addEventListener('keydown', (e) => {
  // Alt+Shift+S (Windows/Linux) 或 Cmd+Shift+D (Mac) - 保存选中文本
  const isSaveKey = 
    (e.altKey && e.shiftKey && e.key === 'S' && !e.ctrlKey && !e.metaKey) || // Windows/Linux
    (e.metaKey && e.shiftKey && e.key === 'D' && !e.altKey); // Mac
  
  if (isSaveKey) {
    e.preventDefault();
    const selectedText = window.getSelection()?.toString();
    if (selectedText) {
      chrome.runtime.sendMessage({
        action: 'saveSelectedText',
        text: selectedText,
      });
    }
  }
});

export {};
