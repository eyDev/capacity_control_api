const express = require('express')
const cors = require('cors')
const dbConnection = require('../db/connection')
const fileUpload = require('express-fileupload')

class Server {
    constructor() {
        this.app = express()
        this.port = process.env.PORT
        this.paths = {
            public: '/api/public',
            auth: '/api/auth',
            place: '/api/place',
        }
        this.conectarDB()
        this.midlewares()
        this.routes()
    }

    async conectarDB() {
        await dbConnection()
    }

    midlewares() {
        this.app.use(cors())
        this.app.use(express.json())
        this.app.use(express.static('public'))
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true,
        }))
    }

    routes() {
        this.app.use(this.paths.public, require('../routes/public'))
        this.app.use(this.paths.auth, require('../routes/auth'))
        this.app.use(this.paths.place, require('../routes/place'))
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Server on ', this.port)
        })
    }
}

module.exports = Server