import AuthContext from "./AuthContext";
import { useState } from "react";

const AuthState=(props)=>{

    const host = 'http://localhost:1901';

    const login = async({username, password}) =>{
        try {
            
            const resp =await fetch(`${host}/api/auth/login`,{
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify({username, password})
            });

            const data = resp.json();
            if(data.success){
                // Save the auth token 
                localStorage.setItem('token', data.authtoken);
            }else{
                alert('login Failed!')
            }
            // setfields(data);
            

        } catch (error) {
            alert(error.message);
            console.log(error)
        }
    }
    const [progress, setProgress] = useState(0)

    const signup = async({name, email, username, password}) =>{
        try {
           const json = await fetch(`${host}/api/auth/createUser`,{
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify({name, email, username, password})
            })
            console.log(json.json())
        } catch (error) {
            alert(error.message);
            console.log(error);         
        }

    }
    
    return (
    <AuthContext.Provider value={{login, signup, progress, setProgress}}>
        {props.children}
    </AuthContext.Provider>
    )
}

export default AuthState