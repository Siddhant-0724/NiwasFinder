import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userrouter from './routes/userroute.js'
import authrouter from './routes/authroute.js'
import listingroute from './routes/listingroute.js'
import cookieParser from 'cookie-parser'
import path from 'path'
dotenv.config();

// Database Connection
mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log('connected to MongoDB');
})
.catch((err)=>{
    console.log(err)
})

const __dirname = path.resolve()

const app = express();

app.use(express.json());
app.use(cookieParser());

//server connnection
app.listen(3000,()=>{
    console.log("server is runing on port 3000")
})

//routes
app.use("/server/user",userrouter)
app.use("/server/auth",authrouter)
app.use("/server/listing",listingroute)

app.use(express.static(path.join(__dirname,'/client/dist')));

app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,'client','dist','index.html'))
})

app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error'
    return res.status(statusCode).json({
        success:false,
        statusCode,
        message
    });
});