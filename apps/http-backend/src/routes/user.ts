import {Router} from 'express';
import client from 'db/client';
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
    const parsed=roomSchema.safeParse(req.body);
    if(!parsed.success)
    {   res.json({message:"Invalid data"});
        return ;
    }
    const {name}=parsed.data;
    const userid=(req as any).id;

    

try    {
    const room = await client.room.create({
        data:{
            name,
            adminId:userid,
            slug:slugfiy(name,{lower:true,strict:true})
        }
    });
    if(room)
    {
        res.status(200).json({message:"Room created successfully"});
    }
    
}
catch(e){
    res.status(500).json({message:"Error creating room"});
}
});

export {userrouter};
        