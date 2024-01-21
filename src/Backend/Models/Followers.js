const mongoose=require('mongoose'); 
const FollowersSchema= new mongoose.Schema({     
    of : {
        type : String,
        required : true  
    }, 
    username : {
        type : String,
        required : true,
    },
    at:{
        type : Date,
        default: Date.now()
    }  
});
const Followers=mongoose.model('Followers', FollowersSchema);
Followers.createIndexes();
module.exports=Followers 