
import React, { useRef, useEffect, useState } from 'react';
import Peer from 'peerjs';
import axios from 'axios';
import Video from './components/Video';
import Controls from './components/Controls';
import IncomingCall from './components/IncomingCall';
import UsernamePrompt from './components/UsernamePrompt';

const VideoCall = () => {
  const [username, setUsername] = useState('');
  const [formattedUsername, setFormattedUsername] = useState('');
  const [remoteUsername, setRemoteUsername] = useState('');
  const [peerId, setPeerId] = useState('');
  const [incomingCall, setIncomingCall] = useState(null);
  const [inCall, setInCall] = useState(false);
  const [remoteUserDisplayName, setRemoteUserDisplayName] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isIncomingAnimation, setIsIncomingAnimation] = useState(false);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerInstance = useRef(null);
  const currentCall = useRef(null);
  const localStream = useRef(null);

  const BASE_URL = 'https://video-calling-app-58yc.onrender.com'; 

  useEffect(() => {
    const userInput = prompt('Please enter your username (e.g., puskar07):');
    const formatted = formatUsername(userInput);
    setUsername(userInput);
    setFormattedUsername(formatted);

    // const peer = new Peer(undefined, {
    //   host: '/',
    //   port: 5000,
    //   path: '/peerjs',
    // });

    const peer = new Peer(undefined, {
      host: 'video-calling-app-58yc.onrender.com', // Use your backend URL
      path: '/peerjs',
      secure: true, // Use secure connection
    });

    peer.on('open', (id) => {
      setPeerId(id);
      
      axios.post(`${BASE_URL}/register-username`, { username: formatted, peerId: id })
        .then(() => console.log('Username registered successfully'))
        .catch((error) => console.error('Registration failed:', error));
    });

    peer.on('call', (call) => {
      setIncomingCall(call);
      
      // Fetch the username associated with the incoming peerId
      axios.get(`${BASE_URL}/get-username`, { params: { peerId: call.peer } })
        .then((response) => {
          setRemoteUserDisplayName(response.data.username); // Show the username, not the peerId
        })
        .catch((error) => {
          console.error('Error fetching username for peerId:', error);
          setRemoteUserDisplayName(call.peer); // Fallback to peerId if username lookup fails
        });

      setIsIncomingAnimation(true); // Trigger animation on incoming call
    });

    peerInstance.current = peer;
  }, []);

  const formatUsername = (name) => {
    return name.toLowerCase().trim(); // Normalize usernames
  };

  const answerCall = () => {
    navigator.mediaDevices.getUserMedia({ video: isVideoOn, audio: !isMuted }).then((stream) => {
      localVideoRef.current.srcObject = stream;
      localStream.current = stream;
      incomingCall.answer(stream);
      setInCall(true);
      setIsIncomingAnimation(false); // End the animation after answering the call

      incomingCall.on('stream', (remoteStream) => {
        remoteVideoRef.current.srcObject = remoteStream;
      });

      currentCall.current = incomingCall;
    });
  };

  const rejectCall = () => {
    // Reject the incoming call
    if (currentCall.current) {
      currentCall.current.close(); // Close the call if ongoing
    }
    setInCall(false);
    setIncomingCall(null);
    setIsIncomingAnimation(false); // End the animation
    localVideoRef.current.srcObject = null;
    remoteVideoRef.current.srcObject = null;
  };

  const startCall = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/get-peer-id`, {
        params: { username: formatUsername(remoteUsername) }
      });
      const remotePeerId = response.data.peerId;

      navigator.mediaDevices.getUserMedia({ video: isVideoOn, audio: !isMuted }).then((stream) => {
        localVideoRef.current.srcObject = stream;
        localStream.current = stream;
        const call = peerInstance.current.call(remotePeerId, stream);

        call.on('stream', (remoteStream) => {
          remoteVideoRef.current.srcObject = remoteStream;
        });

        call.on('close', () => {
          hangUp();
        });

        currentCall.current = call;
        setInCall(true);
      });
    } catch (error) {
      console.error('Error fetching Peer ID:', error);
      alert('Error: Could not find the remote user.');
    }
  };

  const hangUp = () => {
    if (currentCall.current) {
      currentCall.current.close();
      const localStream = localVideoRef.current.srcObject;
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }

      localVideoRef.current.srcObject = null;
      remoteVideoRef.current.srcObject = null;

      setInCall(false);
      setIncomingCall(null);
      setRemoteUserDisplayName('');
    }
  };

  const toggleMute = () => {
    if (localStream.current) {
      localStream.current.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(prev => !prev);
    }
  };

  const toggleVideo = () => {
    if (localStream.current) {
      localStream.current.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOn(prev => !prev);
    }
  };

  return (
    <div className="relative h-screen w-full bg-gray-900 flex flex-col items-center justify-center">
      {/* Full Screen Remote Video */}
      <div className="absolute top-0 left-0 w-full h-full">
        <Video ref={remoteVideoRef} />
      </div>

      {/* Local Video - Always show the local video */}
      <div className="absolute top-5 right-4 w-32 h-32 sm:w-40 sm:h-40 rounded-full">
        <Video ref={localVideoRef} isLocal={true} />
      </div>

      {/* Call control buttons - Only show when in a call */}
      {inCall && (
        <Controls
          isMuted={isMuted}
          isVideoOn={isVideoOn}
          toggleMute={toggleMute}
          toggleVideo={toggleVideo}
          hangUp={hangUp}
        />
      )}

      {/* Incoming Call Animation */}
      {incomingCall && !inCall && (
        <IncomingCall
          remoteUserDisplayName={remoteUserDisplayName}
          answerCall={answerCall}
          rejectCall={rejectCall}
          isIncomingAnimation={isIncomingAnimation}
        />
      )}

      {/* Username and prompt section */}
      {!inCall && (
        <UsernamePrompt
          formattedUsername={formattedUsername}
          remoteUsername={remoteUsername}
          setRemoteUsername={setRemoteUsername}
          startCall={startCall}
        />
      )}
    </div>
  );
};

export default VideoCall;
