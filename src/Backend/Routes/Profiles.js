const  express = require("express");
const User=require('../Models/User');
const BlockedUser =require('../Models/BlockedUser');
const router = express.Router();
const fetchuser= require('../Middlewares/LoggedIn');

let error = { status : false, message:'Something went wrong!' }
let output = { status : true }

router.post('/update',fetchuser, async(req,res)=>{
    try {
        const update = {
            $set: {
                read:true, // Update the 'value' field to a new value
                // Add more fields to update as needed
                profile:req.body.image,
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

// yet to be tested : Get profile details - login required 
router.post('/getuser', fetchuser, async(req, res) =>{
    try {
        let userid  = req.body.id;  
        if(req.body.username){
             let user = await User.find({username:req.body.username}).select('-password') 
             return res.json(user)
        }else{
             let user= await User.findById(userid).select('-password');
             return await res.json(user) 
        }

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
            console.log(res)
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
         console.log(users)
        let fetchedUsers = await User.find({username:{ $in: users } })

        return res.json(fetchedUsers);

    }catch(e){
        return res.json({message:e.message})
    }
})

router.post('/search',fetchuser,async(req,res)=>{
    try{
        let term = req.body.param
         console.log(term)
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

module.exports = router   