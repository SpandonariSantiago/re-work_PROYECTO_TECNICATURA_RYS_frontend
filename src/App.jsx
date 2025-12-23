import { useEffect, useState } from 'react'
import './App.css'
import FormularioProducto from './components/FormularioProducto' // <--- Importamos

function App() {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)

  // Extraemos la lógica de carga a una función para poder reusarla
  const cargarProductos = () => {
    setCargando(true) // Opcional: mostrar carga rápida
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

  // Carga inicial
  useEffect(() => {
    cargarProductos()
  }, [])

  return (
    <div className="contenedor">
      <h1>Panel de Administración TMO</h1>
      
      {/* Aquí ponemos el formulario.
          Le pasamos la función cargarProductos como prop.
          Así, cuando el formulario termine, puede llamar a esta función y actualizar la lista.
      */}
      <FormularioProducto alGuardar={cargarProductos} />

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
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App