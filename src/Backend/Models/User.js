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
    followers:{
        type:Number,
        default:0
    },
    following:{
        type:Number,
        default:0
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
    gender : {
        type: String,
        default : '',
    },
    date : {
        type : Date,
        default : Date.now
    },
    active : {
        type : String,
        default : null
    },
    deleted:{
        type : Boolean,
        default:false
    },
    deleted_at:{
        type: Date,
        default:null
    },
});
const User=mongoose.model('User', userSchema);
User.createIndexes();
module.exports=User 