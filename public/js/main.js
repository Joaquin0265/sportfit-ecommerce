// 1. Inicializar datos
let carrito = JSON.parse(localStorage.getItem('cart-fitness')) || [];
let productosLocales = []; 

// Al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    obtenerProductos();
    guardarYActualizar();
    verificarSesion();
    cargarBotonesCategorias(); 
});

// --- LÓGICA DE USUARIOS Y SESIÓN ---
function verificarSesion() {
    const contenedor = document.getElementById('contenedor-auth');
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('user_role');
    const nombre = localStorage.getItem('user_name');

    if (!contenedor) return;

    if (token) {
        let htmlAdmin = '';
        if (rol === 'Admin' || rol === 'Administrador') {
            htmlAdmin = `<a href="admin.html" class="btn btn-warning btn-sm me-2">⚙️ Panel Admin</a>`;
        }

        contenedor.innerHTML = `
            ${htmlAdmin}
            <span class="text-white me-3 small d-none d-md-inline">Hola, <strong>${nombre ? nombre.split(' ')[0] : 'Usuario'}</strong></span>
            <button onclick="logout()" class="btn btn-outline-danger btn-sm">Salir</button>
        `;
    } else {
        contenedor.innerHTML = `<a href="login.html" class="btn-login-custom">Iniciar Sesión</a>`;
    }
}

function logout() {
    localStorage.clear();
    window.location.href = 'index.html';
}

// --- LÓGICA DE PRODUCTOS Y FILTROS ---
async function obtenerProductos() {
    try {
        const respuesta = await fetch('http://localhost:3000/api/productos');
        productosLocales = await respuesta.json();
        renderizarProductos(productosLocales);
    } catch (error) {
        console.error('Error al obtener productos:', error);
    }
}

function renderizarProductos(lista) {
    const contenedor = document.getElementById('lista-productos');
    if (!contenedor) return; 

    contenedor.innerHTML = ''; 
    if (lista.length === 0) {
        contenedor.innerHTML = '<div class="col-12 text-center py-5"><p class="text-muted">No se encontraron productos.</p></div>';
        return;
    }

    lista.forEach(producto => {
        const stockClase = producto.stock <= 5 ? 'stock-bajo' : 'stock-ok';
        const stockTexto = producto.stock <= 0 ? 'Agotado' : `Stock: ${producto.stock}`;

        contenedor.innerHTML += `
            <div class="col-6 col-md-4 col-lg-3 mb-4">
                <div class="card h-100 shadow-sm card-producto border-0">
                    
                    <div class="contenedor-img-producto position-relative">
                        <img src="${producto.imagen_url}" class="img-producto-ajustada" alt="${producto.nombre}" 
                             onerror="this.src='img/placeholder.jpg'">
                        <span class="stock-badge ${stockClase}">${stockTexto}</span>
                    </div>
                    
                    <div class="card-body text-center d-flex flex-column p-2">
                        <h6 class="card-title fw-bold mb-1 text-dark" style="font-size: 0.95rem;">${producto.nombre}</h6>
                        <p class="card-text text-muted extra-small mb-2" style="font-size: 0.75rem;">${producto.descripcion.substring(0, 40)}...</p>
                        <p class="h5 text-primary mt-auto mb-2">S/ ${producto.precio}</p>
                        
                        <button class="btn btn-dark btn-sm w-100" 
                            onclick="window.location.href='detalle.html?id=${producto.id_producto}'">
                            Ver producto
                        </button>
                    </div>
                </div>
            </div>`;
    });
}

// --- CATEGORÍAS MEJORADO ---
async function cargarBotonesCategorias() {
    try {
        const res = await fetch('http://localhost:3000/api/admin/categorias');
        const categorias = await res.json();
        const menuLateral = document.getElementById('lista-categorias-menu');
        
        if (!menuLateral) return;

        menuLateral.innerHTML = `
            <button class="list-group-item list-group-item-action py-3" onclick="filtrarProductos('todas', 'Todos los Productos')">
                <i class="bi bi-grid-fill me-2 text-primary"></i> Ver Todo
            </button>`;

        categorias.forEach(cat => {
            menuLateral.innerHTML += `
                <button class="list-group-item list-group-item-action py-3" 
                    onclick="filtrarProductos(${cat.id_categoria}, '${cat.nombre}')">
                    <i class="bi bi-tag me-2 text-info"></i> ${cat.nombre}
                </button>`;
        });
    } catch (error) {
        console.error("Error cargando categorías:", error);
    }
}

