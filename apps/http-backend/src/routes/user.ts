import {Router} from 'express';
import client ,{Prisma} from 'db/client';
 
 const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
import {auth} from '../middlewares/usermiddleware';
import slugfiy from 'slugify';
import { JWT_SECRET } from 'backend-config/config';
import { userSchema ,siginShema,roomSchema} from 'common/types';
 

const userrouter:Router=Router();



userrouter.post("/signup",async (req,res)=>{
    const parsed=userSchema.safeParse(req.body);
    if(!parsed.success)
    {  res.json({message:"Invalid data"});
        return ;
    }
    const {name,email,password}=parsed.data;
    const user= await client.user.create({
        data:{
            name,
            email,
            password:await bcrypt.hash(password,10)
        }

    })
    if(user)
    {
        res.status(200).json({message:"User created successfully"});

    }
    else
    {
        res.status(500).json({message:"Error creating user"});
    }
});

userrouter.post("/signin",async (req,res)=>{
    const parsed=siginShema.safeParse(req.body);
    if(!parsed.success)
    {   res.json({message:"Invalid data"});
        return ;
    }
    const {email,password}=parsed.data;
    const user= await client.user.findUnique({
        where:{
            email:email as string
        }
    })
    if(user && await bcrypt.compare(password,user.password))
    {   const token=jwt.sign({id:user.id},JWT_SECRET);
        res.status(200).json({message:"User signed in successfully",token});
    }
    else
    {
        res.status(401).json({message:"Invalid email or password"});
    }
});

userrouter.post("/createroom",auth,async (req,res)=>{
    console.log("Received room creation request with body:", req.body);
    const parsed=roomSchema.safeParse(req.body);
    console.log("Parsed data:", parsed);
    if(!parsed.success)
    {   res.json({message:"Invalid data"});
        return ;
    }
    const {name,desc}=parsed.data;
    console.log("Parsed room data:", { name: name, desc: desc });
    const userid=(req as any).id;

    

try    {
    const room = await client.room.create({
        data:{
            name,
            desc,
            adminId:userid,
            slug:slugfiy(name,{lower:true,strict:true})
        }
    });
    if(room)
    {  console.log("Room created successfully:", room);
        res.status(200).json({type:"hit_create",message:"Room created successfully"});
    }
    
    
}
catch(e){
    res.status(500).json({message:"Error creating room"});
}
});


userrouter.post("/rooms",async (req,res)=>{
     const {query}=req.body;
    const rooms= await client.room.findMany({
        where:{
            name:{
                contains:query,
                mode:'insensitive'
            }
        }

         
    });
    res.status(200).json({rooms});
});

userrouter.post("/requesttojoin",auth,async (req,res)=>{
    const slug=req.body.slug;
    if(!slug)
    {   res.json({message:"Invalid data"});
        return ;
    }
    
    const userid=(req as any).id;
    const user=await client.user.findUnique({
        where:{
            id:userid
        }
    });
 
     const room=await client.room.findUnique({
        where:{
            slug:slug},
            select:{
                adminId:true,
                name:true,
            }
        });
    if(!room) return ;
    const request=await client.user.findUnique({
        where:{
            id:room.adminId
        },
        select:{
            requests:true
        }
    });
   console.log("Existing requests:", request?.requests);
    if(request?.requests.some((r:any)=>r.slug===slug && r.id===userid))
    {
        res.status(200).json({success:true,message:"Request already sent"});
        return ;
    }

    if(user && room)
    {
        await client.user.update({
        where: { id: room.adminId },
        data: {
            requests: {
            push: {
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                id: user.id,
                slug: slug,
                timestamp: Date.now(),
                roomName:room.name
            }
            }
        }
        });
        res.status(200).json({success:true,message:"Request sent successfully"});

    }
});
 

userrouter.get("/profiledetaiis",auth,async (req,res)=>{
    const userid=(req as any).id;
    const user=await client.user.findUnique({
        where:{
            id:userid
        }
        ,select:{
        rooms:true,
        adminRooms:true,
        name:true,
        email:true,
        avatar:true,
        requests:true
        }
    });
    if(user)
    {
        res.status(200).json({user});
    }
    else
    {
        res.status(404).json({message:"User not found"});
    }
});
userrouter.post("/approverequest", auth, async (req, res) => {
  const { emailToRemove,apporove ,slug} = req.body;
  const userId = (req as any).id;

  const admin = await client.user.findUnique({
    where: { id: userId },
  });

  if (!admin) return res.status(404).send("Admin not found");

   
  const cleaned = admin.requests.filter(
    (r: any): r is Record<string, any> => r != null
  );

   
  const updatedRequests = cleaned.filter(
    (r: any) => r.email !== emailToRemove
  );

   
  await client.user.update({
    where: { id: userId },
    data: {
      requests: {
        set: updatedRequests as Prisma.InputJsonValue[],
      },
    },
  });

  res.send({ type: "hit_requests", message: "Request removed" });


  if(apporove){
    const user = await client.user.findUnique({
      where: { email: emailToRemove },
    });
    if (!user) return res.status(404).send("User not found");
    
    await client.user.update({
      where: { email: emailToRemove },
      data: {
        rooms: {
          connect: { slug: slug },
        },
      },
     });
   
     
      res.send({ success: true, message: "Request approved" });
  }
});
 


  







export {userrouter};
        