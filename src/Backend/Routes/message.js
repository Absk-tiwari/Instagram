const  express = require("express");
const Message=require('../Models/Message');
const User=require('../Models/User');
const router = express.Router();
const fetchuser= require('../Middlewares/LoggedIn');

let error = { status : false, message:'Something went wrong!' }
let output = { status : true }

// yet to be tested
router.post('/', fetchuser, async(req, res) =>{
    try {
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
            const post = Post.create({
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


// yet to be tested
router.get('/getuserPosts', fetchuser, async(req, res) =>{
    try { 
        const posts = await Post.findById(req.body.id).toArray();
        return res.json(posts);
    } catch (e) {
        error.message = e.message
        return res.status(500).send(error)
    }
});

module.exports=router  