function filtrarProductos(id_categoria, nombre) {
    const titulo = document.getElementById('titulo-seccion');
    if (titulo) titulo.innerText = nombre.toUpperCase();

    if (id_categoria === 'todas') {
        renderizarProductos(productosLocales);
    } else {
        const filtrados = productosLocales.filter(p => p.id_categoria == id_categoria);
        renderizarProductos(filtrados);
    }

    const offcanvasEl = document.getElementById('menuLateral');
    const instance = bootstrap.Offcanvas.getInstance(offcanvasEl);
    if (instance) instance.hide();
}

// --- BUSCADOR ---
function buscarEnTiempoReal() {
    const term = document.getElementById('input-buscador').value.toLowerCase();
    const filtrados = productosLocales.filter(p => 
        p.nombre.toLowerCase().includes(term) || 
        p.descripcion.toLowerCase().includes(term)
    );
    renderizarProductos(filtrados);
}

// --- CARRITO ---
function agregarAlCarrito(id, nombre, precio, imagen) {
    const existente = carrito.find(prod => prod.id === id);
    if (existente) { 
        existente.cantidad += 1; 
    } else { 
        carrito.push({ id, nombre, precio, imagen, cantidad: 1 }); 
    }
    guardarYActualizar();
}

function cambiarCantidad(index, cambio) {
    const prodOriginal = productosLocales.find(p => p.id_producto === carrito[index].id);
    let nuevaCant = carrito[index].cantidad + cambio;
    
    if (nuevaCant < 1) nuevaCant = 1;
    
    // Topeamos la cantidad si supera el stock real
    if (prodOriginal && nuevaCant > prodOriginal.stock) {
        nuevaCant = prodOriginal.stock;
    }
    
    carrito[index].cantidad = nuevaCant;
    guardarYActualizar();
}

function guardarYActualizar() {
    localStorage.setItem('cart-fitness', JSON.stringify(carrito));
    const listaHtml = document.getElementById('items-carrito');
    const totalHtml = document.getElementById('total-carrito');
    const contadorHtml = document.getElementById('contador-carrito');

    if (contadorHtml) {
        contadorHtml.innerText = carrito.reduce((total, p) => total + p.cantidad, 0);
    }

    if (!listaHtml) return;

    if (carrito.length === 0) {
        listaHtml.innerHTML = `
            <div class="d-flex flex-column align-items-center justify-content-center h-100 text-center px-3 mt-5">
                <i class="bi bi-cart-x text-muted mb-3" style="font-size: 4rem; opacity: 0.5;"></i>
                <h5 class="fw-bold text-secondary">Tu carrito está vacío</h5>
                <p class="text-muted small">¡Explora nuestra tienda y encuentra los mejores suplementos y equipos!</p>
                <button class="btn btn-outline-primary btn-sm rounded-pill mt-2" onclick="bootstrap.Offcanvas.getInstance(document.getElementById('menuCarrito')).hide()">
                    Empezar a comprar
                </button>
            </div>
        `;
        totalHtml.innerText = 'S/ 0.00';
        return;
    }

    let totalAcumulado = 0;
    listaHtml.innerHTML = ''; 

    carrito.forEach((p, index) => {
        // Buscamos el stock real para este producto
        const prodOriginal = productosLocales.find(prod => prod.id_producto === p.id);
        const stockAlcanzado = prodOriginal && p.cantidad >= prodOriginal.stock;

        totalAcumulado += p.precio * p.cantidad;
        listaHtml.innerHTML += `
            <div class="card mb-3 border-0 border-bottom p-2">
                <div class="row g-0 align-items-center">
                    <div class="col-3 text-center">
                        <img src="${p.imagen}" class="img-fluid rounded" style="max-height: 50px; object-fit: contain;">
                    </div>
                    <div class="col-5 ps-2">
                        <h6 class="mb-0 small fw-bold">${p.nombre}</h6>
                        <small class="text-muted">S/ ${p.precio}</small>
                    </div>
                    <div class="col-4 d-flex align-items-center justify-content-end">
                        <div class="d-flex align-items-center bg-light rounded-pill px-2 py-1 border">
                            <button class="btn btn-sm p-0 border-0" onclick="cambiarCantidad(${index}, -1)">
                                <i class="bi bi-dash-circle"></i>
                            </button>
                            <span class="mx-2 fw-bold small">${p.cantidad}</span>
                            <button class="btn btn-sm p-0 border-0" onclick="cambiarCantidad(${index}, 1)">
                                <i class="bi bi-plus-circle ${stockAlcanzado ? 'text-muted' : 'text-primary'}"></i>
                            </button>
                        </div>
                        <button class="btn btn-sm text-danger ms-2" onclick="eliminarDelCarrito(${index})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
                ${stockAlcanzado ? '<div class="text-danger text-end w-100 mt-1 pe-2" style="font-size: 0.70rem; font-weight: bold;"><i class="bi bi-exclamation-circle"></i> Cantidad máxima del stock</div>' : ''}
            </div>`;
    });
    totalHtml.innerText = `S/ ${totalAcumulado.toFixed(2)}`;
}

