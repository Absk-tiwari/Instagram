const  express = require("express");
const User=require('../Models/User');
const router = express.Router();
const {body, validationResult }=require('express-validator')
const bcrypt= require('bcrypt');
const jwt= require('jsonwebtoken');
const fetchuser= require('../Middlewares/LoggedIn');
const JWT_SECRET = 'whateverItWas';
const transporter = require("./../utils/nodemailer");

let error = { status : false, message:'Something went wrong!' }
let output = { status : true }
const mailOptions = {
	from: 'absk1901mff@gmail.com',
};

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
		//await User.deleteMany({username:{$ne:'absk.tiwari'}})
        // return if the email already exists 
        let user = await User.findOne({email : req.body.email})
        if(user){
            return res.status(400).json({...error, key:'email', message:'A user with that email already exists!'})
        }

		let usernameExists = await User.findOne({username : req.body.username})
		if(usernameExists){
			return res.status(400).json({...error,key:'username',message:'username is taken!'})
		}
        // Gnerate hash with salt
        const salt = await bcrypt.genSalt(8);
        const secPass = await bcrypt.hash(req.body.password, salt)
        // Finally create one
        user= User.create({
            name : req.body.name,
            email : req.body.email.toLowerCase(),
            username : req.body.username.toLowerCase(),
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
	let username = req.body.username.toLowerCase()
        let user = await User.findOne({
		$or:[
		    {username},
		    {email:username},
		    {phone:username}
		]
	});
        if(!user){
            error.message = "User not found, please create an account to start!"
            return res.status(400).json(error)
        }
        const compared = await bcrypt.compare(req.body.password, user.password)
        if(!compared){
            error.message = "Incorrect Password!"
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

router.post('/forgotPassword', async(req, res) =>{
    try { 
		const found = await User.findOne({email:req.body.email}).select('_id')
		if(!found){ 
			return res.status(402).json({...error, key: 'email', message:'This email is not associated to any account'})
		} 
		const payload = {
            user_id : found._id
        } 
        const authToken = jwt.sign(payload, JWT_SECRET)

		mailOptions.to= req.body.email
		mailOptions.subject= 'Reset your password'
		mailOptions.html=`<h3>Please click <a href='${process.env.UI}/reset/${authToken}'>here</a> to reset your password.</h3>`

		transporter.sendMail(mailOptions, (err, info) => {

			if (err) {
				return res.status(402).json({...error, message:err.message});
			} else {
				return res.status(200).json({...output, message:'Email has been sent please check inbox.'}); 
			}

		});

    } catch (e) {
        error.message = e.message
        return res.status(500).json(error)     
    }
});	

router.post('/changePassword', async(req, res) =>{
    try {
        const token = req.body.tokenedID;  
		const data = jwt.verify(token, JWT_SECRET);
		const userid = data.user_id
		const salt = await bcrypt.genSalt(8);
        const converted = await bcrypt.hash(req.body.password, salt)
        const user = await User.updateOne({_id: userid}, {password:converted});
		if(user){
			return res.status(200).json({...output, message:'Password updated successfully!', user}) 
		}
		return res.status(400).json({...error,message:'Couldn\'t update the password!'})
    } catch (e) {
        error.message = e.message
        return res.status(500).json(error)     
    }
    }
);

module.exports=router 
