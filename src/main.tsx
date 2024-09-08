import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './components/App'
import './styles/App.css'

console.log('main.tsx is running');

const root = createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)