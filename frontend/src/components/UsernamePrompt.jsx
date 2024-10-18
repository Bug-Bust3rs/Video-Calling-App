import React from 'react';
import { RiVideoAddLine } from "react-icons/ri";
import { PiFlipVerticalLight } from "react-icons/pi";
const UsernamePrompt = ({ formattedUsername, remoteUsername, setRemoteUsername, startCall }) => (
  <div className="absolute top-1/4 w-full max-w-lg mx-auto text-center ">
    <div className="flex flex-col items-center gap-4 p-8 rounded-2xl backdrop-blur-lg bg-white/10 shadow-2xl border border-white/20">
      
      {/* Dialer Header */}
      <div className="w-full">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-400 mb-4">
          <span className='flex justify-center items-center gap-2 sm:gap-4'>Video Dialer <RiVideoAddLine className='text-white text-4xl sm:text-6xl'/></span>
        </h1>
        <h2 className="text-lg font-medium text-gray-300">
          Your Username: <span className="font-semibold text-white">{formattedUsername}</span>
        </h2>
      </div>

      {/* Remote Username Input */}
      <div className="w-full">
        <input
          type="text"
          placeholder="Enter remote username"
          value={remoteUsername}
          onChange={(e) => setRemoteUsername(e.target.value)}
          className="w-full mt-4 px-6 py-3 rounded-full bg-gray-700 text-white text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
        />
      </div>

      {/* Call Button */}
      <button
        onClick={startCall}
        className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-2xl font-light text-white rounded-full shadow-lg hover:scale-105 transition-transform transform hover:from-blue-500 hover:to-green-400 focus:outline-none focus:ring-4 focus:ring-green-400"
      >
       <span className='flex justify-center items-center gap-2'>Connect <PiFlipVerticalLight className='text-4xl'/> </span>
      </button>
    </div>
  </div>
);

export default UsernamePrompt;
