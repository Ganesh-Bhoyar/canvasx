"use client";

import { Button } from "@/components/ui/button";
import { WS_URL } from "@/config";
import { useRouter } from "next/navigation";
import React, { use, useEffect, useState } from "react";
import { useWebSocket } from "@/components/context/websocketcontext";

export default function DashboardPage() {
  const ws = useWebSocket()?.socket;
  
    
    const Router = useRouter();
    //Routes handles
    //1.join room
    //2.leave room
    //3.create room
    useEffect(() => {
           
            
            if (ws) {
                ws.send(JSON.stringify({
                    "type": "active",
                    "message": {}
                }));
            }
        
    }, []);
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <Button onClick={() => Router.push("/room/missionendsem" )}>Misson Endsem</Button>
    </div>
  );
}