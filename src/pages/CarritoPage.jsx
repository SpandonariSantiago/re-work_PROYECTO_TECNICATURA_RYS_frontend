import { useState } from 'react';
import { useCart } from '../context/CartProvider';
import { useAuth } from '../context/AuthProvider'; // Necesitamos saber si hay usuario
import { Link, useNavigate } from 'react-router-dom';

function CarritoPage() {
    const { carrito, eliminarDelCarrito, vaciarCarrito, total } = useCart();
    const { token } = useAuth(); // Token para la API
    const navigate = useNavigate(); // Para redirigir al éxito

    // Estados para el formulario de envío
    const [address, setAddress] = useState('');
    const [notes, setNotes] = useState('');
    const [procesando, setProcesando] = useState(false);

    if (carrito.length === 0) {
        return (
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <h2>Tu carrito está vacío 😢</h2>
                <Link to="/">Volver a la tienda</Link>
            </div>
        );
    }

    const handleFinalizarCompra = async () => {
        if (!address.trim()) {
            alert("Por favor ingresa una dirección de envío.");
            return;
        }

        setProcesando(true);

        // 1. TRANSFORMACIÓN DE DATOS
        // Convertimos el formato del carrito al formato que pide la API
        const itemsParaAPI = carrito.map(item => ({
            product_id: item.id,
            quantity: item.cantidad
        }));

        // 2. PETICIÓN AL BACKEND
        try {
            const respuesta = await fetch('http://localhost/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}` // La llave de acceso
                },
                body: JSON.stringify({
                    address: address,
                    notes: notes,
                    items: itemsParaAPI
                })
            });

            const data = await respuesta.json();

            if (respuesta.ok) {
                alert(`¡Compra Éxitosa! ID de Pedido: ${data.order_id}`);
                vaciarCarrito(); // Limpiamos la memoria local
                navigate('/admin'); // Lo mandamos a ver sus pedidos (o al home)
            } else {
                alert(`Error: ${data.message || JSON.stringify(data)}`);
            }
        } catch (error) {
            console.error(error);
            alert("Error de conexión con el servidor");
        } finally {
            setProcesando(false);
        }
    };

    return (
        <div className="contenedor" style={{ padding: '20px' }}>
            <h1>Finalizar Pedido</h1>
            
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
                {/* COLUMNA IZQUIERDA: RESUMEN DE ITEMS */}
                <div>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#eee', textAlign: 'left' }}>
                                <th style={{ padding: '10px' }}>Producto</th>
                                <th>Cant</th>
                                <th>Subtotal</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {carrito.map(item => (
                                <tr key={item.id} style={{ borderBottom: '1px solid #ddd' }}>
                                    <td style={{ padding: '10px' }}>{item.name}</td>
                                    <td>{item.cantidad}</td>
                                    <td>${item.price * item.cantidad}</td>
                                    <td>
                                        <button 
                                            onClick={() => eliminarDelCarrito(item.id)}
                                            style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}
                                        >
                                            X
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div style={{ marginTop: '20px', textAlign: 'right', fontSize: '1.5em' }}>
                        <strong>Total: ${total}</strong>
                    </div>
                </div>

                {/* COLUMNA DERECHA: DATOS DE ENVÍO Y PAGO */}
                <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', height: 'fit-content' }}>
                    <h3>Datos de Envío</h3>
                    
                    <label style={{ display: 'block', marginBottom: '5px' }}>Dirección:</label>
                    <textarea 
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Calle, Número, Apto..."
                        style={{ width: '100%', height: '80px', marginBottom: '15px', padding: '5px' }}
                    />

                    <label style={{ display: 'block', marginBottom: '5px' }}>Notas (Opcional):</label>
                    <input 
                        type="text"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Ej: Timbre roto"
                        style={{ width: '100%', padding: '5px', marginBottom: '20px' }}
                    />

                    {/* BOTÓN CONDICIONAL */}
                    {token ? (
                        <button 
                            onClick={handleFinalizarCompra} 
                            disabled={procesando}
                            style={{ 
                                width: '100%', 
                                background: procesando ? '#ccc' : '#27ae60', 
                                color: 'white', 
                                padding: '15px', 
                                border: 'none', 
                                cursor: procesando ? 'not-allowed' : 'pointer', 
                                fontSize: '1.1em',
                                fontWeight: 'bold'
                            }}
                        >
                            {procesando ? 'Procesando...' : 'CONFIRMAR COMPRA'}
                        </button>
                    ) : (
                        <Link to="/login">
                            <button style={{ width: '100%', background: '#e74c3c', color: 'white', padding: '15px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                                INICIAR SESIÓN PARA COMPRAR
                            </button>
                        </Link>
                    )}
                </div>
            </div>
            
            <br />
            <Link to="/">Seguir comprando</Link>
        </div>
    );
}

export default CarritoPage;