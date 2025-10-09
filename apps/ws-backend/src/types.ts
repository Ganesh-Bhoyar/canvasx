import { WebSocket } from "ws";


interface user_active{
    type:"active",
    message:
    {
         
             }
};

interface join_room{
    type:"join_room",
    message:{
        slug:string,
         
             }
   
};

interface prev_messages{
    type:"prev_messages",
    message:{
         
         
        slug:string
    }
};

interface create_room{
    type:"create_room",
    message:{
        name:string,
         
             }
};

interface message{
    type:"message",
    message:
    {
         
         
        slug:string,
        shape:string,
        color:string,
        height:number,
        width:number,
        x:number,
        y:number
   
    }
    };
 

interface leave_room{
    type:"leave_room",
    message:{
         
         
        slug:string
    }
};

interface disconnect{
    type:"disconnect",
    message:{
         
       
    }
};


type ws_message=user_active|join_room|prev_messages|create_room|message|leave_room|disconnect;

export type {ws_message};