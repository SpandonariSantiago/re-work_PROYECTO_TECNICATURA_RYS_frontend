import { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    // 1. Iniciamos leyendo el localStorage (si existe)
    const [carrito, setCarrito] = useState(() => {
        const guardado = localStorage.getItem('carrito_tmo');
        return guardado ? JSON.parse(guardado) : [];
    });

    // 2. Cada vez que cambie el carrito, guardamos en localStorage
    useEffect(() => {
        localStorage.setItem('carrito_tmo', JSON.stringify(carrito));
    }, [carrito]);

    // LÓGICA: Agregar producto
    const agregarAlCarrito = (producto) => {
        setCarrito(prev => {
            // ¿Ya está este ID en el carrito?
            const existe = prev.find(item => item.id === producto.id);

            if (existe) {
                // Si existe, creamos un nuevo array donde a ESE item le sumamos 1
                return prev.map(item => 
                    item.id === producto.id 
                        ? { ...item, cantidad: item.cantidad + 1 } 
                        : item
                );
            } else {
                // Si no existe, lo agregamos con cantidad 1
                // OJO: Guardamos solo lo necesario, no todo el objeto gigante si no quieres
                return [...prev, { ...producto, cantidad: 1 }];
            }
        });
        alert("Agregado al carrito"); // Feedback temporal feo pero funcional
    };

    // LÓGICA: Eliminar producto
    const eliminarDelCarrito = (id) => {
        setCarrito(prev => prev.filter(item => item.id !== id));
    };

    // LÓGICA: Vaciar (para cuando compremos)
    const vaciarCarrito = () => {
        setCarrito([]);
    };

    // LÓGICA: Calcular Total (Reduce)
    const total = carrito.reduce((acc, item) => acc + (item.price * item.cantidad), 0);
    const cantidadItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);

    return (
        <CartContext.Provider value={{ 
            carrito, 
            agregarAlCarrito, 
            eliminarDelCarrito, 
            vaciarCarrito,
            total,
            cantidadItems
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);