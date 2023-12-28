const mongoose=require('mongoose'); 
const PostSchema = new mongoose.Schema({
    user_id : {
        type : String,
        required : true,
    },
    username : {
        type : String,
        required : true,
        unique : true
    },
    content:{
        type:String,
        required:true
    },
    name:{
        type : String,
        required : true
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
const Post= mongoose.model('Post', PostSchema);
Post.createIndexes(); 
module.exports=Post