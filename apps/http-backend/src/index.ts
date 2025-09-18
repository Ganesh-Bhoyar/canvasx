import express from 'express';
import client from "db/client";
import { userrouter } from './routes/user';

const app=express();
app.use(express.json());

app.use("api/v1",userrouter);


app.listen(3001,()=>{
    console.log("HTTP Backend listening on port 3000");
}   );