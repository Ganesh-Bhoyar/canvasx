'use client';

import { useState } from 'react';
import { 
  UserGroupIcon, 
  ShieldCheckIcon, 
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

// Mock data
const mockUser = {
  name: "Alex Chen",
  email: "alex.chen@example.com",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
};

const mockStats = {
  groupsJoined: 12,
  roomsAsAdmin: 5,
  pendingRequests: 3
};

const mockRequests = [
  {
    id: 1,
    userName: "Sarah Johnson",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    roomName: "Product Design Brainstorm",
    requestDate: "2 hours ago"
  },
  {
    id: 2,
    userName: "Michael Zhang",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    roomName: "Marketing Campaign Ideas",
    requestDate: "5 hours ago"
  },
  {
    id: 3,
    userName: "Emma Wilson",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    roomName: "Mobile App Mockups",
    requestDate: "1 day ago"
  }
];

export default function ProfilePage() {
  const [requests, setRequests] = useState(mockRequests);

  const handleApprove = (id: number) => {
    setRequests(requests.filter(req => req.id !== id));
  };

  const handleReject = (id: number) => {
    setRequests(requests.filter(req => req.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* User Header Section */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-8 border border-white/20">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
              <img
                src={mockUser.avatar}
                alt={mockUser.name}
                className="relative w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
              />
            </div>
            <div className="text-center md:text-left flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {mockUser.name}
              </h1>
              <p className="text-gray-600 text-lg">{mockUser.email}</p>
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
              <p className="text-3xl font-bold text-gray-900 mb-1">{mockStats.groupsJoined}</p>
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
              <p className="text-3xl font-bold text-gray-900 mb-1">{mockStats.roomsAsAdmin}</p>
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
              <p className="text-3xl font-bold text-gray-900 mb-1">{mockStats.pendingRequests}</p>
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
                  key={request.id}
                  className="group bg-gradient-to-r from-white to-gray-50 rounded-xl p-5 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <img
                        src={request.userAvatar}
                        alt={request.userName}
                        className="w-14 h-14 rounded-full object-cover border-2 border-gray-200 group-hover:border-blue-400 transition-colors duration-300"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg mb-1">
                          {request.userName}
                        </h3>
                        <p className="text-gray-600 text-sm mb-1">
                          Wants to join: <span className="font-medium text-gray-900">{request.roomName}</span>
                        </p>
                        <p className="text-gray-400 text-xs">{request.requestDate}</p>
                      </div>
                    </div>

                    <div className="flex gap-3 w-full sm:w-auto">
                      <button
                        onClick={() => handleApprove(request.id)}
                        className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-green-700 hover:shadow-lg hover:scale-105 transition-all duration-200"
                      >
                        <CheckCircleIcon className="w-5 h-5" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleReject(request.id)}
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
  );
}
