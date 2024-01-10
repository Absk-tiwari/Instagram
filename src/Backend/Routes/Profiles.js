const  express = require("express");
const User=require('../Models/User');
const BlockedUser =require('../Models/BlockedUser');
const router = express.Router();
const fetchuser= require('../Middlewares/LoggedIn');

let error = { status : false, message:'Something went wrong!' }
let output = { status : true }

// yet to be tested : Get profile details - login required 
router.post('/getuser', fetchuser, async(req, res) =>{
    try {
        const userid  = req.body.id; 
        const user= await User.findById(userid).select('-password');
        return res.json(user);
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
 
 

module.exports = router   