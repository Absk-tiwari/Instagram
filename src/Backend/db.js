const mongoose = require('mongoose')
const URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@incluster.j7sx1ka.mongodb.net/Instagram`;
// const URI = 'mongodb://0.0.0.0:27017/Instagram?tls=false&readPreference=primaryPreferred';

const connect = () => {
    mongoose.connect(URI).then(()=>console.log('mongoDB ready')).catch(err=>console.log(err.message))
}

module.exports = connect