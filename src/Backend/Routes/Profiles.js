const  express = require("express");
const User=require('../Models/User');
const Post=require('../Models/Post');
const BlockedUser =require('../Models/BlockedUser');
const Followers =require('../Models/Followers');
const router = express.Router();
const fetchuser= require('../Middlewares/LoggedIn');
const upload = require('../Middlewares/multer');
const uploadOnCloudnary = require('../utils/cloudinary')
let error = { status : false, message:'Something went wrong!' }
let output = { status : true }

router.get('/test', async(req,res)=>{
    let data = await Post.find().select('content -_id')
    return   res.json(data)
})

router.post('/update',[ upload.single('image'), fetchuser], async(req,res)=>{
    try {
		if(!req.file) res.json(error)
		const uploaded = await uploadOnCloudnary(req.file.path)
        const update = {
            $set: {
                profile:uploaded.url,
                bio : req.body.bio
            },
        };
        let updated = await User.updateOne({_id:req.body.id},update)
        if(updated){ 
            let user = await User.findById(req.body.id)
            return res.json(user)
        }
        return res.json(error)
    } catch (err) {
        error.message = err.message
        return res.json(error)
    }
})

router.post('/getuser', fetchuser, async(req, res) =>{
    try {
        let userid  = req.body.id;  
        let user= await User.findById(userid).select('-password');
        if(req.body.username){
            let tgetUser = await User.findOne({username:req.body.username}).select('-password') 
            let isFollowing 
            if(tgetUser.followers){
                isFollowing = await Followers.findOne({of:tgetUser.username,username:user.username}).select('username') 
            }
            return res.json({user:tgetUser, isFollowing:isFollowing??0})
        } 
        return  res.json(user) 
        

    } catch (e) {
        error.message = e.message
        return res.status(500).send(error)
    }
});

// block someone for a user 
router.post('/block', fetchuser, async (req,res) => {
    try { 
        
       // yet to be tested
       const users = [req.body.id, req.body.user_id]

       let fetchedUsers;
        await User.find({ $in: users }).project({ username:1 }).toArray(function(err, res){
            if(err){
                return res.json(error)
            }
            fetchedUsers = res;
        })
       
        // const userblock = await User.findById(req.body.id)

       if(fetchedUsers){
           const resp = await BlockedUser.create({
             user: fetchedUsers[0].username,
             blocked_user : fetchedUsers[1].username
           })
           if(resp){
              output.message = 'User blocked!'
              return res.json(output);
           }
       }

       return res.json(error)
        
    } catch (e) {
        error.message = e.message
        return res.status(500).json(error)        
    }
});
 
router.post('/users',fetchuser,async(req,res)=>{
    try{
        let users = req.body.users
        let fetchedUsers = await User.find({username:{ $in: users } })
        return res.json(fetchedUsers);
    }catch(e){
        return res.json({...error,message:e.message})
    }
})

router.post('/search',fetchuser,async(req,res)=>{
    try{
        let term = req.body.param
        let fetchedUsers = await User.find({
            $or: [
                { name: { $regex: term, $options: 'i' } }, // Case-insensitive search
                { username: { $regex: term, $options: 'i' } },
                // Add more conditions if needed
              ],
         }).select('-password')
        return res.json(fetchedUsers);

    }catch(e){
        return res.json({message:e.message})
    }
})

router.get('/getProfiles',fetchuser,async(req,res)=>{
    try{ 
        let fetchedUsers = await User.find({
			_id:{$ne:req.body.id}
		}).select('-password')
        return res.json({...output, profiles:fetchedUsers});

    }catch(e){
        return res.json({message:e.message})
    }
})


module.exports = router   