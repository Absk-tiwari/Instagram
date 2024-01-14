import { io } from 'socket.io-client';
import headers from './APIs/Headers'
// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:1901';
 const userdata = await fetch('http://localhost:1901/api/auth/getuser',{
    method:'GET',
    headers: headers()
});

const data = await userdata.json()
localStorage.setItem('userLogin',JSON.stringify(data))
const username = data.username ?? ''
export const socket = io(URL, {
    autoConnect: false,
    query: {username}
});