function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    guardarYActualizar();
}

// --- CHECKOUT ---
const btnCheckout = document.getElementById('btn-checkout');
if (btnCheckout) {
    btnCheckout.addEventListener('click', async () => {
        const token = localStorage.getItem('token');
        
        // 🔒 SI NO HAY SESIÓN INICIADA -> REDIRECT DIRECTO
        if (!token) {
            window.location.href = 'login.html';
            return;
        }

        const pedidoData = {
            productos: carrito,
            total: carrito.reduce((t, p) => t + (p.precio * p.cantidad), 0)
        };

        const offcanvasBody = document.querySelector('#menuCarrito .offcanvas-body');
        const estructuraOriginal = offcanvasBody.innerHTML;

        try {
            const response = await fetch('http://localhost:3000/api/pedidos/checkout', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(pedidoData)
            });

            const resData = await response.json();

            if (response.ok) {
                // ✅ PANTALLA DE ÉXITO
                carrito = [];
                guardarYActualizar();
                
                offcanvasBody.innerHTML = `
                    <div class="d-flex flex-column align-items-center justify-content-center h-100 text-center px-3 mt-5">
                        <i class="bi bi-check-circle-fill text-success mb-3" style="font-size: 5rem;"></i>
                        <h3 class="fw-bold text-dark">¡Compra Exitosa!</h3>
                        <div class="bg-light border rounded p-3 w-100 my-4 shadow-sm">
                            <p class="mb-1 text-secondary small fw-bold">NÚMERO DE ORDEN</p>
                            <h2 class="text-primary fw-bold mb-0">#${resData.id_pedido}</h2>
                        </div>
                        <button class="btn btn-dark w-100 py-3 fw-bold mt-auto" id="btn-volver-tienda">
                            <i class="bi bi-house-door me-2"></i>VOLVER A LA TIENDA
                        </button>
                    </div>
                `;

                document.getElementById('btn-volver-tienda').onclick = () => {
                    if (!window.location.pathname.includes('index.html') && window.location.pathname !== '/') {
                        window.location.href = 'index.html';
                    } else {
                        bootstrap.Offcanvas.getInstance(document.getElementById('menuCarrito')).hide();
                        setTimeout(() => { offcanvasBody.innerHTML = estructuraOriginal; }, 500);
                        obtenerProductos();
                    }
                };

            } else {
                // ❌ PANTALLA DE ERROR DE STOCK
                offcanvasBody.innerHTML = `
                    <div class="d-flex flex-column align-items-center justify-content-center h-100 text-center px-3 mt-5">
                        <i class="bi bi-exclamation-triangle-fill text-warning mb-3" style="font-size: 4rem;"></i>
                        <h4 class="fw-bold text-dark">Hubo un problema</h4>
                        <p class="text-danger fw-bold">${resData.error}</p>
                        <p class="text-muted small">Por favor, ajusta las cantidades en tu carrito e intenta nuevamente.</p>
                        <button class="btn btn-outline-dark w-100 py-2 fw-bold mt-4" id="btn-regresar-carrito">
                            REGRESAR AL CARRITO
                        </button>
                    </div>
                `;

                document.getElementById('btn-regresar-carrito').onclick = () => {
                    offcanvasBody.innerHTML = estructuraOriginal;
                    guardarYActualizar();
                };
            }
        } catch (error) {
            alert("Error de conexión con el servidor.");
        }
    });
}