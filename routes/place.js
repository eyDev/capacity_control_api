const { Router } = require('express')
const { check, param } = require('express-validator')
const validateFields = require('../middlewares/validateFields')
const validateJWT = require('../middlewares/validateJWT')
const { createPlace, getPlaces, updatePlace, deletePlace, updatePlaceImage, showPlaceImage } = require('../controllers/place')

const placeRouter = Router()

placeRouter.post(
    '/',
    validateJWT,
    [
        check("address", 'La dirección es incorrecta.').matches(/^.*$/),
        check("name", 'El nombre es incorrecto.').matches(/^.*$/),
        check("maxCapacity", 'La capacidad máxima es incorrecta.').isInt({ min: 1, max: 10000 }),
        check("maxCapacityPermited", 'La capacidad máxima perimitida es incorrecta.').isInt({ min: 1, max: 10000 }),
        validateFields
    ],
    createPlace
)

placeRouter.get(
    '/:query',
    getPlaces
)

placeRouter.put(
    '/:uid',
    validateJWT,
    [
        param("uid", "El id del lugar es incorrecto.").isMongoId(),
        check("address", 'La dirección es incorrecta.').matches(/^.*$/),
        check("name", 'El nombre es incorrecto.').matches(/^.*$/),
        check("maxCapacity", 'La capacidad máxima es incorrecta.').isInt({ min: 1, max: 10000 }),
        check("maxCapacityPermited", 'La capacidad máxima perimitida es incorrecta.').isInt({ min: 1, max: 10000 }),
        validateFields
    ],
    updatePlace
)

placeRouter.put(
    '/img/:uid',
    validateJWT,
    [
        param("uid", "El id del lugar es incorrecto.").isMongoId(),
        check("img")
            .custom((value, { req }) => {
                const acceptedFileType = ['png', 'jpg', 'jpeg']
                if (!req.files.img) {
                    throw new Error('La imagen es necesaria.')
                }
                if (req.files.img.size > 2097152) {
                    throw new Error('La imagen es muy pesada.')
                }
                const fileExtension = req.files.img.mimetype.split('/').pop()
                if (!acceptedFileType.includes(fileExtension)) {
                    throw new Error('Solo se aceptan imágenes con formato .png . jpg .jpeg.')
                }
                return true
            }),
        validateFields
    ],
    updatePlaceImage
)

placeRouter.get(
    '/img/:uid',
    [
        param("uid", "El id del lugar es incorrecto.").isMongoId(),
        validateFields
    ],
    showPlaceImage
)

placeRouter.delete(
    '/:uid',
    validateJWT,
    [
        param("uid", "El id del lugar es incorrecto.").isMongoId(),
        validateFields
    ],
    deletePlace
)

module.exports = placeRouter