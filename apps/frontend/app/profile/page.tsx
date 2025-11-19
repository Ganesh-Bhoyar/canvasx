'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  UserGroupIcon, 
  ShieldCheckIcon, 
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { 
  
  PaintBrushIcon,
  Squares2X2Icon,
  Cog6ToothIcon,
  UserCircleIcon,
   
} from '@heroicons/react/24/outline';
import axios from 'axios';
 
import {  User2Icon } from 'lucide-react';
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { HTTP_URL } from '@/config';


// Mock data
 
 


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

const mockRequests = [
  {
                name: "vishal",
                email:"vishal@gmail.com",
                avatar:"https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
                id:1,
                slug: " creative-hub",
                timestamp: Date.now(),
                roomName: "Creative Hub"
  } 
];

const Sidebar: React.FC<{Router:AppRouterInstance}> = ({Router}) => {
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
          <div  onClick={()=>{Router.push("/")}} className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg font-medium">
            <Squares2X2Icon className="w-5 h-5" />
            <span>Dashboard</span>
          </div>

          <div onClick={()=>{Router.push("/profile")}} className="flex items-center space-x-3 px-3 py-2 text-blue-600 bg-blue-50 rounded-lg transition-colors duration-200">
            <UserCircleIcon className="w-5 h-5" />
            <span>Profile</span>
          </div>

          <div className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200">
            <Cog6ToothIcon className="w-5 h-5" />
            <span>Settings</span>
          </div>
        </nav>
      </div>
    </aside>
  );
};

interface Usertype{
  name:string,
  email:string,
  avatar:string,
  requests:any[],
  adminRooms:any[],
  rooms:any[]
}


export default function ProfilePage() {
  const [requests, setRequests] = useState(mockRequests);
  const Router = useRouter();
  const [user,setUser]=useState<Usertype>({} as Usertype);
  const [token,setToken]=useState<string|null>(null);

const reqhandler=async(email:string,approve:boolean,slug:string)=>{
  const res=await axios({
    method:"post",
    url:`${HTTP_URL}/approverequest`,
    data:{
      emailToRemove:email,
      apporove:approve,
      slug:slug
    },
    headers:{
      "authorization":token
    }
  })
  console.log("Response from server:",res.data);
 
  
    setRequests(requests.filter((req)=>req.email!==email));
  
  
};
   
  const handleApprove = (id: number) => {
    setRequests(requests.filter(req => req.id !== id));
  };

  const handleReject = (id: number) => {
    setRequests(requests.filter(req => req.id !== id));
  };

  useEffect(() => {
    
    const fetchUserData=async()=>{
    const token=localStorage.getItem("authorization");
    setToken(token);
    const user=await axios({
      url:`${HTTP_URL}/profiledetaiis`,
      method:"get",
      headers:{
        authorization:token
      }
    })

    const userdata=user.data.user;
    if(userdata)
    {
      const u={
        name:userdata.name,
        email:userdata.email,
        avatar:userdata.avatar,
        requests:userdata.requests,
        adminRooms:userdata.adminRooms,
        rooms:userdata.rooms
      }
      console.log("User data:",u);
      setUser(u);
      setRequests(userdata.requests as any[]);
      }
    }

  
    fetchUserData();



}, []);
  return (<div className="flex  ">
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar Router={Router}/>
    </div>
    <div className=" flex-grow-2 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6  ">
    
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* User Header Section */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-8 border border-white/20">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
              {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt="avatar"
                        className="w-14 h-14 rounded-full object-cover border-2 border-gray-200 group-hover:border-blue-400 transition-colors duration-300"
                      />
                    ) : (
                      <User2Icon className="relative w-32 h-32 rounded-full text-blue-600 object-cover border-4 border-white shadow-xl" />
                    )}

            </div>
            <div className="text-center md:text-left flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {user.name}
              </h1>
              <p className="text-gray-600 text-lg">{user.email}</p>
              <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                <span className="px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  Active Member
                </span>
                <span className="px-4 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  Room Admin
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Groups Joined */}
          <div className="group bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-white/20 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <UserGroupIcon className="w-8 h-8 text-white" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{(user.rooms?.length || 0) + (user.adminRooms?.length || 0)}</p>
              <p className="text-gray-600 font-medium">Groups Joined</p>
            </div>
          </div>

          {/* Rooms as Admin */}
          <div className="group bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-white/20 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <ShieldCheckIcon className="w-8 h-8 text-white" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{user.adminRooms?.length || 0}</p>
              <p className="text-gray-600 font-medium">Rooms as Admin</p>
            </div>
          </div>

          {/* Pending Requests */}
          <div className="group bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-white/20 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <ClockIcon className="w-8 h-8 text-white" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{user.requests?.length || 0}</p>
              <p className="text-gray-600 font-medium">Pending Requests</p>
            </div>
          </div>
        </div>

        {/* Requests List Section */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-8 border border-white/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <ClockIcon className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Requests to Join Your Rooms
            </h2>
          </div>

          {requests.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircleIcon className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg">No pending requests</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <div
                  key={`${request.email}-${request.slug}`}
                  className="group bg-gradient-to-r from-white to-gray-50 rounded-xl p-5 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                     {request.avatar ? (
                      <img
                        src={request.avatar}
                        alt="avatar"
                        className="w-14 h-14 rounded-full object-cover border-2 border-gray-200 group-hover:border-blue-400 transition-colors duration-300"
                      />
                    ) : (
                      <User2Icon className="w-14 h-14 text-neutral-600" />
                    )}


                      {/* <img
                        src={request.avatar||<User2Icon}
                        alt={request.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-gray-200 group-hover:border-blue-400 transition-colors duration-300"
                      /> */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg mb-1">
                          {request.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-1">
                          Wants to join: <span className="font-medium text-gray-900">{request.roomName}</span>
                        </p>
                        <p className="text-gray-400 text-xs">{getRelativeTime(new Date(request.timestamp))}</p>
                      </div>
                    </div>

                    <div className="flex gap-3 w-full sm:w-auto">
                      <button
                        onClick={() => reqhandler(request.email,true,request.slug)}
                        className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-green-700 hover:shadow-lg hover:scale-105 transition-all duration-200"
                      >
                        <CheckCircleIcon className="w-5 h-5" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => reqhandler(request.email,false,request.slug)}
                        className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium hover:from-red-600 hover:to-red-700 hover:shadow-lg hover:scale-105 transition-all duration-200"
                      >
                        <XCircleIcon className="w-5 h-5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}
