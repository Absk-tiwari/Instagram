const mongoose=require('mongoose'); 
const LikeSchema = new mongoose.Schema({
    by:{
        type : String, ref:'User'
    },
    post_id : {
    type :mongoose.Schema.Types.ObjectId, ref:'Post'
    }
});
const Like= mongoose.model('Like', LikeSchema);

Like.createIndexes(); 
module.exports=Like