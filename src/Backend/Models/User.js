const mongoose=require('mongoose'); 
const userSchema= new mongoose.Schema({
    name:{
        type : String,
        required : true
    },
    username : {
        type : String,
        required : true,
        unique : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    profile : {
        type : String,
        default:null,
    },
    phone : {
        type : String,
        default : null,
    },
    bio : {
        type: String,
        default : '',
    },
    date : {
        type : Date,
        default : Date.now
    }
});
const User=mongoose.model('User', userSchema);
User.createIndexes();
module.exports=User 