const mongoose=require('mongoose'); 
const NotificationSchema= new mongoose.Schema({     
    type : {
        type : String, 
    }, 
    for : {
        type : String,
        required : true  
    }, 
    label : {
        type : String,
    }, 
    message : {
        type : String,
        required : true,
    }, 
    from:{
        type:String,
    },
    read : {
        type: Boolean,
        default : false
    },
    about : {
        type: String,
    },
    at : {
        type: Date,
        default : Date.now()
    }
});
const Notification=mongoose.model('Notification', NotificationSchema);
Notification.createIndexes();
module.exports=Notification 