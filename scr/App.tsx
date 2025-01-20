import React, { useState, useEffect } from 'react';
import { PlusCircle, ScrollText } from 'lucide-react';
import ScriptModal from './components/ScriptModal';
import ScriptCard from './components/ScriptCard';
import DarkModeToggle from './components/DarkModeToggle';
import { Script } from './types';

const API_URL = 'http://localhost:5000/api/scripts';

// Utility types
type NewScript = Omit<Script, 'id' | 'createdAt' | 'updatedAt'>;
type ApiError = { message: string };

function App() {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingScript, setEditingScript] = useState<Script | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  useEffect(() => {
    handleFetchScripts();
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    localStorage.setItem('darkMode', (!isDark).toString());
  };

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
      setIsDark(savedDarkMode === 'true');
    } else {
      // Check user's system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(prefersDark);
    }
  }, []);

  const handleFetchScripts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(API_URL);
      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.message || 'Failed to fetch scripts');
      }
      const data = await response.json();
      setScripts(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch scripts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveScript = async (scriptData: NewScript) => {
    try {
      setIsSaving(true);
      setError(null);
      const now = new Date().toISOString();
      
      if (editingScript) {
        // Update existing script
        const response = await fetch(`${API_URL}/${editingScript.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...scriptData, updatedAt: now }),
        });
        
        if (!response.ok) {
          const error: ApiError = await response.json();
          throw new Error(error.message || 'Failed to update script');
        }
        
        const updatedScript = await response.json();
        setScripts(prevScripts => 
          prevScripts.map(script => 
            script.id === editingScript.id ? updatedScript : script
          )
        );
      } else {
        // Create new script
        const newScript = {
          ...scriptData,
          id: crypto.randomUUID(),
          createdAt: now,
          updatedAt: now,
        };
        
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newScript),
        });

        if (!response.ok) {
          const error: ApiError = await response.json();
          throw new Error(error.message || 'Failed to create script');
        }

        const savedScript = await response.json();
        setScripts(prevScripts => [...prevScripts, savedScript]);
      }
      handleCloseModal();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save script');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteScript = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this script?')) {
      try {
        setError(null);
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        
        if (!response.ok) {
          const error: ApiError = await response.json();
          throw new Error(error.message || 'Failed to delete script');
        }

        setScripts(prevScripts => prevScripts.filter(script => script.id !== id));
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to delete script');
      }
    }
  };

  const handleEditScript = (script: Script) => {
    setEditingScript(script);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingScript(undefined);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <ScrollText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Script Manager</h1>
            </div>
            <div className="flex items-center gap-4">
              <DarkModeToggle isDark={isDark} onToggle={toggleDarkMode} />
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
                aria-label="Add new script"
              >
                <PlusCircle className="w-5 h-5" />
                Add Script
              </button>
            </div>
          </div>
        </div>
      </header>

      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
            <p className="mt-4 text-gray-500 dark:text-gray-400">Loading scripts...</p>
          </div>
        ) : scripts.length === 0 ? (
          <div className="text-center py-12">
            <ScrollText className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No scripts yet</h3>
            <p className="text-gray-500 dark:text-gray-400">Get started by adding your first script!</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {scripts.map(script => (
              <ScriptCard
                key={script.id}
                script={script}
                onEdit={handleEditScript}
                onDelete={handleDeleteScript}
              />
            ))}
          </div>
        )}
      </main>

      <ScriptModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveScript}
        editScript={editingScript}
        isSaving={isSaving}
        error={error}
      />
    </div>
  );
}

export default App;
