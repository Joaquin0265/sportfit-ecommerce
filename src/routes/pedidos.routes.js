const router = require('express').Router();
const pedidosController = require('../controllers/pedidos.controller');
const { verificarToken, esAdmin } = require('../middlewares/auth.middleware');

// Ruta para que el cliente cree su pedido
router.post('/checkout', verificarToken, pedidosController.crearPedido);

<<<<<<< HEAD
// Añade esta línea en pedidos.routes.js
// Ruta para que el cliente vea su historial (Debe estar protegida por el token)
router.get('/mis-pedidos', verificarToken, pedidosController.obtenerMisPedidos);

=======
>>>>>>> 404a015820dc9690f87fcd68651f120c47f25a44
// NUEVA: Ruta para que el Admin vea todos los pedidos
router.get('/admin', verificarToken, esAdmin, pedidosController.listarPedidosAdmin);

module.exports = router;