import headers from "../APIs/Headers";
const host = "https://instagram-vquy.onrender.com";


const getUserDetails = async() => {
	try{
		let resp;
		await fetch(`${host}/api/auth/getuser`,{
			method:'GET',
			headers : headers()
		}).then(res=>res.json())
		.then(data=>{
			resp = data
		}) 
		return resp;
		
	} catch (err){
		console.log(err);
	}
}
export {getUserDetails}