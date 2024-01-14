import {socket} from './socket' 
function respond() {
    socket.connect()
    socket.on('init', data =>{
        if(data){
            localStorage.setItem('connections',JSON.stringify(data))
        }
    })
    // socket.on('receive',data=>{
    //     alert('you have a message!'+data.content)
    // })
     
}

export default respond