import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Initialize analytics or other services here
const initApp = () => {
  // You can initialize any global services here
  console.log('Secure Finder App Initialized')
}

// Initialize app
initApp()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)