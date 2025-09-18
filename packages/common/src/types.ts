import {email, z} from "zod";


export const userSchema = z.object({
    name : z.string(),
    email: z.email(),
    password: z.string().min(6)
});

export const siginShema=z.object({
    email:z.ZodString,
    password:z.ZodString
})

export const roomSchema=z.object({
    name:z.string()
})