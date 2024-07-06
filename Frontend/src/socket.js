import { io } from 'socket.io-client';
import headers from './APIs/Headers'
// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.REACT_APP_SERVER_URI || 'https://instagram-vquy.onrender.com';
let config = {
	maxHttpBufferSize:1e8,
	autoConnect: false,
}
const init = async() => {
	let previous;
	if(previous = localStorage.getItem('userLogin'))
	{
		return JSON.parse(previous)
	}
	const userdata = await fetch(`${URL}/api/auth/getuser`,{
		method:'GET',
		headers: headers()
	});
	return await userdata.json(); 
}
if(localStorage.getItem(`token`)){
	const data = await init()
	localStorage.setItem('userLogin',JSON.stringify(data));
	const username = data.username ?? '';
	config.query= {username}
}  
export {init}
export const socket = io(URL, config);