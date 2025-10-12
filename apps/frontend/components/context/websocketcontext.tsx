"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { WS_URL } from "@/config";

interface SocketContextType {
  socket: WebSocket | null;
}

const WebSocketContext = createContext<SocketContextType>({ socket: null });

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // ✅ Store the socket in state to trigger re-renders on connection
  const [socket, setSocket] = useState<WebSocket | null>(null);

  // This effect runs only once to get the token
  useEffect(() => {
    const token = localStorage.getItem("authorization");
    
    if (!token) {
      console.error("No authorization token found. Cannot connect WebSocket.");
      return;
    }

    // ✅ All connection logic is now safely inside useEffect
    const newSocket = new WebSocket(`${WS_URL}/?token=${token}`);

    newSocket.onopen = () => {
      console.log("WebSocket connected successfully!");
      setSocket(newSocket);
    };

    newSocket.onclose = () => {
      console.log("WebSocket disconnected.");
      setSocket(null); // Clear the socket when it closes
    };
    
    newSocket.onerror = (error) => {
        console.error("WebSocket Error:", error);
    };

    // ✅ Cleanup function: This will run when the component unmounts
    return () => {
      console.log("Closing WebSocket connection.");
      newSocket.close();
    };
  }, []); // The empty array [] ensures this runs only once on mount

  return (
    <WebSocketContext.Provider value={{ socket }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (context === undefined || context === null) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};