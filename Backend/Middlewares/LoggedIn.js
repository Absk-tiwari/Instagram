const jwt = require('jsonwebtoken');
const JWT_SECRET = 'whateverItWas';

const loggedIn= (req, res , next)=> {
    try{
        const token = req.header('auth-token'); 
        if(!token){
            return res.status(401).send({error: 'Please authenticate using correct token'})
        }
        const data = jwt.verify(token, JWT_SECRET);
        req.body.id= data.user.id
        next();
        
    }catch(err){
        return res.end({error : 'Action denied auth-token not correct or is unavailable!'})
    }
}
module.exports = loggedIn;