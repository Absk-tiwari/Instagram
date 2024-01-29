const  express = require("express");
const User=require('../Models/User');
const Notification=require('../Models/Notification');
const router = express.Router();
const fetchuser= require('../Middlewares/LoggedIn');

let error = { status : false, message:'Something went wrong!' }
let output = { status : true }

// yet to be tested
router.get('/', fetchuser, async(req, res) =>{
    try {
        //await Message.deleteMany() // truncate data
        let userid = req.body.id
        let user = await User.findById(userid).select('username -_id')
        const resp = await Notification.find({for:user.username}) 
        return res.json(resp);

    } catch (e) {
        error.message = e.message
        return res.status(500).json(error)
    }
});


// has been tested and worked 

 
router.post('/of', fetchuser, async(req, res) =>{
    try {
        // await Message.deleteMany()
        let cID = req.body.cID
        let [fore,back] = cID.split('&')
        let one = fore+'&'+back
        let two = back+'&'+fore
        const result = await Message.find({
            $or : [
               { connectionID:one},
               { connectionID:two}
            ]
        }).select('from content');
          
        return res.json(result);

    } catch (e) {
        error.message = e.message
        return res.status(500).send(error)
    }
});


// has been tested and worked 
router.get('/read', fetchuser, async(req, res) =>{
    let user = await User.findById(req.body.id).select('username -_id')
    let read = await Notification.updateMany({for:user.username},{$set: {read:true}});
    if(read){
        output.message = 'You just read all the notifications'
        return res.json(output)
    }
    return res.json(error)
})

router.post('/create', fetchuser, async(req, res) =>{
    try {
        const user = await User.findById(req.body.id).select('-password')
        if(user){
            const post = await Post.create({
                user_id : user._id,
                username : user.username,
                name : user.name,
                content : req.body.postContent,
                caption : req.body.caption,
                location : req.body.location,
            })

            if(post){
                output.message ='Posted'
                return res.json(output);
            }
        }

        return res.json(error);
        
    } catch (e) {
        error.message = e.message 
        return res.json(error);
    }
});

router.post('/update', fetchuser, async(req, res) =>{
    try {
        const me = req.body.me
        const username = req.body.username
        let one = me+'&'+username
        let two = username+'&'+me

        const filter = {
            $or: [
              { connectionID: one },
              { connectionID: two },
            ],
          };
          
        const update = {
            $set: {
                read:true, // Update the 'value' field to a new value
                // Add more fields to update as needed
            },
        };
          
        let updated = await Message.updateMany(filter,update)
        if(updated){
            output.message ='done'
            return res.json(output);
        }
        return res.json(error);
         
    } catch (e) {
        error.message = e.message 
        return res.json(error);
    }
});



module.exports=router  