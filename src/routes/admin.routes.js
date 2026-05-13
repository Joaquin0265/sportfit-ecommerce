const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { verificarToken, esAdmin } = require('../middlewares/auth.middleware');

// --- CATEGORÍAS ---

// ✅ RUTA PÚBLICA: Cualquier usuario debe poder ver las categorías para navegar en la tienda
router.get('/categorias', adminController.obtenerCategorias);

// 🛡️ RUTAS PROTEGIDAS: Solo el Admin puede gestionar las categorías
router.get('/categorias/:id', verificarToken, esAdmin, adminController.obtenerCategoriaPorId);
router.post('/categorias', verificarToken, esAdmin, adminController.crearCategoria);
router.put('/categorias/:id', verificarToken, esAdmin, adminController.actualizarCategoria);
router.delete('/categorias/:id', verificarToken, esAdmin, adminController.eliminarCategoria);

// --- REPORTES Y USUARIOS (Protegidos) ---
router.get('/reportes', verificarToken, esAdmin, adminController.obtenerResumenVentas);
router.get('/usuarios', verificarToken, esAdmin, adminController.listarUsuarios);
router.put('/promociones', verificarToken, esAdmin, adminController.aplicarDescuentoCategoria);

// --- PEDIDOS (Protegidos) ---
router.get('/pedidos', verificarToken, esAdmin, adminController.obtenerPedidos);
router.get('/pedidos/:id', verificarToken, esAdmin, adminController.obtenerPedidoPorId);
router.post('/pedidos', verificarToken, esAdmin, adminController.crearPedidoManual); 
router.put('/pedidos/:id', verificarToken, esAdmin, adminController.actualizarEstadoPedido);
router.delete('/pedidos/:id', verificarToken, esAdmin, adminController.eliminarPedido);

module.exports = router;