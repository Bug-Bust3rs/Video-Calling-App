import React, { useRef, useEffect, useState } from 'react';
import Peer from 'peerjs';
import axios from 'axios'; // Add Axios for HTTP requests to the server
const BASE_URL = 'http://localhost:5000';
const VideoCall = () => {
  const [username, setUsername] = useState('');
  const [formattedUsername, setFormattedUsername] = useState('');
  const [remoteUsername, setRemoteUsername] = useState('');
  const [peerId, setPeerId] = useState('');
  const [incomingCall, setIncomingCall] = useState(null);
  const [inCall, setInCall] = useState(false);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerInstance = useRef(null);
  const currentCall = useRef(null);

  useEffect(() => {
    // Ask for the username on page load
    const userInput = prompt('Please enter your username (e.g., puskar07):');
    const formatted = formatUsername(userInput);
    setUsername(userInput);
    setFormattedUsername(formatted);

    // Initialize PeerJS and get Peer ID
    const peer = new Peer(undefined, {
      host: '/',
      port: 5000,
      path: '/peerjs',
    });

    peer.on('open', (id) => {
      setPeerId(id);
      // Register the username with the server
      axios.post(`${BASE_URL}/register-username`, { username: formatted, peerId: id })
        .then(() => console.log('Username registered successfully'))
        .catch((error) => console.error('Registration failed:', error));
    });

    // When receiving a call
    peer.on('call', (call) => {
      setIncomingCall(call); // Store incoming call in state
    });

    peerInstance.current = peer;
  }, []);

  const formatUsername = (name) => {
    // Convert username to lowercase and remove spaces
    return name.toLowerCase().replace(/\s+/g, '') + Math.floor(Math.random() * 100);
  };

  const answerCall = () => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      localVideoRef.current.srcObject = stream;
      incomingCall.answer(stream); // Answer the call with local stream
      setInCall(true);

      incomingCall.on('stream', (remoteStream) => {
        remoteVideoRef.current.srcObject = remoteStream; // Receive remote stream
      });

      currentCall.current = incomingCall; // Store current call
    });
  };

  const startCall = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/get-peer-id?username=${remoteUsername}`);
      const remotePeerId = response.data.peerId;

      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
        localVideoRef.current.srcObject = stream;
        const call = peerInstance.current.call(remotePeerId, stream); // Call remote peer

        call.on('stream', (remoteStream) => {
          remoteVideoRef.current.srcObject = remoteStream; // Set remote stream
        });

        currentCall.current = call; // Store current call
        setInCall(true); // Set call state to true
      });
    } catch (error) {
      console.error('Error fetching Peer ID:', error);
      alert('Error: Could not find the remote user.');
    }
  };

  const hangUp = () => {
    if (currentCall.current) {
      currentCall.current.close(); // Close the current call

      // Stop local video stream
      const localStream = localVideoRef.current.srcObject;
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop()); // Stop all media tracks
      }

      // Reset the video elements
      localVideoRef.current.srcObject = null;
      remoteVideoRef.current.srcObject = null;

      setInCall(false); // Set call state to false
      setIncomingCall(null); // Clear the incoming call
    }
  };

  return (
    <div>
      <h2>Your Username: {formattedUsername}</h2>

      <input
        type="text"
        placeholder="Enter remote username"
        value={remoteUsername}
        onChange={(e) => setRemoteUsername(e.target.value)}
        disabled={inCall}
      />
      <button onClick={startCall} disabled={inCall}>
        Start Call
      </button>

      {incomingCall && !inCall && (
        <div>
          <h3>Incoming call...</h3>
          <button onClick={answerCall}>Answer Call</button>
        </div>
      )}

      {inCall && (
        <div>
          <button onClick={hangUp}>Hang Up</button>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
        <div>
          <h3>Your Video</h3>
          <video ref={localVideoRef} autoPlay playsInline width="400" />
        </div>
        <div>
          <h3>Remote Video</h3>
          <video ref={remoteVideoRef} autoPlay playsInline width="400" />
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
