import { io } from 'socket.io-client';
import headers from './APIs/Headers'
// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ? undefined : 'https://instagram-api-one.vercel.app';
 const userdata = await fetch('https://instagram-api-one.vercel.app/api/auth/getuser',{
    method:'GET',
    headers: headers(),
	mode:'no-cors'
});

const data = await userdata.json();
localStorage.setItem('userLogin',JSON.stringify(data));
const username = data.username ?? '';
export const socket = io(URL, {
    maxHttpBufferSize:1e8,
    autoConnect: false,
    query: {username}
});