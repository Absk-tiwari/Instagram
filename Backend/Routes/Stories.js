const express = require("express");
const Story =require('../Models/Story');
const User =require('../Models/User');
const router = express.Router();
const fetchuser= require('../Middlewares/LoggedIn');
 
let error = { status : false, message:'Something went wrong!' }
let output = { status : true }

// Route 1 : Get all stories for a user
router.get('/', fetchuser, async(req, res) =>{
    try 
    {
        const stories = await Story.findById(req.body.id).select('-username');
        if(stories) return res.json(stories);
        return res.json(error)

    } catch (e) {
        error.message = e.message
        return res.status(500).send(error)
    }
});

// Particular story view - not yet implemented or tested
router.get('/{user}/view', fetchuser, async(req, res) =>{
 
    try
    {
        const content = await Story.findById(req.params.user).select('content')
        if(content)  return res.json(content)
        return res.json(error)

    } catch (e) {
        error.message = e.message
        return res.status(500).send(error)
    }

});

// add to story *Not tested
router.post('/add', fetchuser, async(req, res) =>{
    try {
        const user = await User.findById(req.body.id); 
        const added = await Story.create({
            username : user.username,
            content : req.body.content
        });
        if(added){
            output.message = 'Added to story'
            return res.json(output);
        }
        return res.json(error)
    } catch (e) {
        error.message = e.message
        return res.status(500).send(error)
    }
});

module.exports=router   