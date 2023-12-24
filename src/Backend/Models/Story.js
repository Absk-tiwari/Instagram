const mongoose=require('mongoose'); 
const storySchema = new mongoose.Schema({
    name:{
        type : String,
        required : true
    },
    username : {
        type : String,
        required : true,
        unique : true
    },
    date : {
        type : Date,
        default : Date.now
    }
});
const Story= mongoose.model('Story', storySchema);
Story.createIndexes(); 
module.exports=Story 