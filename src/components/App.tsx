import React, { useState, useEffect } from 'react';
import PromptList from './PromptList';
import SearchBar from './SearchBar';
import '../styles/App.css';

export interface Prompt {
  id: string;
  title: string;
  content: string;
  category: string;
}

function App() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    loadPrompts();
    chrome.storage.onChanged.addListener(handleStorageChange);
    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const filtered = prompts.filter(prompt => 
      prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === '' || prompt.category === selectedCategory)
    );
    setFilteredPrompts(filtered);
  }, [prompts, searchTerm, selectedCategory]);

  const loadPrompts = () => {
    chrome.storage.local.get('prompts', (result) => {
      if (result.prompts) {
        setPrompts(result.prompts);
      }
    });
  };

  const handleStorageChange = (changes: { [key: string]: chrome.storage.StorageChange }) => {
    if (changes.prompts) {
      loadPrompts();
    }
  };

  const handleAdd = () => {
    chrome.windows.create({
      url: chrome.runtime.getURL('prompt-form.html'),
      type: 'popup',
      width: 600,
      height: 800
    });
  };

  const handleEdit = (prompt: Prompt) => {
    chrome.windows.create({
      url: chrome.runtime.getURL(`prompt-form.html?id=${prompt.id}`),
      type: 'popup',
      width: 600,
      height: 800
    });
  };

  const handleExport = () => {
    let markdownContent = "# Prompts\n\n";
    prompts.forEach((prompt) => {
      markdownContent += `## ${prompt.title}\n\n`;
      markdownContent += `Category: ${prompt.category}\n\n`;
      markdownContent += `${prompt.content}\n\n`;
      markdownContent += "---\n\n";
    });

    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'prompts.md';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSelect = (prompt: Prompt) => {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (tabs[0].id) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "pastePrompt", content: prompt.content}, (response) => {
          if (chrome.runtime.lastError) {
            console.error('Error sending message:', chrome.runtime.lastError.message);
          } else {
            // console.log('Message sent successfully, response:', response);
          }
        });
      } else {
        console.error('No active tab found');
      }
    });
  };

  return (
    <div className="app">
      <header className="app-header">
        <SearchBar 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={[...new Set(prompts.map(p => p.category))]}
        />
      </header>
      <main className="app-main">
        <PromptList 
          prompts={filteredPrompts} 
          onEdit={handleEdit} 
          onSelect={handleSelect}
        />
      </main>
      <footer className="app-footer">
        <button onClick={handleAdd} className="add-button">添加 Prompt</button>
        <button onClick={handleExport} className="export-button">导出 Prompts</button>
      </footer>
    </div>
  );
}

export default App;