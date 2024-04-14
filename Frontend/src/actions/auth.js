import headers from "../APIs/Headers";
const host = 'https://instagram-vquy.onrender.com';


const getUserDetails = async() => {
	try{
		const data = await fetch(`${host}/api/auth/getuser`,{
			method:'GET',
			headers : headers(),
			mode:'no-cors'
		});
		const resp = await data.json();
		return resp;
		
	} catch (err){
	}
}
export {getUserDetails}