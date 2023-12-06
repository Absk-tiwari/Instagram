const jwt = require('jsonwebtoken');
const JWT_SECRET = 'whateverItWas';

const loggedIn= (req, res , next)=> {
    try{
        const token = req.header('auth-token'); 
       // console.log(token);
        if(!token){
            res.status(401).send({error: 'Please authenticate using correct token'})
        }
        const data = jwt.verify(token, JWT_SECRET);
        //  console.log(data.user);
        req.body.id= data.user.id
        next();
        
    }catch(err){
        res.send({error : 'Internal server occurred!'})
    }
}
module.exports = loggedIn;