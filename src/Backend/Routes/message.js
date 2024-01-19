const  express = require("express");
const Message=require('../Models/Message');
const User=require('../Models/User');
const Post=require('../Models/Post');
const router = express.Router();
const fetchuser= require('../Middlewares/LoggedIn');

let error = { status : false, message:'Something went wrong!' }
let output = { status : true }

// yet to be tested
router.post('/', fetchuser, async(req, res) =>{
    try {
        //await Message.deleteMany() // truncate data
        let username = req.body.username
        const result = await Message.aggregate([
            {
              $match: {
                $or:[
                    {from: username},
                    {to: username}
                ] // Add your WHERE condition here
              },
            },
            {
              $group: {
                _id: '$connectionID',
                count: { $sum: 1 },
              },
            },
        ]);
        // console.log('message results',result)
        let conv =[]
        for(let item of result){
 
                let [a,b] = (item._id).split('&')
                let one = a+'&'+b
                let two = b+'&'+a
                let data = await Message.find({            
                  $or : [
                    { connectionID:one},
                    { connectionID:two}
                  ]
                }).select('content read from at -_id');
                let lastInd = data.length -1
                let lastMessage = data[lastInd].content
                let lastMessageFrom = data[lastInd].from
                let reads = data.filter(it=>{return it.read===false});
                console.log(reads.length , typeof reads)
                item.last = reads && Object.keys(reads).length > 1 ?`${Object.keys(reads).length} new messages`:lastMessage
                item.read = Object.keys(reads).length ? false : true
                item.from = lastMessageFrom
                item.at = data[lastInd].at
                if(Object.keys(reads).length > 0){
                    item.MessageOfSender = lastMessage
                }
                conv.push(item)
  
        }
        // let conv = 
        // result.filter(item=>{
        //      return item._id!==username
        // }) 
        return res.json(conv);
    } catch (e) {
        error.message = e.message
        return res.status(500).send(error)
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
          
        console.log(result);
        return res.json(result);

    } catch (e) {
        error.message = e.message
        return res.status(500).send(error)
    }
});


// has been tested and worked 

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