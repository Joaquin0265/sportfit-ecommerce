const express = require('express');
const cors = require('cors');
<<<<<<< HEAD
const path = require('path'); 
const pool = require('./db'); 
const conectarMongoDB = require('./mongoDb'); // 🔥 Asegúrate de que esté SIN llaves

const app = express();

app.use(cors()); 
app.use(express.json()); 
app.use(express.static(path.join(__dirname, '../public')));

// 🚦 RUTAS DEL SISTEMA
=======
const path = require('path'); // Módulo para manejar rutas de archivos
const pool = require('./db'); 

const app = express();

// ==========================================
// 🛠️ MIDDLEWARES
// ==========================================
app.use(cors()); 
app.use(express.json()); 

// RUTA ESTÁTICA CORREGIDA: 
// path.join(__dirname, '../public') asegura que busque la carpeta public 
// saliendo de 'src', sin importar desde dónde lances el comando.
app.use(express.static(path.join(__dirname, '../public')));

// ==========================================
// 🚦 CONEXIÓN DE RUTAS (API)
// ==========================================
>>>>>>> 404a015820dc9690f87fcd68651f120c47f25a44
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/productos', require('./routes/productos.routes'));
app.use('/api/pedidos', require('./routes/pedidos.routes'));
app.use('/api/carrito', require('./routes/carrito.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
<<<<<<< HEAD
app.use('/api/resenas', require('./routes/resenas.routes')); // 🔥 Añade esta línea si no la pusiste

=======

// Ruta raíz de prueba
>>>>>>> 404a015820dc9690f87fcd68651f120c47f25a44
app.get('/', (req, res) => {
    res.send('💪 ¡Servidor del E-commerce de Suplementos activo!');
});

<<<<<<< HEAD
async function verificarConexion() {
    try {
        const [rows] = await pool.query('SELECT 1 + 1 AS result');
        console.log('✅ [DB] Conexión a MariaDB (proyectos) exitosa.');
        
        await conectarMongoDB();

    } catch (error) {
        console.error('❌ [DB] Error de conexión:', error.message);
=======
// ==========================================
// 🔍 VERIFICACIÓN DE BASE DE DATOS
// ==========================================
async function verificarConexion() {
    try {
        // Consulta de prueba a tu VM 192.168.1.7
        const [rows] = await pool.query('SELECT 1 + 1 AS result');
        console.log('✅ [DB] Conexión a MariaDB (192.168.1.7) exitosa.');
    } catch (error) {
        console.error('❌ [DB] Error de conexión:', error.message);
        console.log('💡 TIP: Asegúrate de que la VM esté encendida y el usuario tenga permisos remotos.');
>>>>>>> 404a015820dc9690f87fcd68651f120c47f25a44
    }
}

verificarConexion();

<<<<<<< HEAD
=======
// ==========================================
// 🚀 ENCENDER EL SERVIDOR
// ==========================================
>>>>>>> 404a015820dc9690f87fcd68651f120c47f25a44
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Backend corriendo en http://localhost:${PORT}`);
});