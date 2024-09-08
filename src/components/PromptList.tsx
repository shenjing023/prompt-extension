import React from 'react';
import { Prompt } from './App';

interface PromptListProps {
  prompts: Prompt[];
  onEdit: (prompt: Prompt) => void;
  onSelect: (prompt: Prompt) => void;
}

function PromptList({ prompts, onEdit, onSelect }: PromptListProps) {
  return (
    <div className="prompt-list">
      {prompts.map(prompt => (
        <div key={prompt.id} className="prompt-item">
          <span 
            className="prompt-title" 
            onClick={() => onSelect(prompt)}
            style={{ 
              cursor: 'pointer',
              flexGrow: 1,
              padding: '8px',
              transition: 'background-color 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            {prompt.title}
          </span>
          <button 
            onClick={() => onEdit(prompt)} 
            className="edit-button"
            style={{
              marginLeft: '10px',
              padding: '5px 10px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer'
            }}
          >
            编辑
          </button>
        </div>
      ))}
    </div>
  );
}

export default PromptList;