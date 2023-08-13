const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRouter = require('./routes/userRoutes')
// const adminRouter = require('./routes/adminRouter')
const path = require('path')
const mongoose = require('mongoose')

const app = express();

app.enable('trust proxy')
app.use(bodyParser());
app.use(express.static(path.join(__dirname,"public")))
app.use(cors());
app.options('*',cors());

let DB = `mongodb+srv://socialmedia:<password>@cluster0.dz5c9ue.mongodb.net/socialmedia?retryWrites=true&w=majority`
password = 'KingBaglool'
// let DB = `mongodb+srv://scam:<password>@cluster0.hpiqu3n.mongodb.net/scam?retryWrites=true&w=majority`;
// const password = 'Y3vLyYqImrqHBorK';
// Y3vLyYqImrqHBorK
// scam

DB = DB.replace('<password>',password)

// mongoose.connect(DB, {
//     serverSelectionTimeoutMS: 60000, // 60 seconds
//   }).then(()=>{
//     console.log('Connection Successfull')
// });

mongoose.connect(DB,{}).then(()=>{
    console.log('Connection Successfull')
})

app.use('/api/v1/user', userRouter)
// app.use('/api/v1/admin', adminRouter)

const PORT = 4000;
app.listen(4000,()=>{
    console.log('Server is Runing')
})