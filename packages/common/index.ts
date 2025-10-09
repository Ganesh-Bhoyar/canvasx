import {email, z} from "zod";
import { WebSocket }  from "ws";


export const userSchema = z.object({
    name : z.string(),
    email: z.string(),
    password: z.string().min(6)
});

export const siginShema=z.object({
    email:z.string(),
    password:z.string()
})

export const roomSchema=z.object({
    name:z.string()
});

