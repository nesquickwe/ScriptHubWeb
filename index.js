// Theme handling
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

function updateTheme(isDark) {
    if (isDark) {
        html.classList.add('dark');
    } else {
        html.classList.remove('dark');
    }
    localStorage.setItem('darkMode', isDark);
}

// Initialize theme
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedTheme = localStorage.getItem('darkMode');
updateTheme(savedTheme ? savedTheme === 'true' : prefersDark);

themeToggle.addEventListener('click', () => {
    updateTheme(!html.classList.contains('dark'));
});

// API handling
const API_URL = 'http://localhost:5000/api/scripts'; // Change this to your deployed API URL

async function loadScripts() {
    const scriptsList = document.getElementById('scriptsList');
    
    try {
        const response = await fetch(API_URL);
        const scripts = await response.json();
        
        scriptsList.innerHTML = scripts.map(script => `
            <div class="script-card bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                <div class="flex justify-between items-start mb-2">
                    <h3 class="text-lg font-semibold text-gray-800 dark:text-white">${script.name}</h3>
                </div>
                <pre class="bg-gray-50 dark:bg-gray-900 p-3 rounded-md text-sm overflow-x-auto max-h-32 text-gray-800 dark:text-gray-300"><code>${script.content}</code></pre>
                <div class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Last updated: ${new Date(script.updatedAt).toLocaleDateString()}
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading scripts:', error);
        scriptsList.innerHTML = `
            <div class="col-span-full text-center text-red-500 dark:text-red-400">
                Error loading scripts. Please try again later.
            </div>
        `;
    }
}

// Load scripts when page loads
loadScripts();
