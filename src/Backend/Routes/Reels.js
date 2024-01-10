const  express = require("express");
const User=require('../Models/User');
const Reel=require('../Models/Reel');
const router = express.Router();
const fetchuser= require('../Middlewares/LoggedIn');

let error = {status: false, message:'Something went wrong!'}
let output = {status: true, message:''}

// yet to be tested
router.post('/', fetchuser, async (req,res) => {
    try {
        
        // return if the email already exists 
        const reels = await Reel.find({}).limit(2).toArray()
        if(reels) return res.json(reels);
                
        
    } catch (e) {
        error.message = e.message
        return res.status(500).json(error)        
    }
});
 

// Route 3 : Authenticate the user
 
// like a reel - login required
router.post('/like', fetchuser, async(req, res) =>{
    try 
    { 
        const acted = await Reel.updateOne(req.body.id)
        if(acted) return res.json(output);
        return res.json(error);

    } catch (e) {
        error.message = e.message
        return res.status(500).send(error)
    }
    }
);
// add a comment
router.post('/comment', fetchuser, async(req, res) =>{
    try {
        const user = await User.findbyId(req.body.id)
        
        const created = await Reel.updateOne({
            comment: req.body.comment,
            commented: user.username
        })

        if(created){
            output.message ='Comment added!'
            return res.json(output);
        }
    } catch (e) {
        error.message = e.message 
        return res.status(500).send(error)
    }
    }
);

module.exports=router   