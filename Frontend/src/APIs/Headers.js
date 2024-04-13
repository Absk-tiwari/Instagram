const headers = () => {
 
    const token = localStorage.getItem('token');
    if(token){
        return {
            'Content-Type' : 'application/json',
            'auth-token': token
        }
    }else{
        return {
            'Content-Type' : 'application/json'
        }
    }
}

module.exports = headers