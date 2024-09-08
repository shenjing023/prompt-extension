import React, { useState, useEffect } from 'react';
import { Prompt } from './App';

interface PromptFormProps {
  prompt: Prompt | null;
  onSave: (prompt: Prompt) => void;
  onCancel: () => void;
  onDelete: (id: string) => void;
}

function PromptForm({ prompt, onSave, onCancel, onDelete }: PromptFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    if (prompt) {
      setTitle(prompt.title);
      setContent(prompt.content);
      setCategory(prompt.category);
    } else {
      setTitle('');
      setContent('');
      setCategory('');
    }
  }, [prompt]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: prompt ? prompt.id : '',
      title,
      content,
      category
    });
  };

  return (
    <form onSubmit={handleSubmit} className="prompt-form">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="标题"
        required
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="内容"
        required
      />
      <input
        type="text"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="分类"
        required
      />
      <div className="form-buttons">
        <button type="submit">保存</button>
        <button type="button" onClick={onCancel}>取消</button>
        {prompt && (
          <button type="button" onClick={() => onDelete(prompt.id)} className="delete-button">删除</button>
        )}
      </div>
    </form>
  );
}

export default PromptForm;