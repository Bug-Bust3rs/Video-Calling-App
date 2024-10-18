
import React from 'react';
import { ImPhoneHangUp } from "react-icons/im";
import { FaVideoSlash , FaVideo } from "react-icons/fa";
import { FaMicrophoneSlash , FaMicrophone } from "react-icons/fa6";
const Controls = ({ isMuted, isVideoOn, toggleMute, toggleVideo, hangUp }) => (
  <div className="absolute bottom-20 flex space-x-4 z-20">
    <button
      onClick={toggleMute}
      className={`px-6 py-6 text-3xl rounded-full ${isMuted ? 'bg-red-500' : 'bg-gray-200'} text-black`}
    >
      {isMuted ? <FaMicrophone/> : <FaMicrophoneSlash/>}
    </button>
    <button
      onClick={toggleVideo}
      className={`px-6 py-6 text-3xl rounded-full ${isVideoOn ? 'bg-gray-200' : 'bg-yellow-500'} text-black`}
    >
      {isVideoOn ? <FaVideoSlash/> : <FaVideo/>}
    </button>
    <button
      onClick={hangUp}
      className="px-6 py-6 text-3xl rounded-full bg-red-600 text-white"
    >
      <ImPhoneHangUp/>
    </button>
  </div>
);

export default Controls;
