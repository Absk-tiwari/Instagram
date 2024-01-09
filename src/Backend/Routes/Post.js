const  express = require("express");
const Post=require('../Models/Post');
const User=require('../Models/User');
const router = express.Router();
const {body, validationResult }=require('express-validator')
const bcrypt= require('bcrypt');
const jwt= require('jsonwebtoken');
const fetchuser= require('../Middlewares/LoggedIn');
const JWT_SECRET = 'whateverItWas';



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
                return res.json({status:true, message:'Posted!'});
            }
        }

        return res.json({status:false,message:'An error occurred!'});
        
    } catch (e) {
        console.log(e.message)
        return res.json({status:false,message:'Error 500 -'+e.message});
    }
    }
);

router.get('/getPosts', fetchuser, async(req, res) =>{
    try {
        const posts = await Post.find({}).limit(15).toArray();
        res.json(posts);
    } catch (e) {
        res.status(500).send({status:false,message : 'Internal server occurred!'})
    }
    }
);

router.get('/getuserPosts', fetchuser, async(req, res) =>{
    try {
        const userid  = req.body.id; 
        const posts = await Post.findById(userid).toArray();
        res.json(posts);
    } catch (e) {
        res.status(500).send({status:false,message : 'Internal server occurred!'})
    }
    }
);

module.exports=router  