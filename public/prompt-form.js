const promptFormRoot = document.getElementById('prompt-form-root');

function renderPromptForm(prompt = null) {
    const form = document.createElement('form');
    form.className = 'prompt-form';

    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.placeholder = '标题';
    titleInput.value = prompt ? prompt.title : '';
    titleInput.required = true;

    const contentTextarea = document.createElement('textarea');
    contentTextarea.placeholder = '内容';
    contentTextarea.value = prompt ? prompt.content : '';
    contentTextarea.rows = 30; // 增加初始行数
    contentTextarea.required = true;

    const categoryInput = document.createElement('input');
    categoryInput.type = 'text';
    categoryInput.placeholder = '分类';
    categoryInput.value = prompt ? prompt.category : '';
    categoryInput.required = true;

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'form-buttons';

    const saveButton = document.createElement('button');
    saveButton.textContent = '保存';
    saveButton.type = 'submit';

    const cancelButton = document.createElement('button');
    cancelButton.textContent = '取消';
    cancelButton.type = 'button';
    cancelButton.className = 'cancel';

    buttonContainer.appendChild(saveButton);
    buttonContainer.appendChild(cancelButton);

    form.appendChild(titleInput);
    form.appendChild(contentTextarea);
    form.appendChild(categoryInput);
    form.appendChild(buttonContainer);

    if (prompt) {
        const deleteButton = document.createElement('button');
        deleteButton.textContent = '删除';
        deleteButton.type = 'button';
        deleteButton.className = 'delete';
        buttonContainer.appendChild(deleteButton);

        deleteButton.addEventListener('click', () => {
            if (confirm('确定要删除这个 prompt 吗？')) {
                chrome.storage.local.get('prompts', (result) => {
                    const prompts = result.prompts || [];
                    const updatedPrompts = prompts.filter(p => p.id !== prompt.id);
                    chrome.storage.local.set({ prompts: updatedPrompts }, () => {
                        window.close();
                    });
                });
            }
        });
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!titleInput.value.trim() || !contentTextarea.value.trim() || !categoryInput.value.trim()) {
            alert('所有字段都必须填写');
            return;
        }
        const newPrompt = {
            id: prompt ? prompt.id : Date.now().toString(),
            title: titleInput.value.trim(),
            content: contentTextarea.value.trim(),
            category: categoryInput.value.trim()
        };

        chrome.storage.local.get('prompts', (result) => {
            const prompts = result.prompts || [];
            const updatedPrompts = prompt
                ? prompts.map(p => p.id === prompt.id ? newPrompt : p)
                : [...prompts, newPrompt];
            chrome.storage.local.set({ prompts: updatedPrompts }, () => {
                window.close();
            });
        });
    });

    cancelButton.addEventListener('click', () => {
        window.close();
    });

    promptFormRoot.appendChild(form);
}

const urlParams = new URLSearchParams(window.location.search);
const promptId = urlParams.get('id');

if (promptId) {
    chrome.storage.local.get('prompts', (result) => {
        const prompts = result.prompts || [];
        const prompt = prompts.find(p => p.id === promptId);
        if (prompt) {
            renderPromptForm(prompt);
        } else {
            renderPromptForm();
        }
    });
} else {
    renderPromptForm();
}