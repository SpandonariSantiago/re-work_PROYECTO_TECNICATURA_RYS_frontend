import { useCart } from '../context/CartProvider';
import { Link } from 'react-router-dom';

function CarritoPage() {
    const { carrito, eliminarDelCarrito, vaciarCarrito, total } = useCart();

    if (carrito.length === 0) {
        return (
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <h2>Tu carrito está vacío 😢</h2>
                <Link to="/">Volver a la tienda</Link>
            </div>
        );
    }

    return (
        <div className="contenedor" style={{ padding: '20px' }}>
            <h1>Tu Pedido</h1>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                    <tr style={{ background: '#eee', textAlign: 'left' }}>
                        <th style={{ padding: '10px' }}>Producto</th>
                        <th>Precio</th>
                        <th>Cant</th>
                        <th>Subtotal</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {carrito.map(item => (
                        <tr key={item.id} style={{ borderBottom: '1px solid #ddd' }}>
                            <td style={{ padding: '10px' }}>{item.name}</td>
                            <td>${item.price}</td>
                            <td>{item.cantidad}</td>
                            <td>${item.price * item.cantidad}</td>
                            <td>
                                <button 
                                    onClick={() => eliminarDelCarrito(item.id)}
                                    style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div style={{ marginTop: '20px', textAlign: 'right', fontSize: '1.5em' }}>
                <strong>Total: ${total}</strong>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                <button onClick={vaciarCarrito} style={{ background: '#95a5a6', color: 'white', padding: '10px', border: 'none', cursor: 'pointer' }}>
                    Vaciar Carrito
                </button>
                
                <button 
                    onClick={() => alert("Mañana conectaremos esto a la API de Orders")} 
                    style={{ background: '#27ae60', color: 'white', padding: '10px 20px', border: 'none', cursor: 'pointer', fontSize: '1.2em' }}
                >
                    FINALIZAR COMPRA
                </button>
            </div>
            
            <br />
            <Link to="/">Seguir comprando</Link>
        </div>
    );
}

export default CarritoPage;