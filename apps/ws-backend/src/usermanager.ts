import { WebSocket } from "ws";
import client from "db/client";
interface User{
    id:string,
    joinedRooms:string[],
    socket:WebSocket;
}


class UserManager{
    users:User[]|null=[];

    constructor()
    {
        this.users=[];
    }

   //join the room
   joinroom=async (id:string,slug:string,socket:WebSocket)=>{
     
    const room= await client.room.findUnique({
        where:{
            slug 
        }
    });
    if(!room)
    {
        socket.send(JSON.stringify({type:"error",message:"room not found"}));
        return ;
    }
    
    const user=await client.user.update({
        where:
        {id},
        data:{
             rooms:{connect:{slug}}}
       });
    
    
    

   }


   //leave the room
     removeroom=async (id:string,slug:string)=>{
     
     const room= await client.room.findUnique({
        where:{
            slug 
        }
    });
    if(!room)
    {
        return ;
    }
    
    const user=await client.user.update({
        where:
        {id},
        data:{
             rooms:{disconnect:{slug}}}
       });
    };


    activeusers=(id:string,socket:WebSocket)=>{
         const rooms=client.user.findUnique({
            where:{id},
            select:{rooms:{select:{slug:true}}}
        });
        
         const joinedRooms:string[]=(rooms as any)?.rooms.map((room:any)=>room.slug) || [];

        this.users?.push({id,joinedRooms:joinedRooms,socket});
    }

    disconnect=(id:string)=>{
        this.users=this.users?.filter(user=>user.id!==id) || [];
    }

    sendmessage=(id:string,message:string,socket:WebSocket,slug:string)=>{

        //check user is jioned the the seding message room
        const user=this.users?.find(user=>user.id===id);
        if(!user?.joinedRooms.includes(slug))
        {
            socket.send(JSON.stringify({type:"error",message:"you are not joined this room"}));
            return ;
        }
        this.users?.forEach(user=>{
            if(user.joinedRooms.includes(slug) && user.id!==id)
            {
                user.socket.send(JSON.stringify({type:"message",message}));
            }
        });
        

        const chat=client.message.create({
            data:{
                content:message,
                userid:id,
                slugid:slug
            }
        });
    }




}