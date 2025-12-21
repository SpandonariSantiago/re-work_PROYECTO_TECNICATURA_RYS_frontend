import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)

  // Esta función se ejecuta automáticamente al abrir la página
  useEffect(() => {
    fetch('http://localhost/api/products')
      .then(response => response.json())
      .then(data => {
        console.log("Datos recibidos:", data); // Para depurar en consola
        setProductos(data)
        setCargando(false)
      })
      .catch(error => {
        console.error("Error conectando con Laravel:", error);
        setCargando(false)
      })
  }, []) // El array vacío [] significa: "Ejecuta esto solo una vez al inicio"

  if (cargando) {
    return <h1>Cargando tienda...</h1>
  }

  return (
    <div className="contenedor">
      <h1>Mi Tienda de Mangas</h1>
      <div className="grilla-productos">
        {productos.map((producto) => (
          <div key={producto.id} className="tarjeta">
            {/* OJO: Aquí construimos la URL de la imagen */}
            {producto.image_url ? (
               <img 
                 src={`http://localhost/storage/${producto.image_url}`} 
                 alt={producto.name} 
                 className="imagen-producto"
               />
            ) : (
              <div className="sin-imagen">Sin Foto</div>
            )}
            
            <h2>{producto.name}</h2>
            <p className="precio">${producto.price}</p>
            <p>Stock: {producto.stock}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App