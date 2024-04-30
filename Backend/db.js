const mongoose = require('mongoose')
const URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@incluster.j7sx1ka.mongodb.net/Instagram`;

const connect = () => {
    mongoose.connect(URI).then(()=>console.log('mongoDB ready')).catch(err=>console.log(err.message))
}

module.exports = connect