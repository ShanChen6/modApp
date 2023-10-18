const mongoose = require('mongoose')

module.exports = connect = async () => {
    try {
        const mongoURL = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@localhost:${process.env.MONGO_PORT}/?authMechanism=DEFAULT`

        const response = await mongoose.connect(mongoURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })

        if (response) console.log('Connect mongo database success')
    } catch (error) {
        console.log(error.message)
    }
}
