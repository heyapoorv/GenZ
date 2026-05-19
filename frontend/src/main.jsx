import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Suppress known non-fatal Three.js / WebGL warnings
const originalWarn = console.warn;
console.warn = (...args) => {
  const msg = typeof args[0] === 'string' ? args[0] : '';
  if (
    msg.includes('THREE.Clock') || 
    msg.includes('texSubImage') ||
    msg.includes('THREE.WebGLProgram')
  ) {
    return;
  }
  originalWarn(...args);
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
