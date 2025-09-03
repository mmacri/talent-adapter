import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Handle GitHub Pages SPA routing
const isGitHubPages = window.location.hostname.includes('github.io');
if (isGitHubPages && window.location.search.startsWith('?p=/')) {
  const path = decodeURIComponent(window.location.search.slice(3));
  window.history.replaceState(null, '', path);
}

createRoot(document.getElementById("root")!).render(<App />);
