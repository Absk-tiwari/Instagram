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
    replies:[{type:Object}],  
    likes:[{type:String}],  
    at : {type : Date,default : Date.now}
});
const Comment= mongoose.model('Comment', CommentSchema);

Comment.createIndexes(); 
module.exports=Comment