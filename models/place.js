const { Schema, model } = require('mongoose')

const PlaceSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true
    },
    maxCapacity: {
        type: Number,
        required: true
    },
    maxCapacityPermited: {
        type: Number,
        required: true
    },
    currentUsers: [{
        type: String,
        unique: true
    }],
}, {
    toJSON: {
        transform: function (doc, place, options) {
            place.uid = place._id
            place.currentUsers = place.currentUsers.length
            delete place._id
            delete place.__v
            return place
        }
    }
})

module.exports = model('Place', PlaceSchema)