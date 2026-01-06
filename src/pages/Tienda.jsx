import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartProvider'

function Tienda() {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)

  // Usamos el hook del carrito
  const { agregarAlCarrito, cantidadItems } = useCart(); 

  useEffect(() => {
    fetch('http://localhost/api/products')
      .then(res => res.json())
      .then(data => { setProductos(data); setCargando(false); })
  }, [])

  return (
    <div className="contenedor">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '1px solid #ccc' }}>
          <h1>TMO Manga Store</h1>
          <nav>
              <Link to="/login" style={{ marginRight: '15px' }}>Soy Admin</Link>
              {/* Enlace al carrito con contador dinámico */}
              <Link to="/carrito">
                  <button>🛒 Carrito ({cantidadItems})</button>
              </Link>
          </nav>
      </header>

      <div className="hero" style={{ padding: '40px', textAlign: 'center', background: '#f9f9f9', color: '#333' }}>
          <h2>Los mejores mangas al mejor precio</h2>
      </div>

      {cargando ? <p>Cargando...</p> : (
        <div className="grilla-productos" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', padding: '20px' }}>
          {productos.map((prod) => (
            <div key={prod.id} className="tarjeta" style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '8px' }}>
              <img 
                 src={prod.image_url ? `http://localhost/storage/${prod.image_url}` : 'https://via.placeholder.com/150'} 
                 alt={prod.name} 
                 style={{ width: '100%', height: '250px', objectFit: 'cover' }}
               />
              <h3>{prod.name}</h3>
              <p style={{ fontSize: '1.2em', fontWeight: 'bold' }}>${prod.price}</p>
              
              <button 
                  onClick={() => agregarAlCarrito(prod)} // <--- CONECTADO
                  style={{ width: '100%', padding: '10px', background: '#3498db', color: 'white', border: 'none', cursor: 'pointer' }}
              >
                  Agregar al Carrito
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Tienda