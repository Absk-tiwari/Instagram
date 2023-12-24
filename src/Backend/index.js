const connection=require('./db');
const express=require('express');
const cors = require('cors');
connection();
const app=express();
app.use(cors())
const port=1901;

app.use(express.json());
app.use('/api/auth', require('./Routes/Auth'));
app.use('/api/stories', require('./Routes/Stories'));
app.use('/api/reels', require('./Routes/Reels'));
app.use('/api/profile', require('./Routes/Profiles'));

app.get('/',(req,res)=>{
    res.send('Hello abhishek!');
});

app.listen(port);

