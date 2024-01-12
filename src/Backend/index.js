const connection=require('./db');
const express=require('express');
const cors = require('cors');
const io = require('socket.io')
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

app.get('/',(req,res)=> res.send('Hello abhishek!'));

const server = app.listen(port);
const socket = io(server,{cors:'*'})

socket.on('connection', conn => {
    console.log('New connection id is '+ conn.id)
})

