const mongoose=require('mongoose'); 
const storySchema = new mongoose.Schema({
    name:{
        type : String,
        required : true
    },
    username : {
        type : String,
        required : true,
    },
    content : {
        type : String,
        required : true
    },
    viewed:{
        type : Boolean,
        default : false
    },
    created_at : {
        type : Date,
        default : Date.now
    }, 
    deleted : {
        type : Boolean,
        default : false
    }
});
const Story= mongoose.model('Story', storySchema);
Story.createIndexes(); 
module.exports=Story 