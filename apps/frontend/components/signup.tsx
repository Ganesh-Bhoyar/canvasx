"use client";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import axios from "axios"
import { z} from "zod";
 import { Button } from "@/components/ui/button"
 import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { CrossIcon, Router } from "lucide-react";
import { HTTP_URL } from "@/config";
 
 

export const formSchema=z.object({
    email:z.string().email("Invalid email"),
    name:z.string().min(2,"Name is required"),
    password:z.string().min(6,"Password must be at least 6 characters long"),

    
})

export function Signup() {
   const router = useRouter();

    async function onSubmit(values: z.infer<typeof formSchema>) {
    
    
    try {
      const res = await axios({
        
        url: `${HTTP_URL}/signup`,
        method: "POST",
        data: values
      });
     toast("Account created successfully", {
  position: "top-center",
  autoClose: 2500,
  style: { color: '#1F2937' }
  });

    setTimeout(() => {
      router.push("/signin");
    }, 2500);
  } catch (err) {
    let errormessage="";
     
    if (axios.isAxiosError(err) && err.response) {
      if (err.response.status === 409) {
        errormessage = (err as any).data.error;
      } else if (err.response.data && err.response.data.error) {
        errormessage = "Error: " + err.response.data.error;
      } else {
        errormessage = "Signup failed (server error)";
      }
    } else {
      errormessage = "Signup failed (network or unknown error)";
    }

    toast.error(errormessage);
  }
  }
 
   
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    
  },
  mode: 'onChange',
  })
   return (
     <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-800 to-gray-950 ">
       
      <div className="w-96 max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
    
    <Form {...form}  >
        {/* <div className="text-black font-bold flex justify-end outline-none focus:border-2 focus:border-blue-500  cursor-pointer border-gray-400 w-[20px] h-12"><Crossicon></Crossicon></div> */}
        <div className="text-center text-3xl font-bold flex col    align-items justify-center"><span className="ml-[97px]">Sign Up</span><span className="ml-[85px]  cursor-pointer  hover:border-slate-500 hover:rounded-lg" onClick={()=>{
          window.location.href="/"
        }}> <CrossIcon
  className="w-5 h-5 fill-black text-black rotate-45 
             hover:scale-150 hover:rotate-180 
             transition-transform duration-300 ease-in-out cursor-pointer"
/>




</span></div>
        <div className="text-center px-6">Enter your information to create an Account</div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your full name" {...field} />
              </FormControl>
              {/* <FormDescription>This is your public display name.</FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
 

 
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Enter your password" {...field} />
              </FormControl>
              {/* <FormDescription>Must be at least 6 characters long.</FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full hover:bg-yellow-400 hover:text-gray-800">Submit</Button>
      </form>
      <div className="text-center">Already have an account? <span className="underline text-blue-600 cursor-pointer" onClick={()=>{window.location.href="/login"}}>Login</span></div>
    </Form>
      </div>
      </div>
  );
}

  
 