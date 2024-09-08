const url = location.href;

const siteHandlers = {
  "chatgpt.com": handleChatGPT,
  "claude.ai": handleClaude,
  "gemini.google.com": handleGemini,
  "chat.deepseek.com": handleDeepseek,
  "chatglm.cn": handleChatGLM,
  "kimi.moonshot.cn": handleKimi
};

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "pastePrompt") {
    const handler = Object.entries(siteHandlers).find(([domain]) => url.includes(domain));
    if (handler) {
      handler[1](request, sendResponse);
    } else {
      console.log('Unsupported website');
      sendResponse({success: false, error: 'Unsupported website'});
    }
  }
  return true; // 保持消息通道开放
});

function handleChatGPT(request, sendResponse) {
  const editorDiv = document.querySelector('#prompt-textarea');
  if (editorDiv) {
    editorDiv.value = request.content;
    editorDiv.dispatchEvent(new Event('input', {bubbles: true}));
    sendResponse({success: true});
  } else {
    console.log('ChatGPT editor not found');
    sendResponse({success: false, error: 'Editor not found'});
  }
}

function handleClaude(request, sendResponse) {
  const editorDiv = document.querySelector('[enterkeyhint="enter"]');
  if (editorDiv) {
    editorDiv.innerHTML = '';
    const p = document.createElement('p');
    p.textContent = request.content;
    editorDiv.appendChild(p);
    sendResponse({success: true});
  } else {
    console.log('Claude editor not found');
    sendResponse({success: false, error: 'Editor not found'});
  }
}

function handleGemini(request, sendResponse) {
  const editorDiv = document.querySelector('.ql-editor.textarea');
  if (editorDiv) {
    editorDiv.innerHTML = '';
    const p = document.createElement('p');
    p.textContent = request.content;
    editorDiv.appendChild(p);
    sendResponse({success: true});
  } else {
    console.log('Gemini editor not found');
    sendResponse({success: false, error: 'Editor not found'});
  }
}

function handleDeepseek(request, sendResponse) {
  const editorDiv = document.querySelector('#chat-input');
  if (editorDiv) {
    editorDiv.value = request.content;
    editorDiv.dispatchEvent(new Event('input', {bubbles: true}));
    sendResponse({success: true});
  } else {
    console.log('Deepseek editor not found');
    sendResponse({success: false, error: 'Editor not found'});
  }
}

function handleChatGLM(request, sendResponse) {
  const inputBox = document.querySelector('.input-box-inner');
  if (inputBox) {
    const textarea = inputBox.querySelector('textarea');
    if (textarea) {
      textarea.value = request.content;
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      textarea.dispatchEvent(new Event('change', { bubbles: true }));
      sendResponse({success: true});
    } else {
      console.log('Textarea not found inside input-box-inner');
      sendResponse({success: false, error: 'Textarea not found'});
    }
  } else {
    console.log('ChatGLM editor not found');
    sendResponse({success: false, error: 'Editor not found'});
  }
}

function handleKimi(request, sendResponse) {
    let editorDiv = document.querySelector('div[data-testid="msh-chatinput-editor"]');
    if (!editorDiv) {
        editorDiv = document.querySelector('div[contenteditable="true"][role="textbox"]');
    }
    if (editorDiv) {
        // 清空现有内容
        editorDiv.innerHTML = '';
        // 创建新的内容结构
        const p = document.createElement('p');
        p.setAttribute('dir', 'ltr');
        const span = document.createElement('span');
        span.setAttribute('data-lexical-text', 'true');
        span.textContent = request.content;
        p.appendChild(span);
        editorDiv.appendChild(p);
        // 触发必要的事件
        editorDiv.dispatchEvent(new Event('input', {bubbles: true}));
        editorDiv.dispatchEvent(new Event('change', {bubbles: true}));
        // 模拟用户输入
        const inputEvent = new InputEvent('input', {
            bubbles: true,
            cancelable: true,
            inputType: 'insertText',
            data: request.content
        });
        editorDiv.dispatchEvent(inputEvent);
        sendResponse({success: true});
    } else {
        console.log('Kimi editor not found');
        sendResponse({success: false, error: 'Editor not found'});
    }
}