const  express = require("express");
const Post=require('../Models/Post');
const User=require('../Models/User');
const router = express.Router();
const fetchuser= require('../Middlewares/LoggedIn');

let error = { status : false, message:'Something went wrong!' }
let output = { status : true }

// yet to be tested
router.get('/', fetchuser, async(req, res) =>{
    try {
        const posts = await Post.find({}).limit(15).toArray();
        return res.json(posts);
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