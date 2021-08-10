const { Router } = require('express')
const { check } = require('express-validator')
const validateFields = require('../middlewares/validateFields')
const { checkOutQR, checkInQR } = require('../controllers/public')

const publicRouter = Router()

publicRouter.post('/in',
    [
        check('placeID', 'El ID del establecimiento es incorrecto.').isMongoId(),
        check('deviceID', 'El ID del dispositivo es incorrecto.').isAlphanumeric().isLowercase().isLength({ min: 16, max: 16 }),
        validateFields,
    ],
    checkInQR
)

publicRouter.post('/out',
    [
        check('placeID', 'El ID del establecimiento es incorrecto.').isMongoId(),
        check('deviceID', 'El ID del dispositivo es incorrecto.').isAlphanumeric().isLowercase().isLength({ min: 16, max: 16 }),
        validateFields,
    ],
    checkOutQR
)

module.exports = publicRouter