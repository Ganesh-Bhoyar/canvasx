"use client";

 
import React, {   useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { set } from "zod";
import { WS_URL } from "@/config";
import { Session } from "inspector/promises";
import { useRouter } from "next/navigation";
import { useWebSocket } from "./context/websocketcontext";

 
interface messagetype{
   shape:string,
   color:string,
   height:number,
   width:number,
   x:number,
   y:number,
   status:string
}

export default   function Board({ slug}:{ slug:string})
{  
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [innerWidth, setInnerWidth] =  React.useState(0);
    const [innerHeight, setInnerHeight] =  React.useState(0);
    const [isDrawing, setIsDrawing] = React.useState(false);
    const [lastX, setLastX] = React.useState(0);
    const [lastY, setLastY] = React.useState(0);
    const [newX, setNewX] = React.useState(0);
    const [newY, setNewY] = React.useState(0);
    const [color, setColor] = React.useState("red");
    const [shape, setShape] = React.useState("circle");
    
   
    const [messages,Setmessages]=React.useState<messagetype[]>([]);
       const Router = useRouter();
       const socket = useWebSocket()?.socket;
     
  



   
   useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setInnerHeight(window.innerHeight);
    setInnerWidth(window.innerWidth);
   


   
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const handleDown = (e: MouseEvent) => {
      setIsDrawing(true);
      setLastX(e.offsetX);
      setLastY(e.offsetY);
      console.log("Mouse down at", e.offsetX, e.offsetY);
    };
  

   

    const handleMove = (e: MouseEvent) => {
      console.log("Mouse move event", e, );
      console.log("isDrawing", isDrawing);

      if (!isDrawing)
      {
        return;
      }
      setNewX(e.offsetX);
      setNewY(e.offsetY);
      const newx = e.offsetX;
      const newy = e.offsetY;
      console.log("Mouse move at", e.offsetX, e.offsetY);
      // draw_rect(ctx, lastX, lastY, newx - lastX, newy - lastY,color,shape);
      const data={
        shape,
        color,
        height:newy - lastY,
        width:newx - lastX,
        x:lastX,
        y:lastY,
        status:"inter"
      };
      Setmessages(messages=>[...messages,data]);
      socket!.send(JSON.stringify({
        type:"message",
        message:{
          slug,
          shape,
          color,
          height:newy - lastY,
          width:newx - lastX,
          x:lastX,
          y:lastY,
          status:"inter"
        }
      }))
       
    };

    const handleUp = () => {
      
      socket!.send(JSON.stringify({
        type:"message",
        message:{
          slug,
          shape,
          color,
          height:newY - lastY,
          width:newX - lastX,
          x:lastX,
          y:lastY,
          status:"end"
        }
          }))
          // 
          const data={
        shape,
        color,
        height:newY - lastY,
        width:newX - lastX,
        x:lastX,
        y:lastY,
        status:"end"
      };
      Setmessages(messages=>[...messages,data]);
      setIsDrawing(false);
      console.log("Mouse up");
    };
       

    canvas.addEventListener("mousedown", handleDown);
    canvas.addEventListener("mousemove", handleMove);
    canvas.addEventListener("mouseup", handleUp);

    // cleanup
    return () => {
      canvas.removeEventListener("mousedown", handleDown);
      canvas.removeEventListener("mousemove", handleMove);
      canvas.removeEventListener("mouseup", handleUp);
    };

    
  }, [isDrawing, lastX, lastY, newX, newY]);

   useEffect(()=>{
    if(isDrawing == false)
      { console.log("filtering");
        const temp=messages.filter(m=>m.status==="end");
        Setmessages(temp);
        console.log("after filtering",messages.length);
      }  

   },[isDrawing])
   useEffect(()=>{
      if(socket)
      {
        console.log("sending req for prev messages");
        socket.send(JSON.stringify({type:"prev_messages",message:{slug}}));
      }
    },[socket])

    useEffect(()=>{
      
        if(!canvasRef.current) return;
        canvasRef.current.getContext("2d")!.clearRect(0, 0, innerWidth, innerHeight);
        messages.forEach(message=>{
          if(message.shape==="circle")
          {
            draw_rect(canvasRef.current!.getContext("2d")!,message.x,message.y,message.width,message.height,message.color,message.shape);
          }
          else if(message.shape==="rect")
          {
            draw_rect(canvasRef.current!.getContext("2d")!,message.x,message.y,message.width,message.height,message.color,message.shape);
          }
          
        });
        console.log("length of messages",messages.length);
    },[messages]);

if(socket !== null)
{
  socket!.onmessage = (e) => {
    const message = JSON.parse(e.data);
    if (message.type === "message") {
      Setmessages(messages=>[...messages,message.message]);
    }
    else if (message.type === "prev_messages") {
    
    if (Array.isArray(message.message) && message.message.length > 0) {

      
      const updatedMessages = message.message.map((msg: any) => ({
        ...msg,          
        status: "end"    
      }));

       
      Setmessages(prev => [...prev, ...updatedMessages]);

     
      console.log("Previous messages with status added:", updatedMessages);
    }
  }
    else if(message.type === "invalid access")
    {
      console.log(message.message);
    }
    else if(message.type==="message sent successfully")
    {
      console.log(message.message);
    }
    else
    {
      console.log("unknown message type:", message);
    }
  };
}
 
 


  return ( <div className="flex flex-col items-center justify-center overflow-hidden width-full height-screen">
      
   <canvas ref={canvasRef} width={innerWidth} height={innerHeight - 1} className="border border-white bg-[#121212]  touch-none">

 

   </canvas>
    <Button  onClick={() => setShape("circle")} className="fixed  bottom-2 right-2">Circle</Button>
    <Button onClick={() => setShape("rect")} className="fixed bottom-2 right-24">Rect</Button>
   </div>
  );
}




function draw_rect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number,color:string,shape:string) {
  if (shape === "rect") {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
  } 
  else if (shape === "circle") {
    ctx.beginPath();
    ctx.arc(x + width / 2, y + height / 2, (Math.min(Math.abs(width), Math.abs(height)) / 2), 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
  }
}




 
//  model Message {
//   id Int @id @default(autoincrement())
//   slugid String
//   room Room @relation(fields:[slugid], references: [slug])
//   shape     String
//   color     String
//   x         Int
//   y         Int
//   width     Int
//   height    Int
//   userid String
//   user User @relation(fields:[userid], references: [id])
//   time DateTime  @default(now())
// }