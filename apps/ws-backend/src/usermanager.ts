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
   private updateIntervals = new Map<string, NodeJS.Timeout>();
  private inactivityTimeouts = new Map<string, NodeJS.Timeout>();
  private lastUpdateTimestamps = new Map<string, number>();



  startPeriodicDatabaseUpdate(id: string, socket: WebSocket, data: any, slug: string) {
    if (this.updateIntervals.has(slug)) return; // Already running for this slug

    const updateIntervalId = setInterval(() => {
      console.log("update sent to all users in", slug);
      this.updatedatabase(id, socket, data, slug);
    }, 1000);

    this.updateIntervals.set(slug, updateIntervalId);
    this.startInactivityChecker(slug);
  }

  startInactivityChecker(slug: string) {
    if (this.inactivityTimeouts.has(slug)) return;

    const inactivityTimeoutId = setInterval(() => {
      const now = Date.now();
      const lastUpdate = this.lastUpdateTimestamps.get(slug) || 0;
      if (now - lastUpdate > 20000) { // 20 seconds inactivity
        console.log(`No updatecanvas call for 20 seconds in room ${slug}, stopping interval`);
        this.stopPeriodicDatabaseUpdate(slug);
        this.stopInactivityChecker(slug);
      }
    }, 5000);

    this.inactivityTimeouts.set(slug, inactivityTimeoutId);
  }

  stopPeriodicDatabaseUpdate(slug: string) {
    const intervalId = this.updateIntervals.get(slug);
    if (intervalId) {
      clearInterval(intervalId);
      this.updateIntervals.delete(slug);
    }
  }

  stopInactivityChecker(slug: string) {
    const timeoutId = this.inactivityTimeouts.get(slug);
    if (timeoutId) {
      clearInterval(timeoutId);
      this.inactivityTimeouts.delete(slug);
    }
  }

   //join the room
   joinroom=async (id:string,slug:string,socket:WebSocket)=>{
     
    // const room= await client.room.findUnique({
    //     where:{
    //         slug 
    //     }
    // });
    // if(!room)
    // {
    //     socket.send(JSON.stringify({type:"error",message:"room not found"}));
    //     return ;
    // }
    // const existing=this.users?.find(user=>user.id===id);
    // if(existing)
    // {
    //     if(existing.joinedRooms.includes(slug))
    //     {
    //         socket.send(JSON.stringify({type:"error",message:"you are already joined this room"}));
    //         return ;
    //     }
    // }
    // const user=await client.user.update({
    //     where:
    //     {id},
    //     data:{
    //          rooms:{connect:{slug}}},
         
    //    });

    //    const acitveuser=this.users?.find(user=>user.id===id);
    //    if(acitveuser)
    //    {
    //        acitveuser.joinedRooms.push(slug);
    //        console.log("joined from web socket");
    //    }
    //    if(user && acitveuser)
    //   { socket.send(JSON.stringify({type:"joined_room",message:{slug}})); }
    //    else
    //    {
    //     socket.send(JSON.stringify({type:"error",message:"not able to join the room"}));
    //    }
    
    
    

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
            name: true,
            email: true,
            rooms: { select: { slug: true,name:true,createdAt:true,members:true,messages:true,desc:true } },
            adminRooms: { select: { slug: true,name:true,createdAt:true,members:true,messages:true,desc:true } },
            },
        });

        if (!userRooms) return [];

        
        const joinedRooms = [ 
            ...userRooms.rooms.map(r => r.slug),
            ...userRooms.adminRooms.map(r => r.slug),
        ];
        
        const sendjoinedRooms:{slug:string,owner:boolean,name:string,creattedat:Date,toalmembers:number,totalmessages:number,description:string}[]=[
            ...userRooms.rooms.map(r => {   return {name:r.name,owner:false,slug:r.slug,creattedat:r.createdAt,toalmembers:r.members.length+1,totalmessages:r.messages.length,description:r.desc}}),
            ...userRooms.adminRooms.map(r => {   return {name:r.name,owner:true,slug:r.slug,creattedat:r.createdAt,toalmembers:r.members.length+1,totalmessages:r.messages.length,description:r.desc}}),
        ];

        
         console.log("joinedRooms array:",joinedRooms);


        this.users?.push({id,joinedRooms:joinedRooms,socket});
        console.log("users aray:",this.users);
        socket.send(JSON.stringify({type:"actived_user",message:{name:userRooms.name,email:userRooms.email,activeRooms:sendjoinedRooms}} ) );
        
    }
    updatecanvas=async(id:string,socket:WebSocket,data:any,slug:string)=>{
       console.log("updatecanvas called");
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

        this.startPeriodicDatabaseUpdate(id, socket, data, slug);
        
          
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

   updatedatabase=async(id:string,socket:WebSocket,data:any,slug:string)=>{
    console.log("update_database called");
       const user=this.users?.find(user=>user.id===id);
        console.log(this.users);
        if(!user?.joinedRooms.includes(slug))
        {
            socket.send(JSON.stringify({type:"error",message:"you are not joined this room"}));
            return ;
        }

        const message=await client.message.upsert({
            where:{
                slugid:slug
            },
            update:{
                canvasJson:data
            },
            create:{  
                canvasJson:data,
                slugid:slug,
                userid:id,
            }
        });
        console.log(message);
        if(message)
        {  console.log("database updated successfully");
            socket.send(JSON.stringify({type:"daatabase updated successfully",message:`to ${slug} group`  }));
        }


        
   }
    prevmessage=async(id:string,socket:WebSocket,slug:string)=>{
        console.log("prev message called");
          const rooms= await client.user.findUnique({
            where:{id},
            select:{rooms:{select:{slug:true}},
                 adminRooms:{select:{slug:true}}}
        });
        console.log(rooms);
       const roomsarray = [
        ...(rooms?.rooms ?? []),
        ...(rooms?.adminRooms ?? [])
        ];
        console.log(roomsarray);
        
        console.log(slug)



       if ( roomsarray?.some((room:any)=>room.slug===slug))
        {
            const chat=await client.message.findUnique({
                where:{
                    
                 slugid:slug
                }
            });
            if(chat)
            {   console.log("sending prev message to ",slug,"message:",chat.canvasJson);
                socket.send(JSON.stringify({type:"update",message:chat.canvasJson}));
            }
            else
            {
                socket.send(JSON.stringify({type:"update",message:null}));
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

        // //check user is jioned the the seding message room
        // const user=this.users?.find(user=>user.id===id);
        // console.log(this.users);
        // if(!user?.joinedRooms.includes(slug))
        // {
        //     socket.send(JSON.stringify({type:"error",message:"you are not joined this room"}));
        //     return ;
        // }
      
        

        // // const chat= await client.message.create({
        // //     data:{
              
        // //         userid:id,
        // //         slugid:slug,
        // //         shape,
        // //         color,
        // //         height,
        // //         width,
        // //         x,
        // //         y

        // //     }
        // // });
        // const chat={userid:id,slugid:slug,shape,color,height,width,x,y,status};
        //   this.users?.forEach(user=>{
        //     if(user.joinedRooms.includes(slug) && user.id!==id)
        //     {
        //         user.socket.send(JSON.stringify({type:"message",message:chat}));
        //         console.log(`message sent to ${user.id}`);
        //     }
        // });
        
          
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

        // if(chat)
        // {
        //     socket.send(JSON.stringify({type:"message sent successfully",message:`to ${slug} group`  }));
        // }
    }


    createroom = async (name:string,socket:WebSocket,id:string)=>{
    //      const room= await client.room.create({
    //         data:{
    //             name,
    //             adminId:id,
    //             slug:slugfiy(name)
    //         }
    //     });

    //     if(room)
    //     {
    //         socket.send(JSON.stringify({type:"room_created",message:room.slug}));
    //     }
     }


}

export default UserManager; 