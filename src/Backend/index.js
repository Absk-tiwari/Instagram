const connection=require('./db');
const express=require('express');
const cors = require('cors');
const io = require('socket.io')
const Message = require('./Models/Message')
const User=require('./Models/User');
const Notification = require('./Models/Notification')
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
app.use('/api/notifications', require('./Routes/notifiy'));

app.get('/',(req,res)=> res.send('Hello abhishek!'));

const server = app.listen(port);
const socket = io(server,{cors:'http://localhost:3306'})

let users = new Map();
socket.use((req,next)=>{
  const handshakeData = req.request
  const username = handshakeData._query.username
  if(username){
    socket.username = username
    return next()
  }
  return next(new Error('Username missing'))
})
socket.on('connection', conn => {
      
      if (conn.recovered) {
        // recovery was successful: socket.id, socket.rooms and socket.data were restored
      } else {
        // new or unrecoverable session
         users.set(socket.username, conn.id)
         const myObject = Object.keys(Object.fromEntries(users));
         socket.emit('init', myObject)
         console.log('connected users -',myObject)
      }

      conn.on('users',()=>{ 
        socket.emit('init',Object.keys(Object.fromEntries(users)))
      })
      conn.on('send', async(data) => {
        let target = data.to 
        target = users.get(target)
        let dataobj = {from: data.from, content:data.content, at:Date.now(), read:false}
        
        if(target){
          socket.to(target).emit('receive', dataobj )
        }
        if(data.to){
          let saved = await Message.create({
            from: data.from,
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

      conn.on('typing',data=>{
        socket.to(users.get(data.to)).emit('isTyping',data.is)
      })

      conn.on('stopped', data => {
        socket.to(users.get(data.to)).emit('hasStopped',data.is)
      })

      conn.on('notify', async(data) => {
        let obj ={}
        if(data.type){
          switch (data.type) {
            case 'follow':{ obj.message = `<b>${data.user}</b> started following you` ;}
              break;
            case 'like':{ obj.message = `<b>${data.user}</b> liked your post`;}
              break;
            case 'follow-request':{ obj.message = `<b>${data.user}</b> has requested to follow you`; }
              break;
          }
          obj.read = false
        } 
        let target = users.get(data.for)
        
        if(data.user){
          if(data.type==='follow')
          {
            let sender = await User.findOne({username:data.user}).select('profile -_id')          
            obj.label = sender.profile
          }else{
            obj.label = data.label
          }
          await Notification.create({
            label: obj.label,
            type: data.type,
            for: data.for,
            from:data.user,
            message: obj.message,  
            about: data.about,  
          });
          obj.about = data.about
          if(target) {
            socket.to(target).emit('notification', obj)
          }
        }
      })

      conn.on('remNotified', async(data)=>{
        let set={}
        if(data.type){
          if(data.type==='follow'){
            set.type= 'follow'
            set.about = data.user
            set.for = data.for
          }
          if(data.type==='like'){
            set.type = 'like'
            set.about = data.about
            set.for = data.for
          }
          let done = await Notification.deleteOne(set);
          if(!done){
            socket.to(users.get(data.user)).emit('error','couldnt remove the notification')
          }else{
            socket.to(users.get(data.for)).emit('unnotify',data)
          }  
        }
      })
    
    conn.on('disconnect',()=>{
      users.delete(socket.username)
     })
    socket.on('reconnect', (attemptNumber) => {
    });


})

