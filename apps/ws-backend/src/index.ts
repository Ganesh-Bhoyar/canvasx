import {WebSocketServer} from 'ws';
const jwt=require('jsonwebtoken');
import { JWT_SECRET } from 'backend-config/config';
import client from 'db/client';


 interface JWT_PAYLOAD{
    userid:string;
 }
const wss =new WebSocketServer({ port: 8080 });

const verifyauth=(token:string):boolean=>{
    try{
        const decoded=jwt.verify(token,JWT_SECRET) as JWT_PAYLOAD;
        if(decoded.userid){
            return true;
        }
        else
        {
            return false;
        }
    }
        catch(e){
            return false;
        }
};


wss.on('connection',(ws,request)=>{
    const url=request.url;
     if(!url){
        ws.close();
        return;
     }
     const auth = url.split("/")[1];
     if(!auth || !verifyauth(auth)){
        ws.close();
        return;
     }
     






    ws.on('message',(message)=>{
        console.log(message);
    });
});