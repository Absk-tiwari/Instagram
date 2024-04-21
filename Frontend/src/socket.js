import { io } from 'socket.io-client';
import headers from './APIs/Headers'
// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.REACT_APP_SERVER_URI || 'https://instagram-vquy.onrender.com';
let config = {
	maxHttpBufferSize:1e8,
	autoConnect: false,
}
if(localStorage.getItem(`token`)){
	const userdata = await fetch(`${URL}/api/auth/getuser`,{
		method:'GET',
		headers: headers()
	});
	const data = await userdata.json(); 
	localStorage.setItem('userLogin',JSON.stringify(data));
	const username = data.username ?? '';
	config.query= {username}
}  

export const socket = io(URL, config);