import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthProvider'; // <--- IMPORTAMOS EL HOOK

function FormularioProducto({ alGuardar, productoAEditar, alCancelar }) {
    const { token } = useAuth(); // <--- SACAMOS EL TOKEN

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [image, setImage] = useState(null);
    const [mensaje, setMensaje] = useState('');
    const [deshabilitado, setDeshabilitado] = useState(false);
    
    const isSubmitting = useRef(false);

    useEffect(() => {
        if (productoAEditar) {
            setName(productoAEditar.name);
            setPrice(productoAEditar.price);
            setStock(productoAEditar.stock);
            setMensaje(''); 
        } else {
            limpiarInputs();
        }
    }, [productoAEditar]);

    const limpiarInputs = () => {
        setName('');
        setPrice('');
        setStock('');
        setImage(null);
        setMensaje('');
        const fileInput = document.getElementById('fileInput');
        if(fileInput) fileInput.value = "";
    }

    const handleGuardarClick = async () => {
        if (!name || !price) {
            setMensaje("⚠️ Nombre y Precio son obligatorios");
            return;
        }

        if (isSubmitting.current) return;
        
        isSubmitting.current = true;
        setDeshabilitado(true);
        setMensaje('Procesando...');

        const datos = new FormData();
        datos.append('name', name);
        datos.append('price', price);
        datos.append('stock', stock);
        
        if (image) {
            datos.append('image', image);
        }

        let url = 'http://localhost/api/products';
        let method = 'POST';

        if (productoAEditar) {
            url = `http://localhost/api/products/${productoAEditar.id}`;
            datos.append('_method', 'PUT'); 
        }

        try {
            const respuesta = await fetch(url, {
                method: method,
                headers: {
                    // 3. AQUÍ VA EL TOKEN
                    // NO pongas Content-Type, el FormData se encarga.
                    'Authorization': `Bearer ${token}` 
                },
                body: datos 
            });

            const data = await respuesta.json();

            if (respuesta.ok) {
                setMensaje(productoAEditar ? '✅ Actualizado' : '✅ Creado');
                limpiarInputs();
                alGuardar(); 
            } else {
                setMensaje(`❌ Error: ${data.message || JSON.stringify(data)}`);
            }
        } catch (error) {
            console.error(error);
            setMensaje('❌ Error de conexión');
        } finally {
            setTimeout(() => {
                isSubmitting.current = false;
                setDeshabilitado(false);
            }, 500);
        }
    };

    return (
        <div style={{ border: '2px solid #2c3e50', padding: '20px', borderRadius: '8px', marginBottom: '20px', backgroundColor: '#f8f9fa' }}>
            <h2>{productoAEditar ? `Editando: ${productoAEditar.name}` : 'Agregar Nuevo Manga'}</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px', margin: '0 auto' }}>
                <label style={{textAlign:'left', fontSize:'0.8em', fontWeight:'bold'}}>Nombre</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} disabled={deshabilitado} />
                
                <label style={{textAlign:'left', fontSize:'0.8em', fontWeight:'bold'}}>Precio</label>
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} disabled={deshabilitado} />
                
                <label style={{textAlign:'left', fontSize:'0.8em', fontWeight:'bold'}}>Stock</label>
                <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} disabled={deshabilitado} />
                
                <div style={{textAlign: 'left'}}>
                    <label style={{fontSize: '0.8em', fontWeight:'bold'}}>Imagen {productoAEditar && '(Opcional)'}</label>
                    <br/>
                    <input id="fileInput" type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} disabled={deshabilitado} />
                </div>

                <button 
                    type="button" 
                    onClick={handleGuardarClick}
                    disabled={deshabilitado}
                    style={{ 
                        backgroundColor: productoAEditar ? '#f39c12' : '#2c3e50', 
                        color: 'white', 
                        padding: '10px', 
                        marginTop: '10px',
                        cursor: deshabilitado ? 'not-allowed' : 'pointer',
                        opacity: deshabilitado ? 0.7 : 1
                    }}
                >
                    {deshabilitado ? 'Procesando...' : (productoAEditar ? 'ACTUALIZAR' : 'GUARDAR')}
                </button>

                {productoAEditar && (
                    <button type="button" onClick={alCancelar} disabled={deshabilitado} style={{ backgroundColor: '#95a5a6', color: 'white', padding: '5px', cursor: 'pointer' }}>
                        CANCELAR EDICIÓN
                    </button>
                )}
            </div>
            {mensaje && <p style={{ marginTop: '10px', fontWeight: 'bold' }}>{mensaje}</p>}
        </div>
    );
}

export default FormularioProducto;