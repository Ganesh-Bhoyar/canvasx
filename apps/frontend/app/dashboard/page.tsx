// "use client";

// import { Button } from "@/components/ui/button";

// import { useRouter } from "next/navigation";
// import React, {useEffect} from "react";
// import { useWebSocket } from "@/components/context/websocketcontext";

// export default function DashboardPage() {
//   const ws = useWebSocket()?.socket;
  
    
//     const Router = useRouter();
//     //Routes handles
//     //1.join room
//     //2.leave room
//     //3.create room
//     useEffect(() => {
           
            
//             if (ws) {
//                 ws.send(JSON.stringify({
//                     "type": "active",
//                     "message": {}
//                 }));
//             }
        
//     }, []);
//   return (
//     <div className="flex flex-col items-center justify-center">
//       <h1 className="text-3xl font-bold">Dashboard</h1>
//       <Button onClick={() => Router.push("/room/missionendsem" )}>Misson Endsem</Button>
//     </div>
//   );
// }

"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusIcon, 
  UsersIcon, 
  CalendarIcon, 
  ClockIcon,
  PaintBrushIcon,
  Squares2X2Icon,
  Cog6ToothIcon,
  UserCircleIcon,
  MagnifyingGlassIcon,
  EllipsisVerticalIcon
} from '@heroicons/react/24/outline';
import { useWebSocket } from '@/components/context/websocketcontext';
import { useRouter } from 'next/navigation';


// TypeScript interfaces for type safety
interface Room {
  id: string;
  name: string;
  dateJoined: Date;
  lastActive?: Date;
  participantCount: number;
  thumbnail?: string;
  isOwner: boolean;
  description?: string;
}

interface User {
  id: string;
  name: string;
  avatar?: string;
  email: string;
}

// Mock data for demonstration
const mockUser: User = {
  id: "user-1",
  name: "Alex Chen",
  email: "alex.chen@example.com",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
};

const mockRooms: Room[] = [
  {
    id: "missionendsem",
    name: "Product Design Brainstorm",
    dateJoined: new Date("2024-10-01"),
    lastActive: new Date("2024-10-11T10:30:00"),
    participantCount: 5,
    isOwner: true,
    description: "Wireframing and user flow design session"
  },
  {
    id: "room-2", 
    name: "Team Architecture Review",
    dateJoined: new Date("2024-09-28"),
    lastActive: new Date("2024-10-10T15:45:00"),
    participantCount: 3,
    isOwner: false,
    description: "System architecture diagrams and technical discussions"
  },
  {
    id: "room-3",
    name: "Marketing Campaign Ideas",
    dateJoined: new Date("2024-09-25"),
    lastActive: new Date("2024-10-09T09:20:00"),
    participantCount: 7,
    isOwner: false,
    description: "Creative brainstorming for Q4 marketing initiatives"
  },
  {
    id: "room-4",
    name: "Mobile App Mockups",
    dateJoined: new Date("2024-09-20"),
    lastActive: new Date("2024-10-08T14:10:00"),
    participantCount: 2,
    isOwner: true,
    description: "iOS and Android app interface designs"
  }
];

// Utility function to format relative time
const getRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;

  return date.toLocaleDateString();
};

// RoomCard Component
const RoomCard: React.FC<{ room: Room; index: number,router:any }> = ({ room, index,router }) => {  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -2, scale: 1.02 }}
      className="group"
    >
   
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer relative overflow-hidden" onClick={()=>{router.push(`/newdash`)}}>
          {/* Owner badge */}
          {room.isOwner && (
            <div className="absolute top-4 right-4">
              <div className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full">
                Owner
              </div>
            </div>
          )}

          {/* Room thumbnail placeholder */}
          <div className="w-full h-32 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg mb-4 flex items-center justify-center group-hover:from-blue-100 group-hover:to-purple-100 transition-colors duration-200">
            <PaintBrushIcon className="w-8 h-8 text-gray-400 group-hover:text-gray-500" />
          </div>

          {/* Room information */}
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-gray-900 text-lg mb-1 group-hover:text-blue-600 transition-colors duration-200">
                {room.name}
              </h3>
              {room.description && (
                <p className="text-sm text-gray-500 line-clamp-2">
                  {room.description}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <UsersIcon className="w-4 h-4" />
                  <span>{room.participantCount}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CalendarIcon className="w-4 h-4" />
                  <span>Joined {getRelativeTime(room.dateJoined)}</span>
                </div>
              </div>
            </div>

            {room.lastActive && (
              <div className="flex items-center space-x-1 text-xs text-gray-400">
                <ClockIcon className="w-3 h-3" />
                <span>Active {getRelativeTime(room.lastActive)}</span>
              </div>
            )}

            {/* Room ID */}
            <div className="text-xs text-gray-400 font-mono">
              ID: {room.id}
            </div>
          </div>
        </div>
      
    </motion.div>
  );
};

