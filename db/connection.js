const mongoose = require("mongoose")

const dbOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.DB_CNN, dbOptions)
        console.log('DB online')
    } catch (error) {
        throw new Error('DB Connection Error')
    }
}

module.exports = dbConnection