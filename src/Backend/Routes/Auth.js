const  express = require("express");
const User=require('../Models/User');
const router = express.Router();
const {body, validationResult }=require('express-validator')
const bcrypt= require('bcrypt');
const jwt= require('jsonwebtoken');
const fetchuser= require('../Middlewares/FetchUser');
const JWT_SECRET = 'whateverItWas';


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
        let user= await User.findOne({email : req.body.email})
        if(user){
            return res.status(400).json({error : "A user with that email already exists!"})
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
        const data = {
            user : {
                id : user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        res.json({authToken});
        
    } catch (e) {
        console.log(e.message);
        res.status(500).json({'error':error.message})        
    }
});
 

// Route 3 : Authenticate the user
router.post('/login',[ 
    body('username','Invalid credentials!').isLength({min:5}),
    body('password','Password cannot be blank!').exists(),
],async (req,res) => {
    try {
        const errors=validationResult(req);
        // If there are errors return and finish right away
        if(!errors.isEmpty()){
            return res.status(400).res.json({errors : errors.array()})
        }
        const {username, password} = req.body;
        let user= await User.findOne({username : req.body.username})
        if(!user){
            return res.status(400).json({error : "Incorrect Credentials!"})
        }
        const compared = await bcrypt.compare(password, user.password)
        if(!compared){
            return res.status(400).json({error : "Incorrect Credentials!"})
        }
        
        const payload = {
            user : {
                id : user.id
            }
        }
        const authToken = jwt.sign(payload, JWT_SECRET);
        res.json({authToken});
        
    } catch (e) {
        console.log(e.message);
        res.status(500).json({'error':'Internal server error!'})        
    }
});

// Route 3 : Get logged in user details - login required
router.post('/getuser', fetchuser, async(req, res)=>{
try {
    const userid  = req.body.id; 
    // console.log(req.body);
    const user= await User.findById(userid).select('-password');
    
    res.json(user);
    
} catch (e) {
    console.log(e.message);
    res.status(500).send({error : 'Internal server occurred!'})
}
});

module.exports=router   