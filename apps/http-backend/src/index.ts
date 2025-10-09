import express from 'express';
import client from "db/client";
import { userrouter } from './routes/user';
import 'dotenv/config';
import cors from 'cors';



const app=express();
app.use(express.json());
app.use(cors());

app.use("/api/v1",userrouter);

 app.get("/",(req,res)=>{
     res.status(200).json({message:"HTTP Backend is running"});
     
 });
app.listen(3001,()=>{
    console.log("HTTP Backend listening on port 3001");
}   );