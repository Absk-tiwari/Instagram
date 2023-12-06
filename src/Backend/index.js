const connection=require('./db');
const express=require('express');
const cors = require('cors');
connection();
const app=express();
app.use(cors())
const port=1901;

app.use(express.json());
app.use('/api/auth', require('./Routes/Auth'));

app.get('/',(req,res)=>{
    res.send('Hello!');
});

app.listen(port);

