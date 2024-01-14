const mongoose = require('mongoose')
const URI = 'mongodb://0.0.0.0:27017/Instagram?tls=false&readPreference=primaryPreferred';

const connect = () => {
    mongoose.connect(URI).then(()=>console.log('mongoDB ready')).catch(err=>console.log(err.message))
}

module.exports = connect