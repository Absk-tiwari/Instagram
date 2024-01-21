const mongoose=require('mongoose'); 
const NotificationSchema= new mongoose.Schema({     
    for : {
        type : String,
        required : true  
    }, 
    label : {
        type : String,
        default : null,
    }, 
    message : {
        type : String,
        required : true,
    }, 
    read : {
        type: Boolean,
        default : false
    },
    at : {
        type: Date,
        default : Date.now()
    }
});
const Notification=mongoose.model('Notification', NotificationSchema);
Notification.createIndexes();
module.exports=Notification 