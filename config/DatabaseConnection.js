const mongoose = require('mongoose')

const connectDatabase = function () {
    mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }, (error) => {
        if (error) {
            console.log('Database Error : ', error.message);
        }
    })

    mongoose.connection.once('open', () => {
        console.log('Database Connected.........!');
    })
}

module.exports = connectDatabase