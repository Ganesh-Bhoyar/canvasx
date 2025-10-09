"use client";


import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { WS_URL } from "@/config";
import { set } from "zod";

interface SocketContextType {
  socket: WebSocket | null;
}

const WebSocketContext = createContext<SocketContextType | null>(null);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const socketRef = useRef<WebSocket | null>(null);
  const [auth, setAuth] = useState<string | null>(null);

   if(!socketRef.current || socketRef.current.readyState === WebSocket.CLOSED)
   {
    socketRef.current = new WebSocket(`${WS_URL}/?token=${auth}`);
    console.log(auth);
    console.log(`websokcet connected ${socketRef.current.readyState}`)
    console.log("new soket created");
  }
     

  useEffect(() => {
    if(auth == null)
      {
        setAuth(localStorage.getItem("authorization"));
      }
    return () => {
      
      if(socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);
  return (

  <WebSocketContext.Provider value={{ socket: socketRef.current }}>
      {children}
    </WebSocketContext.Provider>
  )
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};
