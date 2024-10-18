
import React from 'react';
import { MdOutlineCallEnd , MdOutlineCall } from "react-icons/md";
const IncomingCall = ({ remoteUserDisplayName, answerCall, rejectCall, isIncomingAnimation }) => (
  <div className={`absolute h-screen w-screen z-20 backdrop-blur-3xl flex justify-center gap-6 items-center text-center flex-col text-white transition-transform duration-700 ease-in-out transform ${isIncomingAnimation ? 'translate-y-0' : '-translate-y-20'}`}>
    <h3 className="text-2xl font-bold mb-2 flex flex-col gap-4">
      Incoming call from <span className='text-4xl font-extrabold'>{remoteUserDisplayName}</span>
    </h3>
    <div className='flex flex-row gap-[80px] '>
      <button onClick={answerCall} className="z-10 rounded-full bg-green-500 p-6 text-3xl text-white">
        <MdOutlineCall/>
      </button>
      <button onClick={rejectCall} className="p-6 z-10 bg-red-500 rounded-full text-3xl text-white">
        <MdOutlineCallEnd/>
      </button>
    </div>
  </div>
);

export default IncomingCall;
