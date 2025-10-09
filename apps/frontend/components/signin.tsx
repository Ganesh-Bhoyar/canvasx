"use client";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import axios from "axios"
import { z } from "zod";
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "react-toastify";
import { CrossIcon } from "lucide-react";
import { useRouter } from "next/navigation"; // Correct hook import

export const formSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters long")
});

export function Signin() {
  // ✅ 1. Call the hook at the top level of the component
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  // ✅ 2. Define your submit handler inside the component
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await axios({
        url: "http://localhost:3001/api/v1/signin",
        method: "POST",
        data: values
      });

      if (res.status === 200) {
        toast("Login successful", { /* ...toast options */ });
        localStorage.setItem('authorization', res.data.token);
        setTimeout(() => {
          // Use the router instance defined above
          router.push("/dashboard");
        }, 2500);
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        if (err.response.status === 400) {
          toast("Please Signup First", { /* ...toast options */ });
          setTimeout(() => {
            // Use the router instance here too
            router.push("/signup");
          }, 1500);
        } else if (err.response.status === 401) {
          toast("Invalid Credentials", { /* ...toast options */ });
        } else {
          toast.error("An unexpected error occurred.");
        }
      } else {
        toast.error("Login failed (network or unknown error)");
      }
    }
  }

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-800 to-gray-950 ">
      <div className="w-96 max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <Form {...form}>
          <div className="text-center text-3xl font-bold flex justify-between items-center">
            <span>Sign In</span>
            <span
              className="cursor-pointer hover:bg-slate-100 p-1 rounded-full"
              // ✅ 3. Use router.push for client-side navigation
              onClick={() => router.push("/")}
            >
              <CrossIcon />
            </span>
          </div>
          <div className="text-center px-6">Enter your credentials to log in</div>
          {/* ✅ 4. Pass the new onSubmit function to handleSubmit */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" {...field} />
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full hover:bg-yellow-400 hover:text-gray-800">Login</Button>
          </form>
          <div className="text-center">
            Don't have an account?{" "}
            <span
              className="underline text-blue-600 cursor-pointer"
              onClick={() => router.push("/signup")}
            >
              Signup
            </span>
          </div>
        </Form>
      </div>
    </div>
  );
}