
import React from 'react';

const Controls = ({ isMuted, isVideoOn, toggleMute, toggleVideo, hangUp }) => (
  <div className="absolute bottom-8 flex space-x-4 z-20">
    <button
      onClick={toggleMute}
      className={`px-4 py-2 rounded-full ${isMuted ? 'bg-red-500' : 'bg-gray-200'} text-white`}
    >
      {isMuted ? 'Unmute' : 'Mute'}
    </button>
    <button
      onClick={toggleVideo}
      className={`px-4 py-2 rounded-full ${isVideoOn ? 'bg-gray-200' : 'bg-yellow-500'} text-white`}
    >
      {isVideoOn ? 'Turn Off Video' : 'Turn On Video'}
    </button>
    <button
      onClick={hangUp}
      className="px-4 py-2 rounded-full bg-red-600 text-white"
    >
      Hang Up
    </button>
  </div>
);

export default Controls;
