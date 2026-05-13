let cantidadSeleccionada = 1;
let productoActual = null;

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Obtener ID de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const idProducto = urlParams.get('id');

    if (!idProducto) {
        window.location.href = 'index.html';
        return;
    }

    try {
        // 2. Consultar al servidor por este producto específico
        const res = await fetch(`http://localhost:3000/api/productos/${idProducto}`);
        productoActual = await res.json();

        if (productoActual) {
            // 3. Llenar la vista principal
            document.getElementById('det-img').src = productoActual.imagen_url;
            document.getElementById('det-nombre').innerText = productoActual.nombre;
            document.getElementById('bread-nombre').innerText = productoActual.nombre;
            document.getElementById('det-precio').innerText = `S/ ${productoActual.precio}`;
            document.getElementById('det-desc').innerText = productoActual.descripcion;
            document.getElementById('det-id').innerText = `Código: ${productoActual.id_producto}`;

            // 4. Configurar botón de agregar
            const btn = document.getElementById('det-btn');
            if (productoActual.stock <= 0) {
                btn.disabled = true;
                btn.innerText = "AGOTADO";
                // Ocultar selector de cantidad si no hay stock
                document.querySelector('.selector-cantidad').parentElement.style.display = 'none';
            } else {
                btn.onclick = () => {
                    // Agregamos la cantidad seleccionada al carrito
                    // Llamamos a la función de main.js repetidas veces según la cantidad
                    for(let i = 0; i < cantidadSeleccionada; i++) {
                        agregarAlCarrito(
                            productoActual.id_producto, 
                            productoActual.nombre, 
                            productoActual.precio, 
                            productoActual.imagen_url
                        );
                    }
                    
                    // Abrir el carrito automáticamente para que el usuario vea el cambio
                    const offcanvasCarrito = document.getElementById('menuCarrito');
                    const bsOffcanvas = new bootstrap.Offcanvas(offcanvasCarrito);
                    bsOffcanvas.show();
                };
            }

            // 5. Cargar productos de la misma categoría (Relacionados)
            cargarRelacionados(productoActual.id_categoria, productoActual.id_producto);
        }
    } catch (error) {
        console.error("Error cargando detalle:", error);
    }
});

// FUNCIÓN PARA EL PANEL DE CANTIDAD
function ajustarCantidadDetalle(cambio) {
    cantidadSeleccionada += cambio;
    if (cantidadSeleccionada < 1) {
        cantidadSeleccionada = 1;
    }
    // Validar contra el stock real
    if (productoActual && cantidadSeleccionada > productoActual.stock) {
        cantidadSeleccionada = productoActual.stock;
        alert(`Lo sentimos, solo quedan ${productoActual.stock} unidades disponibles.`);
    }
    document.getElementById('cant-detalle').innerText = cantidadSeleccionada;
}

// FUNCIÓN PARA PRODUCTOS RELACIONADOS
async function cargarRelacionados(idCategoria, idActual) {
    try {
        const res = await fetch('http://localhost:3000/api/productos');
        const todosLosProductos = await res.json();

        // Filtramos por categoría y excluimos el producto que ya estamos viendo
        const relacionados = todosLosProductos.filter(p => 
            p.id_categoria == idCategoria && p.id_producto != idActual
        );

        const contenedor = document.getElementById('productos-relacionados');
        if (!contenedor) return;

        contenedor.innerHTML = '';

        if (relacionados.length === 0) {
            contenedor.innerHTML = '<p class="text-muted small ps-3">No hay productos similares por ahora.</p>';
            return;
        }

        // Mostramos máximo los primeros 4 relacionados
        relacionados.slice(0, 4).forEach(p => {
            contenedor.innerHTML += `
                <div class="col-6 col-md-3">
                    <div class="card h-100 border-0 shadow-sm card-relacionado">
                        <a href="detalle.html?id=${p.id_producto}" class="text-decoration-none">
                            <div class="p-3 text-center">
                                <img src="${p.imagen_url}" class="img-fluid mb-2" style="height: 120px; object-fit: contain;" onerror="this.src='img/placeholder.jpg'">
                                <h6 class="text-dark small fw-bold text-truncate">${p.nombre}</h6>
                                <p class="text-primary fw-bold mb-0">S/ ${p.precio}</p>
                            </div>
                        </a>
                    </div>
                </div>`;
        });

    } catch (error) {
        console.error("Error cargando relacionados:", error);
    }
}