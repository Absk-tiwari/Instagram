const  express = require("express");
const User=require('../Models/User');
const router = express.Router();
const {body, validationResult }=require('express-validator')
const bcrypt= require('bcrypt');
const jwt= require('jsonwebtoken');
const fetchuser= require('../Middlewares/LoggedIn');
const JWT_SECRET = 'whateverItWas';

let error = { status : false, message:'Something went wrong!' }
let output = { status : true }

// Create a user
router.post('/signup',[
    body('name').isLength({min:5}),
    body('username').isLength({min:5}),
    body('password').isLength({min:6}),
],async (req,res) => {
    try {
        const errors=validationResult(req);
        // If there are error return and finish right away
        if(!errors.isEmpty()){
            return res.status(400).res.json({errors : errors.array()})
        }
        // return if the email already exists 
        let user = await User.findOne({email : req.body.email})
        if(user){
            error.message="A user with that email already exists!"
            return res.status(400).json(error)
        }
        // Gnerate hash with salt
        const salt = await bcrypt.genSalt(8);
        const secPass = await bcrypt.hash(req.body.password, salt)
        // Finally create one
        user= User.create({
            name : req.body.name,
            email : req.body.email,
            username : req.body.username,
            password : secPass
        })

        output.message = 'Account created successfully!'
        return res.json(output);
        
    } catch (e) {
        error.message = e.message
        return res.status(500).json(error)        
    }
});
 

// Route 3 : Authenticate the user
router.post('/login',[ 
    body('username','Invalid credentials!').isLength({min:5}),
    body('password','Password cannot be blank!').exists(),
],async (req,res) => {
    try {
        const errors=validationResult(req);
        // Iff ? its finished : can go
        if(!errors.isEmpty()){
            return res.status(400).json({errors : errors.array()})
        } 
        let user = await User.findOne({username : req.body.username})
        if(!user){
            error.message = "User not found, please create an account to start!"
            return res.status(400).json(error)
        }
        const compared = await bcrypt.compare(req.body.password, user.password)
        if(!compared){
            error.message = "Incorrect Credentials!"
            return res.status(400).json(error)
        }
        
        const payload = {
            user : {
                id : user.id
            }
        }
        const authToken = jwt.sign(payload, JWT_SECRET)
        return res.json({status:true, authToken})
        
    } catch (e) {
        error.message = e.message
        return res.status(500).json(error)        
    }
});

// Route 3 : Get logged in user details - login required
router.get('/getuser', fetchuser, async(req, res) =>{
    try {
        const userid = req.body.id; 
        const user = await User.findById(userid).select('-password');
        return res.json(user) 
    } catch (e) {
        error.message = e.message
        return res.status(500).json(error)     
    }
    }
);

module.exports=router   