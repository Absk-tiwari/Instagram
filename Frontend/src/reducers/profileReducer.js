import axios from "axios"
import { toast } from "../toast"
import { socket } from "../socket"
let me = JSON.parse(localStorage.getItem('userLogin'))

const initialState = {
    react:false
}

const profileReducer = (state=initialState, action)=>
{
    switch (action.type) {
        case 'ACCOUNT_ACTIVITY': 
            console.log(`caught`);
            let {type, targetUsername, pfp} = action.payload
            let bool = type
            type = type ? 'follow' : 'unfollow'
            axios.post(`post/update`, {type,targetUsername})
            .then(resp=>{
            if(resp.status){
                let data={
                    type: 'follow',
                    for: targetUsername,
                    icon: pfp,
                    user : me.username ,
                    about:me.username,
                    message : `<b>${me.username}</b> started following you` 
                } 
                if(type === 'follow')
                {
                    toast(`following `+data.for)
                    if(data.user!==data.for)
                    {
                        socket.emit('notify',data)
                    }
                }else{
                    toast(`unfollowed `+data.for)
                    socket.emit('remNotified', data)
                }
            } 
            })
            return {
                ...state,
                react:bool  
            }
    
        default: return state 
    }
}

export default profileReducer