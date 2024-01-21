const mongoose=require('mongoose'); 
const CommentSchema = new mongoose.Schema({
    from:{
        type : String,
        required : true
    },
    for:{
        type : String,
        required : true
    },
    content:{
        type:String,
        required:true
    },
    likes:{
        type:String,
        required:true
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
const Comment= mongoose.model('Comment', CommentSchema);

Comment.createIndexes(); 
module.exports=Comment