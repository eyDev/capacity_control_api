const Place = require('../models/place')

const checkInQR = async (req, res) => {
    const { placeID, deviceID } = req.body

    try {
        await Place.findByIdAndUpdate(
            placeID,
            { $addToSet: { currentUsers: deviceID } },
        )

        // *Elimna automáticamente el usuario del lugar público asignado después de un determinado tiempo
        setTimeout(async function () {
            await Place.findByIdAndUpdate(
                placeID,
                { $pull: { currentUsers: { $in: [deviceID] } } },
            )
        }, 1800000)

        return res.status(200).json({
            ok: true,
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

const checkOutQR = async (req, res) => {
    const { placeID, deviceID } = req.body
    try {
        await Place.findByIdAndUpdate(
            placeID,
            { $pull: { currentUsers: { $in: [deviceID] } } },
        )

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

module.exports = {
    checkInQR,
    checkOutQR
}