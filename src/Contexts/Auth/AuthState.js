import { useNavigate } from "react-router";
import AuthContext from "./AuthContext";
import headers from "../../APIs/Headers";

const AuthState=(props)=>{
 
    let navigator = useNavigate();
    const host = 'http://127.0.0.1:1901';

    const login = async({username, password}) =>{
        try {
            
            const resp =await fetch(`${host}/api/auth/login`,{
                method : 'POST',
                headers : headers(),
                body : JSON.stringify({username, password})
            });
            const response = await resp.json();
            if(response.status){
                // Save the auth token 
                localStorage.setItem('token', response.authToken);
                navigator('/')
            }else{
                alert(response.message)
                console.log(response)
            }

        } catch (err) {
            alert(err.message);
            console.log(err)
        }
    }

    const signup = async({name, email, username, password}) =>{
        try {
           const json = await fetch(`${host}/api/auth/signup`,{
                method : 'POST',
                headers : headers(),
                body : JSON.stringify({name, email, username, password})
            })
            const resp = await json.json();
            if(resp.status){
                navigator('/login')
            }else{
                alert(resp.message)
            }
        } catch (error) {
            console.log(error);         
        }
    }

    const getUserDetails = async() => {
        try{
            const data = await fetch(`${host}/api/auth/getuser`,{
                method:'GET',
                headers : headers()
            });
            const resp = await data.json()
            return resp;
            
        } catch (err){
            console.log(err)
        }
    }
    
    return (
    <AuthContext.Provider value={{login, signup, getUserDetails}}>
        {props.children}
    </AuthContext.Provider>
    )
}

export default AuthState