const mongoose=require('mongoose'); 
const blockedSchema = new mongoose.Schema({
    user : {
        type : String,
        required : true
    },
    blocked_user : {
        type : String,
        required : true
    }        
});

const BlockedUser=mongoose.model('BlockedUser', blockedSchema);
BlockedUser.createIndexes();
module.exports= BlockedUser 