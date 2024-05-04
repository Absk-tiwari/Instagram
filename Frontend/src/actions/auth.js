import headers from "../APIs/Headers";
const host = process.env.REACT_APP_SERVER_URI || "https://instagram-vquy.onrender.com";


export const getUserDetails = async() => {
	if(localStorage.getItem('token')===null) return null
	try{
		let resp = await fetch(`${host}/api/auth/getuser`,{
			method:'GET',
			headers : headers()
		})  
		return await resp.json();
	} catch (err){
		console.log(err);
	}
}
 