import headers from "../APIs/Headers";
const host = process.env.REACT_APP_SERVER_URI || "https://instagram-vquy.onrender.com";


const getUserDetails = async() => {
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
export {getUserDetails}