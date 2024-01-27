import { useNavigate } from "react-router";
import AuthContext from "./AuthContext";
import headers from "../../APIs/Headers";

const AuthState=(props)=>{
 
    let navigator = useNavigate();
    const host = 'http://localhost:1901';

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
                setTimeout(() => window.location.reload(), 2500);
            }else{
                alert(response.message)
            }

        } catch (err) {
            alert(err.message);
            (err)
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
        }
    }
    
    return (
    <AuthContext.Provider value={{login, signup, getUserDetails}}>
        {props.children}
    </AuthContext.Provider>
    )
}

export default AuthState