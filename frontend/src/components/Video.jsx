
import React from 'react';

const Video = React.forwardRef(({ isLocal, isMuted }, ref) => (
  <video
    ref={ref}
    className={`w-full h-full object-cover ${isLocal ? 'bg-black bg-opacity-70 z-10' : ''}`}
    autoPlay
    playsInline
    muted={isLocal ? true : isMuted}
  />
));

export default Video;
