import AuthContext from "./AuthContext";
import headers from "../../APIs/Headers";

const AuthState=(props)=>{
  
    const getUserDetails = async() => {
        try{
            const data = await fetch(`${process.env.REACT_APP_SERVER_URI}/api/auth/getuser`,{
                method:'GET',
                headers : headers()
            });
            const resp = await data.json()
            return resp;
            
        } catch (err){
        }
    }
    
    return (
    <AuthContext.Provider value={{ getUserDetails}}>
        {props.children}
    </AuthContext.Provider>
    )
}

export default AuthState