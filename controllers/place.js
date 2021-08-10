const Place = require('../models/place')
const path = require('path')
const fs = require('fs')
const ObjectId = require('mongoose').Types.ObjectId;

const createPlace = async (req, res) => {
    const { _id, currentUsers, ...placeData } = req.body
    const place = new Place(placeData)
    try {
        const savedPlace = await place.save()
        res.status(201).json({
            ok: true,
            place: savedPlace
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            errors: [
                {
                    "msg": "Error Interno.",
                    "param": "server",
                    "location": "server"
                }
            ]
        })
    }
}

const getPlaces = async (req, res) => {
    const { query } = req.params
    try {
        let places
        if (ObjectId.isValid(query)) {
            places = await Place.findById(query)
        } else {
            places = await Place.find({
                $or: [
                    { 'name': { "$regex": query, "$options": "i" } },
                    { 'address': { "$regex": query, "$options": "i" } },
                ]
            }).limit(6)
        }
        res.status(200).json({
            ok: true,
            places
        })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            errors: [
                {
                    "msg": "Error Interno.",
                    "param": "server",
                    "location": "server"
                }
            ]
        })
    }
}

const updatePlace = async (req, res) => {
    const { uid } = req.params
    const { _id, currentUsers, ...placeData } = req.body
    try {
        const place = await Place.findById(uid)
        if (!place) {
            return res.status(404).json({
                ok: false,
                errors: [
                    {
                        "msg": "El lugar no existe!",
                        "param": "lugar",
                        "location": "user"
                    }
                ]
            })
        }
        const placeUpdated = await Place.findByIdAndUpdate(uid, placeData, { new: true })
        res.status(200).json({
            ok: true,
            place: placeUpdated
        })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            errors: [
                {
                    "msg": "Error Interno.",
                    "param": "server",
                    "location": "server"
                }
            ]
        })
    }
}

const deletePlace = async (req, res) => {
    const { uid } = req.params
    try {
        const place = await Place.findById(uid)
        if (!place) {
            return res.status(404).json({
                ok: false,
                errors: [
                    {
                        "msg": "El lugar no existe.",
                        "param": "server",
                        "location": "server"
                    }
                ]
            })
        }
        await Place.findByIdAndDelete(uid)
        res.status(200).json({
            ok: true,
        })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            errors: [
                {
                    "msg": "Error Interno.",
                    "param": "server",
                    "location": "server"
                }
            ]
        })
    }
}

const updatePlaceImage = async (req, res) => {
    const { uid } = req.params
    try {
        const place = await Place.findById(uid)
        if (!place) {
            return res.status(404).json({
                ok: false,
                errors: [
                    {
                        "msg": "El lugar no existe!",
                        "param": "lugar",
                        "location": "user"
                    }
                ]
            })
        }

        const { img } = req.files
        const nombreCortado = img.name.split('.')
        const extension = nombreCortado[nombreCortado.length - 1]

        const nombreTemp = uid + '.' + extension
        const uploadPath = path.join(__dirname, '../uploads/', nombreTemp)

        img.mv(uploadPath, (err) => {
            if (err) {
                throw new Error('Error al subir el archivo.')
            }
        })

        res.status(200).json({
            ok: true,
        })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            errors: [
                {
                    "msg": "Error Interno.",
                    "param": "server",
                    "location": "server"
                }
            ]
        })
    }
}

const showPlaceImage = async (req, res = response) => {
    const { uid } = req.params

    const pathImagen = path.join(__dirname, '../uploads', uid)

    if (fs.existsSync(pathImagen + '.png')) { return res.status(200).sendFile(pathImagen + '.png') }
    if (fs.existsSync(pathImagen + '.jpg')) { return res.status(200).sendFile(pathImagen + '.jpg') }
    if (fs.existsSync(pathImagen + '.jpeg')) { return res.status(200).sendFile(pathImagen + '.jpeg') }

    const defaultPathImagen = path.join(__dirname, '../assets/no-image.jpg')
    return res.status(200).sendFile(defaultPathImagen)
}

module.exports = {
    createPlace,
    getPlaces,
    updatePlace,
    updatePlaceImage,
    showPlaceImage,
    deletePlace
}