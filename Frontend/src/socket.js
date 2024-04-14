import { io } from 'socket.io-client';
import headers from './APIs/Headers'
// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.REACT_APP_LOCAL_SERVER || 'https://instagram-vquy.onrender.com';
console.log(URL)
 const userdata = await fetch(`${URL}/api/auth/getuser`,{
    method:'GET',
    headers: headers()
});

const data = await userdata.json();
localStorage.setItem('userLogin',JSON.stringify(data));
const username = data.username ?? '';
export const socket = io(URL, {
    maxHttpBufferSize:1e8,
    autoConnect: false,
    query: {username}
});