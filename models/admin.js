const { Schema, model } = require('mongoose')

const AdminSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
}, {
    toJSON: {
        transform: function (doc, admin, options) {
            admin.uid = admin._id
            delete admin._id
            delete admin.__v
            delete admin.password
            return admin
        }
    }
})

module.exports = model('Admin', AdminSchema)