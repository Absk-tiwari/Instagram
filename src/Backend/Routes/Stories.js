const  express = require("express");
const Story=require('../Models/Story').default;
const router = express.Router();
const {body, validationResult }=require('express-validator')
const bcrypt= require('bcrypt');
const jwt= require('jsonwebtoken');
const fetchuser= require('../Middlewares/LoggedIn');
const JWT_SECRET = 'whateverItWas';
 
// Route 1 : Get all stories - login required
router.get('/', fetchuser, async(req, res) =>{
    try {
        const userid = req.body.id; 
        const user = await Story.findById(userid).select('-username');
        res.json(user);
    } catch (e) {
        res.status(500).send({status:false,message : e.message})
    }
    }
);

module.exports=router   