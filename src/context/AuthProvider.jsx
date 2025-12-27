import { createContext, useState, useContext, useEffect } from 'react';

// 1. Creamos el contexto (la nube de datos global)
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Leemos el token del disco duro (localStorage) al iniciar
    const [token, setToken] = useState(localStorage.getItem('token_tmo') || null);
    const [user, setUser] = useState(null);

    // Guardar token
    const login = (newToken, userData) => {
        setToken(newToken);
        setUser(userData);
        localStorage.setItem('token_tmo', newToken);
    };

    // Borrar token
    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token_tmo');
    };

    return (
        <AuthContext.Provider value={{ token, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook personalizado para usar esto fácil en otros archivos
export const useAuth = () => useContext(AuthContext);