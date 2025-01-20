import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Script } from '../types';

interface ScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (script: NewScript) => void;
  editScript?: Script;
  isSaving: boolean;
  error: string | null;
}

export default function ScriptModal({ isOpen, onClose, onSave, editScript, isSaving, error }: ScriptModalProps) {
  const [name, setName] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (editScript) {
      setName(editScript.name);
      setContent(editScript.content);
    } else {
      setName('');
      setContent('');
    }
  }, [editScript, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, content });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">
            {editScript ? 'Edit Script' : 'Add New Script'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Script Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Script Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-64 font-mono"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              {editScript ? 'Save Changes' : 'Add Script'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}