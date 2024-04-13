import headers from "../APIs/Headers";
const host = 'https://instagram-api-one.vercel.app';


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
export {getUserDetails}