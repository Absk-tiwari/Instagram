const mongoose=require('mongoose'); 
const messageSchema = new mongoose.Schema({
    from:{
        type : String,
        default : null,
    },
    to:{
        type : String,
        default : null,
    },
    connectionID: {
        type: String,
        required:true
    },
    content:{
        type : String,
        default : null,
    },
    at : {
        type : Date,
        default : Date.now()
    },
    read : {
        type : Boolean,
        default : false
    },
    deleted_by : {
        type : String,
        default:null
    }
});
const Message= mongoose.model('Message', messageSchema);

Message.createIndexes(); 
module.exports=Message