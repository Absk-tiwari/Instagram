const connection=require('./db');
const express=require('express');
const cors = require('cors');
const io = require('socket.io')
const Message = require('./Models/Message')
connection();
const app=express();
app.use(cors())
const port=1901;

//io.on('connection' , socket=>console.log(socket.id))

app.use(express.json());
app.use('/api/auth', require('./Routes/Auth'));
app.use('/api/post', require('./Routes/Post'));
app.use('/api/stories', require('./Routes/Stories'));
app.use('/api/reels', require('./Routes/Reels'));
app.use('/api/profile', require('./Routes/Profiles'));
app.use('/api/messages', require('./Routes/message'));

app.get('/',(req,res)=> res.send('Hello abhishek!'));

const server = app.listen(port);
const socket = io(server,{cors:'http://localhost:3306'})

let users = new Map();
socket.use((req,next)=>{
  const handshakeData = req.request
  const username = handshakeData._query.username
  if(username){
    // console.log(username);
    socket.username = username
    return next()
  }
  return next(new Error('Username missing'))
})
socket.on('connection', conn => {
      
      if (conn.recovered) {
        // recovery was successful: socket.id, socket.rooms and socket.data were restored
        console.log('recovered id is '+ conn.id)
      } else {
        // new or unrecoverable session
         users.set(socket.username, conn.id)
         const myObject = Object.fromEntries(users);
         socket.emit('init',  [myObject] )
         console.log(users)
      }

      conn.on('send', async(data) => {
        console.log('message by '+socket.username ,data)
        let target = data.to 
        target = users.get(target)
        let dataobj = {from: socket.username, content:data.content, at:Date.now(), read:false}
        
        if(target){
          socket.to(target).emit('receive', dataobj )
        }
        if(data.to){
          let saved = await Message.create({
            from: socket.username,
            to : data.to,
            content : data.content,
            connectionID : data.cID
          })
          let notify = {content:'1 new message'}
          if(saved && target){
            notify.confirmation = 'Message is saved'
            socket.to(target).emit('notification',notify)
          }
        }
      })
    
    conn.on('disconnect',(s)=>{
      users.delete(socket.username)
      console.log('disconnected...'+s)
      console.log(users)
    })
    socket.on('reconnect', (attemptNumber) => {
        console.log(`User reconnected (${attemptNumber} attempts):`, conn.id);
    });
})

