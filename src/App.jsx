import { useEffect, useState } from 'react'
import './App.css'
import FormularioProducto from './components/FormularioProducto'
import Login from './components/Login'
import { useAuth } from './context/AuthProvider'

// ERROR CORREGIDO: NUNCA pongas 'async' aquí.
function App() {
  const { token, logout } = useAuth(); // Sacamos el token del contexto
  
  // ----------------------------------------------------
  // 1. EL GUARDIÁN DE SEGURIDAD
  // Si no hay token, cortamos aquí y mostramos el Login.
  // ----------------------------------------------------
  if (!token) {
      return <Login />;
  }

  // --- SI LLEGAMOS AQUÍ, ES QUE ESTÁS LOGUEADO ---

  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [productoAEditar, setProductoAEditar] = useState(null)
  const [versionFormulario, setVersionFormulario] = useState(0);

  // Función para cargar (Pública, no necesita token para leer)
  const cargarProductos = () => {
    fetch('http://localhost/api/products')
      .then(response => response.json())
      .then(data => {
        setProductos(data)
        setCargando(false)
      })
      .catch(error => {
        console.error("Error:", error);
        setCargando(false)
      })
  }

  useEffect(() => {
    cargarProductos()
  }, [])

  const handleGuardarExitoso = () => {
    cargarProductos();
    setProductoAEditar(null);
    setVersionFormulario(prev => prev + 1);
  }

  const handleCancelarEdicion = () => {
    setProductoAEditar(null);
    setVersionFormulario(prev => prev + 1);
  }

  // AQUÍ SÍ VA EL ASYNC (En la función interna)
  const eliminarProducto = async (id) => {
    if (!window.confirm('¿Seguro que quieres eliminar este manga?')) {
      return;
    }

    try {
      const respuesta = await fetch(`http://localhost/api/products/${id}`, {
        method: 'DELETE',
        headers: {
            // 2. INYECCIÓN DEL TOKEN PARA BORRAR
            'Authorization': `Bearer ${token}` 
        }
      });

      if (respuesta.ok) {
        alert('Producto eliminado');
        if (productoAEditar && productoAEditar.id == id) {
            setProductoAEditar(null);
            setVersionFormulario(prev => prev + 1);
        }
        cargarProductos();
      } else {
        // Si el token expiró, Laravel devolverá 401
        if (respuesta.status === 401) {
            alert("Tu sesión expiró. Logueate de nuevo.");
            logout(); // Sacamos al usuario
            return;
        }
        alert('Error al eliminar (Tal vez no tienes permisos)');
      }
    } catch (error) {
      console.error(error);
      alert('Error de conexión');
    }
  }

  return (
    <div className="contenedor">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1>Panel de Administración TMO</h1>
          <button onClick={logout} style={{ backgroundColor: '#333', color: 'white', padding: '8px 15px', border:'none', cursor:'pointer' }}>
              Cerrar Sesión
          </button>
      </div>
      
      <FormularioProducto 
        key={versionFormulario} 
        alGuardar={handleGuardarExitoso}
        productoAEditar={productoAEditar}
        alCancelar={handleCancelarEdicion}
      />

      <hr style={{ margin: '30px 0' }} />

      <h2>Inventario Actual</h2>

      {cargando ? <p>Cargando...</p> : (
        <div className="grilla-productos">
          {productos.map((producto) => (
            <div key={producto.id} className="tarjeta">
              {producto.image_url ? (
                 <img 
                   src={`http://localhost/storage/${producto.image_url}`} 
                   alt={producto.name} 
                   className="imagen-producto"
                 />
              ) : (
                <div className="sin-imagen">Sin Foto</div>
              )}
              
              <h3>{producto.name}</h3>
              <p className="precio">${producto.price}</p>
              <p>Stock: {producto.stock}</p>

              <div className="acciones" style={{ marginTop: '10px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button 
                    onClick={() => eliminarProducto(producto.id)}
                    style={{ backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px' }}
                >
                    Eliminar
                </button>
                
                <button 
                    onClick={() => {
                        setProductoAEditar(producto);
                        setVersionFormulario(prev => prev + 1); 
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    style={{ backgroundColor: '#f39c12', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px' }}
                >
                    Editar
                </button>
            </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App