import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import AdminPanel from './pages/AdminPanel'
import Tienda from './pages/Tienda'
import { useAuth } from './context/AuthProvider'
import CarritoPage from './pages/CarritoPage'

// COMPONENTE DE PROTECCIÓN
// Si intenta entrar a /admin y no tiene token, lo patea al login.
const RutaPrivada = ({ children }) => {
    const { token } = useAuth();
    return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Routes>
        {/* RUTA PÚBLICA: La Tienda */}
        <Route path="/" element={<Tienda />} />

        {/* RUTA PÚBLICA: El Login */}
        <Route path="/login" element={<Login />} />

        {/* RUTA PRIVADA: El Panel de Admin */}
        <Route path="/admin" element={
            <RutaPrivada>
                <AdminPanel />
            </RutaPrivada>
        } />

        <Route path="/carrito" element={<CarritoPage />} />
        
        {/* Cualquier otra cosa -> A la tienda */}
        <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default App