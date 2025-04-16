
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Enlèvement du StrictMode pour éviter les doubles rendus qui peuvent causer des problèmes en production
createRoot(document.getElementById("root")!).render(<App />);
