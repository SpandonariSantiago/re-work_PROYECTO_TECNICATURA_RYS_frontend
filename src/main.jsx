import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthProvider.jsx'
import { BrowserRouter } from 'react-router-dom' // <--- IMPORTAR
import { CartProvider } from './context/CartProvider.jsx' 


ReactDOM.createRoot(document.getElementById('root')).render(
<React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider> {/* <--- ¿Y ESTÁ ESTO ENVOLVIENDO A APP? */}
          <App />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)