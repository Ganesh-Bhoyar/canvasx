import { JWT_SECRET } from 'backend-config/config';
import {Request,Response,NextFunction} from 'express';
const jwt=require('jsonwebtoken');
 

export const auth=async (req:Request,res:Response,next:NextFunction)=>{
    const token=req.headers.authorization;
    if(token)
    {
        try
        {
            const decoded=jwt.verify(token, JWT_SECRET);
            (req as any).id=decoded.id;
            next();
        }
        catch(e)
        {
            res.status(401).json({message:"Invalid token"});
        }
    }
}