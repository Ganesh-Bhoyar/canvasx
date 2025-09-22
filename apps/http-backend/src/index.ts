import express from 'express';
import client from "db/client";
import { userrouter } from './routes/user';
import 'dotenv/config';



const app=express();
app.use(express.json());

app.use("/api/v1",userrouter);

 app.get("/",(req,res)=>{
     res.status(200).json({message:"HTTP Backend is running"});
     
 });
app.listen(3001,()=>{
    console.log("HTTP Backend listening on port 3001");
}   );