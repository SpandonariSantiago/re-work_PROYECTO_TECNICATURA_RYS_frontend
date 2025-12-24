import { useEffect, useState } from 'react'
import './App.css'
import FormularioProducto from './components/FormularioProducto'

function App() {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [productoAEditar, setProductoAEditar] = useState(null)
  
  // SOLUCIÓN NUCLEAR: Control de Versión para reiniciar componentes
  const [versionFormulario, setVersionFormulario] = useState(0);

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

  // Callback cuando el formulario termina con éxito
  const handleGuardarExitoso = () => {
    cargarProductos();
    setProductoAEditar(null);
    // Destruir y recrear el formulario para limpiar cualquier fantasma
    setVersionFormulario(prev => prev + 1);
  }

  const handleCancelarEdicion = () => {
    setProductoAEditar(null);
    setVersionFormulario(prev => prev + 1);
  }

  const eliminarProducto = async (id) => {
    if (!window.confirm('¿Seguro que quieres eliminar este manga?')) {
      return;
    }

    try {
      const respuesta = await fetch(`http://localhost/api/products/${id}`, {
        method: 'DELETE',
      });

      if (respuesta.ok) {
        alert('Producto eliminado');
        
        // Si borramos lo que estábamos editando, limpiamos
        if (productoAEditar && productoAEditar.id == id) {
            setProductoAEditar(null);
            setVersionFormulario(prev => prev + 1);
        }

        cargarProductos();
      } else {
        alert('Error al eliminar');
      }
    } catch (error) {
      console.error(error);
      alert('Error de conexión');
    }
  }

  return (
    <div className="contenedor">
      <h1>Panel de Administración TMO</h1>
      
      {/* KEY={versionFormulario} asegura que el componente nazca limpio siempre */}
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
                        // Subir y reiniciar formulario para cargar datos limpios
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