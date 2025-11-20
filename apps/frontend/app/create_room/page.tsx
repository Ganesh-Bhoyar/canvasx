'use client';

import { CrossIcon, Pen } from 'lucide-react';
import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { HTTP_URL } from '@/config';

export default function CreateRoomPage() {
  const [roomName, setRoomName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [token,setToken]=useState('');
  const Router = useRouter();


  useEffect(() => {
    const storedToken = localStorage.getItem('authorization');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!roomName.trim()) {
      setError('Room name is required');
      return;
    }

    setIsLoading(true);
    const values = {
      name: roomName.trim(),
      desc: description.trim(),
    };

    // Simulate API call
    console.log('Creating room with values:', values);
    console.log('Using token:', token);
     const res = await axios({
        url: `${HTTP_URL}/createroom`,
        method: "POST",
        data: values,
        headers: {
          authorization:token,
        },
      });
     if(res)
      {
      toast ("Room created successfully", {
      position: "top-center",
      autoClose:2500,
      style: {  color: '#1F2937'}
    })
    setIsLoading(false);
    setTimeout(() => {
      Router.push("/");
    }, 2000);
    
    // Reset form
    setRoomName('');
    setDescription('');}
  };

  return (
    <>
      <div className="flex items-center space-x-3 fixed top-4 left-4" onClick={()=>Router.push("/")}>
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <Pen className="w-5 h-5 text-white" />
                  </div>
                  <span className={`text-xl font-bold   'text-gray-900'
                  }`}>
                    CanvasX
                  </span>
                </div>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
    
      
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-6"><h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-2 text-center">
            Create Room
          </h1>
          <div className='fixed top-36 right-136' onClick={()=>Router.push("/")}>
         <CrossIcon
  className="w-5 h-5 fill-black text-black rotate-45 
             hover:scale-150 hover:rotate-180 
             transition-transform duration-300 ease-in-out cursor-pointer"
/>

            </div>
            <p className="text-slate-600 text-center ">Set up a new collaborative space</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="roomName" className="block text-sm font-medium text-slate-700 mb-2">
                Room Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="roomName"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900 placeholder:text-slate-400"
                placeholder="Enter room name"
                disabled={isLoading}
              />
              {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900 placeholder:text-slate-400 resize-none"
                placeholder="Add a description (optional)"
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"

              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : (
                'Create Room'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
    </>
  );
}
