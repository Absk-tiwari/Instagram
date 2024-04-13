import headers from "../APIs/Headers";
const host = 'http://localhost:1901';


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