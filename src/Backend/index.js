const connection=require('./db');
const express=require('express');
const cors = require('cors');
const io = require('socket.io')
const Message = require('./Models/Message')
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
const socket = io(server,{cors:'http://192.168.119.154:3306'})

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
        console.log('recovered id is '+ conn.id)
      } else {
        // new or unrecoverable session
         users.set(socket.username, conn.id)
         const myObject = Object.keys(Object.fromEntries(users));
         socket.emit('init',  [myObject] )
         console.log(users);
      }

      conn.on('send', async(data) => {
        console.log('By '+data.from+' to '+data.to)
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

      conn.on('notify', async(data) => {
        let obj ={}
        if(data.type){
          switch (data.type) {
            case 'follow':
                obj.label = `<img src='${data.icon}' class='pfpicture' />`
                obj.message = `<b>${data.user}</b> started following you` 
              break;
            case 'like': 
                obj.icon = `<img src='${data.icon}' class='rounded-circle col-md-2' />` 
                obj.message = `<b>${data.user}</b> liked your post` 
              break;
            case 'follow-request':
                obj.icon = `<img src='${data.icon}' class='pfpicture' />` 
                obj.message = `<b>${data.user}</b> has requested to follow you` 
              break;
          }
          obj.read = false
        }
        console.log(data.for, users.get(data.for) , users)
        let target = users.get(data.for)
        if(target){
          console.log(data.for, target)
            socket.to(target).emit('notification', obj)
        }
        await Notification.create({
          label: data.icon,
          for: data.for,
          message: obj.message 
        });

      })
    
    conn.on('disconnect',(s)=>{
      users.delete(socket.username)
      console.log('disconnected...'+s)
      console.log(users)
    })
    socket.on('reconnect', (attemptNumber) => {
        console.log(`User reconnected (${attemptNumber} attempts):`, conn.id);
    });port


})

