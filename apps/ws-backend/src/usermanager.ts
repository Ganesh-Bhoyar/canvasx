import { WebSocket } from "ws";
import client from "db/client";
import slugfiy from "slugify";


interface User
{
    id:string,
    joinedRooms:string[],
    socket:WebSocket
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
    const existing=this.users?.find(user=>user.id===id);
    if(existing)
    {
        if(existing.joinedRooms.includes(slug))
        {
            socket.send(JSON.stringify({type:"error",message:"you are already joined this room"}));
            return ;
        }
    }
    const user=await client.user.update({
        where:
        {id},
        data:{
             rooms:{connect:{slug}}},
         
       });

       const acitveuser=this.users?.find(user=>user.id===id);
       if(acitveuser)
       {
           acitveuser.joinedRooms.push(slug);
           console.log("joined from web socket");
       }
       if(user && acitveuser)
      { socket.send(JSON.stringify({type:"joined_room",message:{slug}})); }
       else
       {
        socket.send(JSON.stringify({type:"error",message:"not able to join the room"}));
       }
    
    
    

   }


   //leave the room
     removeroom=async (id:string,slug:string,socket:WebSocket)=>{
     
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
       if(user)
       {
           socket.send(JSON.stringify({type:"leave_room",message:{id,slug}}));
       }
    };



     activeusers = async (id: string, socket: WebSocket) => {
           const userRooms = await client.user.findUnique({
            where: { id },
            select: {
            rooms: { select: { slug: true } },        
            adminRooms: { select: { slug: true } },  
            },
        });

        if (!userRooms) return [];

        
        const joinedRooms = [  
            ...userRooms.rooms.map(r => r.slug),
            ...userRooms.adminRooms.map(r => r.slug),
        ];
         console.log("joinedRooms array:",joinedRooms);


        this.users?.push({id,joinedRooms:joinedRooms,socket});
        console.log("users aray:",this.users);
        
    }
 updatecanvas=async(id:string,socket:WebSocket,data:any,slug:string)=>{
       const user=this.users?.find(user=>user.id===id);
        console.log(this.users);
        if(!user?.joinedRooms.includes(slug))
        {
            socket.send(JSON.stringify({type:"error",message:"you are not joined this room"}));
            return ;
        }
      
        
 
        const chat=data;
          this.users?.forEach(user=>{
            if(user.joinedRooms.includes(slug) && user.id!==id)
            {   console.log("sending update to ",user.id,slug);
                user.socket.send(JSON.stringify({type:"update",message:chat}));
                console.log(`message sent to ${user.id}`);
            }
        });
        
          
        // if(status=="end")
        // {const mess= await client.message.create({
        //     data:{
              
        //         userid:id,
        //         slugid:slug,
        //         shape,
        //         color,
        //         height,
        //         width,
        //         x,
        //         y

        //     }
        // });}

        if(chat)
        {
            socket.send(JSON.stringify({type:"message sent successfully",message:`to ${slug} group`  }));
        }
 }
    prevmessage=async(id:string,socket:WebSocket,slug:string)=>{
          const rooms= await client.user.findUnique({
            where:{id},
            select:{rooms:{select:{slug:true}}}
        });
        console.log(rooms);
        console.log(rooms?.rooms);
        console.log(slug)



       if (rooms?.rooms.some((room:any)=>room.slug===slug))
        {
            const chat=await client.message.findMany({
                where:{
                    
                 slugid:slug
                }
            });
            if(chat)
            {
                socket.send(JSON.stringify({type:"prev_messages",message:chat}));
            }
            else
            {
                socket.send(JSON.stringify({type:"prev_messages",message:[]}));
            }
        }
        else
        {
            socket.send(JSON.stringify({type:"invalid access",message:"jydya hoshiyar mat ban"})); 
        }
  
    }

    disconnect=(id:string)=>{
        this.users=this.users?.filter(user=>user.id!==id) || [];
    }

    sendmessage=async(id:string,shape:string,color:string,height:number,width:number,x:number,y:number,socket:WebSocket,slug:string,status:string)=>{

        //check user is jioned the the seding message room
        const user=this.users?.find(user=>user.id===id);
        console.log(this.users);
        if(!user?.joinedRooms.includes(slug))
        {
            socket.send(JSON.stringify({type:"error",message:"you are not joined this room"}));
            return ;
        }
      
        

        // const chat= await client.message.create({
        //     data:{
              
        //         userid:id,
        //         slugid:slug,
        //         shape,
        //         color,
        //         height,
        //         width,
        //         x,
        //         y

        //     }
        // });
        const chat={userid:id,slugid:slug,shape,color,height,width,x,y,status};
          this.users?.forEach(user=>{
            if(user.joinedRooms.includes(slug) && user.id!==id)
            {
                user.socket.send(JSON.stringify({type:"message",message:chat}));
                console.log(`message sent to ${user.id}`);
            }
        });
        
          
        if(status=="end")
        {const mess= await client.message.create({
            data:{
              
                userid:id,
                slugid:slug,
                shape,
                color,
                height,
                width,
                x,
                y

            }
        });}

        if(chat)
        {
            socket.send(JSON.stringify({type:"message sent successfully",message:`to ${slug} group`  }));
        }
    }


    createroom = async (name:string,socket:WebSocket,id:string)=>{
         const room= await client.room.create({
            data:{
                name,
                adminId:id,
                slug:slugfiy(name)
            }
        });

        if(room)
        {
            socket.send(JSON.stringify({type:"room_created",message:room.slug}));
        }
    }


}

export default UserManager; 