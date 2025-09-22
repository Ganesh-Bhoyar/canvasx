import {WebSocketServer} from 'ws';
const jwt=require('jsonwebtoken');
import { JWT_SECRET } from 'backend-config/config';
import client from 'db/client';


 interface JWT_PAYLOAD{
    id:string;
 }
const wss =new WebSocketServer({ port: 8080 });

const verifyauth=(token:string):string=>{
    try{
        const decoded=jwt.verify(token,JWT_SECRET) as JWT_PAYLOAD;
        console.log(decoded);
        if(decoded.id){
            return decoded.id;
        }
        else
        {
            return '';
        }
    }
        catch(e){
            return '';
        }
};


wss.on('connection',(ws,request)=>{
    const url = request.url;
    if (!url) {
     return;
   }
   const queryParams = new URLSearchParams(url.split('?')[1]);
    const token = queryParams.get('token') || "";
     console.log("auth:",token);
     const userid=verifyauth(token);
     console.log("userid:",userid);
     if(!token || userid==''){
        ws.close();
        return;
     }
     else{
        ws.send( `Welcome user ${userid}!`);
     }
      


    ws.on('message',(message)=>{
        console.log(message);
    });
});