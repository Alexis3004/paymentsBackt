//Controllers
const UserController = require('@controllers/UserController')

// Middleware
const AuthMiddleware = require('@middlewares/Auth')
const ErrorHandlingMiddleware = require('@middlewares/ErrorHandling')
const VerifyTokenMiddleware = require('@middlewares/VerifyToken')

// Router
const router = require('express').Router()

router.get('/', (req, res) => {
    res.send('Servicio de pagos móvil por: Alexis Cáceres');
})

router.post('/login', ErrorHandlingMiddleware, UserController.login)
router.post('/register', ErrorHandlingMiddleware, UserController.register)
router.post('/actualizar-token', AuthMiddleware, ErrorHandlingMiddleware, UserController.actualizarToken)
router.patch('/user/update/pin/:id', AuthMiddleware, ErrorHandlingMiddleware, UserController.updatePin)
router.patch('/user/update/:id', AuthMiddleware, ErrorHandlingMiddleware, UserController.update)



module.exports = router;
