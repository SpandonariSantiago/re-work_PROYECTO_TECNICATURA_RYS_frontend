import { useState } from 'react';

// Recibimos una función "alGuardar" para avisarle al padre cuando terminemos
function FormularioProducto({ alGuardar }) {
    // Estados para cada input
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [image, setImage] = useState(null); // Aquí guardaremos el ARCHIVO, no texto
    const [mensaje, setMensaje] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault(); // Evita que la página se recargue sola

        // 1. PREPARAR EL PAQUETE (FormData)
        // No usamos JSON. Usamos FormData para soportar archivos.
        const datos = new FormData();
        datos.append('name', name);
        datos.append('price', price);
        datos.append('stock', stock);
        if (image) {
            datos.append('image', image); // Aquí va el binario
        }

        try {
            // 2. ENVIAR A LARAVEL
            const respuesta = await fetch('http://localhost/api/products', {
                method: 'POST',
                // OJO: No ponemos "Content-Type". 
                // El navegador detecta que es FormData y pone el "boundary" automáticamente.
                body: datos 
            });

            if (respuesta.ok) {
                setMensaje('✅ Producto guardado con éxito');
                // Limpiamos el formulario
                setName('');
                setPrice('');
                setStock('');
                setImage(null);
                document.getElementById('fileInput').value = ""; // Truco para limpiar el input file
                
                // Avisamos a App.jsx que recargue la lista
                alGuardar(); 
            } else {
                const errorData = await respuesta.json();
                setMensaje(`❌ Error: ${JSON.stringify(errorData)}`);
            }
        } catch (error) {
            setMensaje('❌ Error de conexión con el servidor');
        }
    };

    return (
        <div style={{ border: '2px solid #2c3e50', padding: '20px', borderRadius: '8px', marginBottom: '20px', backgroundColor: '#f8f9fa' }}>
            <h2>Agregar Nuevo Manga</h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px', margin: '0 auto' }}>
                
                <input 
                    type="text" 
                    placeholder="Nombre del Manga" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                
                <input 
                    type="number" 
                    placeholder="Precio" 
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                />

                <input 
                    type="number" 
                    placeholder="Stock" 
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                />

                {/* INPUT DE ARCHIVO */}
                <input 
                    id="fileInput"
                    type="file" 
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])} // Capturamos el archivo [0]
                />

                <button type="submit" style={{ backgroundColor: '#2c3e50', color: 'white', padding: '10px', cursor: 'pointer' }}>
                    GUARDAR PRODUCTO
                </button>
            </form>

            {mensaje && <p style={{ marginTop: '10px', fontWeight: 'bold' }}>{mensaje}</p>}
        </div>
    );
}

export default FormularioProducto;