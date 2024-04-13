const mongoose=require('mongoose'); 
const SavedSchema = new mongoose.Schema({
    
    username : {
        type : String,
        required : true,
    }, 
    post_id : [{
		type :mongoose.Schema.Types.ObjectId, 
		ref:'Post'
    }]

});
const Saved= mongoose.model('Save', SavedSchema);

Saved.createIndexes(); 
module.exports=Saved