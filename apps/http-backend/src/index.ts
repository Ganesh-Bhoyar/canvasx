import express from 'express';
import client from "db/client";
import { userrouter } from './routes/user';
import 'dotenv/config';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();



const app=express();
app.use(express.json());
app.use(cors());

app.use("/api/v1",userrouter);

 app.get("/",(req,res)=>{
     res.status(200).json({message:"HTTP Backend is running"});
     
 });
app.listen(process.env.PORT! || 3001,()=>{
    console.log(`http Server is listening on port ${process.env.PORT || 3001}`);
}   );