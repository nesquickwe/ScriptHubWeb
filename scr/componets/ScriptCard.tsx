import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { Script } from '../types';

interface ScriptCardProps {
  script: Script;
  onEdit: (script: Script) => void;
  onDelete: (id: string) => void;
}

export default function ScriptCard({ script, onEdit, onDelete }: ScriptCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{script.name}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(script)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-600 dark:text-gray-400"
            title="Edit script"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(script.id)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-600 dark:text-gray-400"
            title="Delete script"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <pre className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md text-sm overflow-x-auto max-h-32 text-gray-800 dark:text-gray-300">
        <code>{script.content}</code>
      </pre>
      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        Last updated: {new Date(script.updatedAt).toLocaleDateString()}
      </div>
    </div>
  );
}