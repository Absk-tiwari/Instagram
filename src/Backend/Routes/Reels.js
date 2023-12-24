const  express = require("express");
const User=require('../Models/User');
const router = express.Router();
const {body, validationResult }=require('express-validator')
const bcrypt= require('bcrypt');
const jwt= require('jsonwebtoken');
const fetchuser= require('../Middlewares/LoggedIn');
const JWT_SECRET = 'whateverItWas';


// Create a user
router.post('/', fetchuser, async (req,res) => {
    try {
        
        // return if the email already exists 
          
        // Finally create one
 
        res.json({status:true});
        
    } catch (e) {
        res.status(500).json({status:false, message:error.message})        
    }
});
 

// Route 3 : Authenticate the user
 
// Route 3 : Get logged in user details - login required
router.post('/getuser', fetchuser, async(req, res) =>{
    try {
        const userid  = req.body.id; 
        const user= await User.findById(userid).select('-password');
        res.json(user);
    } catch (e) {
        res.status(500).send({status:false,message : 'Internal server occurred!'})
    }
    }
);

module.exports=router   