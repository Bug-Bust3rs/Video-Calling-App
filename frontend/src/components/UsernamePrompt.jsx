
import React from 'react';

const UsernamePrompt = ({ formattedUsername, remoteUsername, setRemoteUsername, startCall }) => (
  <div className="absolute top-12 text-center text-white z-20">
    <h1 className="text-4xl font-bold mb-4">Video Calling App</h1>
    <h2 className="text-2xl">
      Your Username: <span className="font-semibold">{formattedUsername}</span>
    </h2>
    <input
      type="text"
      placeholder="Enter remote username"
      value={remoteUsername}
      onChange={(e) => setRemoteUsername(e.target.value)}
      className="mt-4 px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400"
    />
    <button
      onClick={startCall}
      className="mt-4 px-6 py-2 bg-blue-500 rounded-lg text-white"
    >
      Start Call
    </button>
  </div>
);

export default UsernamePrompt;