// Header Component
const Header: React.FC<{ user: User }> = ({ user }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Manage your collaborative drawing rooms</p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search rooms..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center space-x-3">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="text-sm">
              <p className="font-medium text-gray-900">{user.name}</p>
              <p className="text-gray-500">{user.email}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

// Sidebar Component
const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 h-full">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <PaintBrushIcon className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">CanvasX</span>
        </div>

        <nav className="space-y-2">
          <Link href="/dashboard" className="flex items-center space-x-3 px-3 py-2 text-blue-600 bg-blue-50 rounded-lg font-medium">
            <Squares2X2Icon className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>

          <Link href="/profile" className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200">
            <UserCircleIcon className="w-5 h-5" />
            <span>Profile</span>
          </Link>

          <Link href="/settings" className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200">
            <Cog6ToothIcon className="w-5 h-5" />
            <span>Settings</span>
          </Link>
        </nav>
      </div>
    </aside>
  );
};

// Loading Component
const LoadingState: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
          <div className="w-full h-32 bg-gray-200 rounded-lg mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Empty State Component
const EmptyState: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="text-center py-12"
    >
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <PaintBrushIcon className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No rooms yet</h3>
      <p className="text-gray-500 mb-6 max-w-sm mx-auto">
        Start collaborating by creating your first drawing room or joining an existing one.
      </p>
      <Link href="/create-room">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Create Your First Room</span>
        </motion.button>
      </Link>
    </motion.div>
  );
};

// Main Dashboard Component
const DashboardPage: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [user] = useState<User>(mockUser);
   const ws = useWebSocket()?.socket;
    const Router = useRouter();
  

  // Simulate API call with loading state
  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      setRooms(mockRooms);
      setLoading(false);
    };
    
  
    
//     
//     //Routes handles
//     //1.join room
//     //2.leave room
//     //3.create room
//     
           
    console.log("ws in dash:",ws);
     if (ws) {
  if (ws.readyState === WebSocket.CONNECTING) {
    console.log("WebSocket connecting, adding event listener");
    ws.addEventListener("open", () => {
      ws.send(JSON.stringify({
        type: "active",
        message: {}
      }));
    }, { once: true });
  } else if (ws.readyState === WebSocket.OPEN) {
    console.log("WebSocket already open, sending active message");
    ws.send(JSON.stringify({
      type: "active",
      message: {}
    }));
  }
}


    fetchRooms();
  }, [ws]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header user={user} />

        {/* Main Dashboard Content */}
        <main className="flex-1 p-6">
          {/* Create Room Button */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Your Rooms</h2>
              <p className="text-gray-500">
                {loading ? 'Loading...' : `${rooms.length} room${rooms.length !== 1 ? 's' : ''} joined`}
              </p>
            </div>

            <Link href="/create-room">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 shadow-sm"
              >
                <PlusIcon className="w-5 h-5" />
                <span>Create New Room</span>
              </motion.button>
            </Link>
          </div>

          {/* Room Grid */}
          <AnimatePresence>
            {loading ? (
              <LoadingState />
            ) : rooms.length === 0 ? (
              <EmptyState />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {rooms.map((room, index) => (
                  <RoomCard key={room.id} router={Router} room={room} index={index} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;


