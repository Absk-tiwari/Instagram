const mongoose= require('mongoose'); 
const reelSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true 
    }, 
    content:{
        type:String,
        required:true
    },
    type:{
        type : String,
        default : null 
    },
    location:{
        type : String,
        default : null 
    },
    tagged:{
        type : String,
        default : null 
    },
    created_at : {
        type : Date,
        default : Date.now
    },
    deleted : {
        type : Boolean,
        default:false
    }
});
const Reel= mongoose.model('Reel', reelSchema);

Reel.createIndexes(); 
module.exports= Reel