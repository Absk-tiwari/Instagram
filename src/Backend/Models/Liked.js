const mongoose=require('mongoose'); 
const LikedSchema = new mongoose.Schema({
    by:{
        type : mongoose.Schema.Types.ObjectId, ref:'User'
    },
    post_id : {
        type :mongoose.Schema.Types.ObjectId, ref:'Post'
    }
});
const Liked= mongoose.model('Liked', LikedSchema);

Liked.createIndexes(); 
module.exports=Liked