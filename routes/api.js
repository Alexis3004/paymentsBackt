//Controllers
const UserController = require('@controllers/UserController')
const BancoController = require('@controllers/BancoController')
const TiendaController = require('@controllers/TiendaController')
const TransaccionController = require('@controllers/TransaccionController')

// Middleware
const AuthMiddleware = require('@middlewares/Auth')
const ErrorHandlingMiddleware = require('@middlewares/ErrorHandling')
// const VerifyTokenMiddleware = require('@middlewares/VerifyToken')

// Router
const router = require('express').Router()

router.get('/', (req, res) => {
    res.send('Servicio de pagos móvil por: Alexis Cáceres');
})

router.post('/login', ErrorHandlingMiddleware, UserController.login)
router.post('/register', ErrorHandlingMiddleware, UserController.register)
router.post('/logout', AuthMiddleware, ErrorHandlingMiddleware, UserController.logout)
router.post('/actualizar-token', AuthMiddleware, ErrorHandlingMiddleware, UserController.actualizarToken)
router.patch('/user/update/pin/:id', AuthMiddleware, ErrorHandlingMiddleware, UserController.updatePin)
router.patch('/user/update/:id', AuthMiddleware, ErrorHandlingMiddleware, UserController.update)
router.get('/user/saldo', AuthMiddleware, ErrorHandlingMiddleware, UserController.consultarSaldo)
router.get('/user/movimientos', AuthMiddleware, ErrorHandlingMiddleware, UserController.consultarMovimientos)

router.post('/transaccion/recargar', AuthMiddleware, ErrorHandlingMiddleware, TransaccionController.recargar)

router.get('/asociados', BancoController.index)
router.get('/tiendas', TiendaController.index)

module.exports = router;
