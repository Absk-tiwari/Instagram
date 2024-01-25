const  express = require("express");
const Post=require('../Models/Post');
const User=require('../Models/User');
const Liked=require('../Models/Liked');
const router = express.Router();
const fetchuser= require('../Middlewares/LoggedIn');
const Comment = require("../Models/Comments");
const Followers = require("../Models/Followers");

let error = { status : false, message:'Something went wrong!' }
let output = { status : true }

// yet to be tested
router.get('/',   async(req, res) =>{
    try {
        const posts = await Post.find()
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
            let obj = {
                user_id : user._id,
                username : user.username,
                name : user.name,
                content : req.body.postContent,
                caption : req.body.caption,
                location : req.body.location,
            }
            const post = await Post.create(obj)

            if(post){
                output.message ='Posted'
                output.post = obj
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
        const posts = await Post.find({user_id: req.body.id});
        return res.json(posts);
    } catch (e) {
        error.message = e.message
        return res.status(500).json(error)
    }
});

router.post('/getPostsOf', fetchuser, async(req, res) =>{
    try { 
        const posts = await Post.find({username:req.body.username});
        return res.json(posts);
    } catch (e) {
        error.message = e.message
        return res.status(500).json(error)
    }
});

router.post('/update', fetchuser, async(req, res) =>{
    try { 
        let set={}
        let thisUser = await User.findById(req.body.id).select('username profile -_id')
        console.log(thisUser,req.body.targetUsername)
        if(req.body.type==='comment'){
            let comments = await Comment.find({_id:req.body.postID})
            return res.json(comments)            
        }
        if(req.body.type==='like'){
            set = {$push:{likes:req.body.id}}
        }
        if(req.body.type==='unlike'){
            set = {$pull:{likes:req.body.id}}
        }
        if(req.body.type==='follow'){
            let updateset = { $inc: { followers: 1} } 
            const updated = await User.updateOne({username:req.body.targetUsername}, updateset)
            if(updated){
                await Followers.create({
                    of : req.body.targetUsername,    
                    username : thisUser.username 
                }); 
                return res.status(200).json(output)
            }
            return res.json(error)
        }
        if(req.body.type==='unfollow'){
 
            let deleted = await Followers.deleteOne({of:req.body.targetUsername, username:thisUser.username })
            if(deleted){  
                console.log(req.body.targetUsername, thisUser.username, deleted)
                let updated = await User.updateOne({username:req.body.targetUsername}, {$inc : {followers:-1}} )
                if(updated) return res.json(output)
            }
            return res.end(500).json(error)
        }
 
        let updated = await Post.updateOne({_id:req.body.postID},set)
        if(req.body.type==='like'){
           let added= await Liked.create({
                by:req.body.id,
                post_id:req.body.postID
            });
           if(!added){
             error.message='couldn\'t add the like'
             return res.json(error)
           }
        }
        if(req.body.type==='unlike'){
            let rem= await Liked.deleteOne({by:req.body.user,post_id:req.body.postID});
            if(!rem){
               error.message='couldn\'t remove like'
               return res.json(error)
            }
        }
        if(updated){  
            output.message = 'Went straight.'
            return res.json(output)
        }
        return res.json(error)
    } catch (e) {
        error.message = e.message
        return res.status(500).json(error)
    }
});

router.post('/addComment', fetchuser, async(req, res) =>{
    try { 
         
        let thisUser = await User.findById(req.body.id).select('username -_id')
        let added = await Comment.create({
            from:thisUser.username,
            for:req.body.username,
            content:req.body.comment
        })
           
        if(added) return res.json(output)
 
        error.message='unable to add the comment'
        return res.json(error)
    } catch (e) {
        error.message = e.message
        return res.status(500).json(error)
    }
});

module.exports=router  