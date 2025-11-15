import { WebSocket } from "ws";


interface user_active{
    type:"active",
    message:
    {
         
             }
};
interface update
{
    type:"update",
     message:{
         data:any,
         slug:string
       
    }
}
interface join_room{
    type:"join_room",
    message:{
        slug:string,
         
             }
   
};

interface update_database{
    type:"update_database",
    message:{
        slug:string,
        data:any
       
    }
}

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
        y:number,
        status:string
   
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


type ws_message=user_active|join_room|prev_messages|create_room|message|leave_room|disconnect|update|update_database;

export type {ws_message};