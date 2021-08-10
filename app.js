const dotenv = require('dotenv')
const Server = require('./models/server')
require('./db/connection')

dotenv.config()

const server = new Server()

server.listen()
