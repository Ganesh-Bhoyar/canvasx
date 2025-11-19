import {WebSocketServer} from 'ws';
const jwt=require('jsonwebtoken');
import { JWT_SECRET } from 'backend-config/config';
import client from 'db/client';
import {ws_message} from './types';
import UserManager from './usermanager';
import dotenv from 'dotenv';
dotenv.config();


 interface JWT_PAYLOAD{
    id:string;
 }
const wss =new WebSocketServer({ port: (process.env.PORT! as unknown as number) || 8080 });
 const userManager=new UserManager();

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
     //console.log("auth:",token);
     const userid=verifyauth(token);
     console.log("userid:",userid);
     if(!token || userid==''){
        ws.close();
        return;
     }
     else{
        ws.send(JSON.stringify({type:"connection",message:{message:"Connected to WebSocket server"}}));
     }

    
      


    ws.on('message',(msg )=>{
        let message : ws_message = JSON.parse(msg.toString());
        if(message.type==="join_room")
        {
            const {slug}=message.message;
            userManager.joinroom(userid,slug,ws);
        }

        else if(message.type==="prev_messages")
        {
            const {slug }=message.message;
            userManager.prevmessage(userid,ws,slug);
        }

        else if(message.type==="create_room")
        {
            const {name }=message.message;
            userManager.createroom(name,ws,userid);
        }
        else if(message.type=="update")
        {
           userManager.updatecanvas(userid,ws,message.message.data,message.message.slug); 
        }
        else if(message.type==="message")
        {
            const {slug ,shape,color,height,width,x,y,status}=message.message;
            userManager.sendmessage(userid,shape,color,height,width,x,y,ws,slug,status);
        }

        else if(message.type==="leave_room")
        {
            const {slug}=message.message;
            userManager.removeroom(userid,slug,ws);
        }
        else if(message.type==="active")
        {
            const {}=message.message;
            userManager.activeusers(userid,ws);
        }
        else if(message.type==="update_database")
        {
            const {slug,data}=message.message;
            userManager.updatedatabase(userid,ws,data,slug);
        }
        else if(message.type==="disconnect")
        {
            const {}=message.message;
            userManager.disconnect(userid);
        }
    });
});