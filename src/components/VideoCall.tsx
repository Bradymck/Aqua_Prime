import React, { useEffect, useRef } from 'react';
import { Room, RoomEvent, Participant, RemoteParticipant } from 'livekit-client';
import { useCallSystem } from '../hooks/useCallSystem';

interface VideoCallProps {
  nftId: string;
  onEnd?: () => void;
}

export const VideoCall: React.FC<VideoCallProps> = ({ nftId, onEnd }) => {
  const { isCallActive, startCall, endCall, room } = useCallSystem(nftId);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (room) {
      room.on(RoomEvent.ParticipantConnected, handleParticipantConnected);
      room.on(RoomEvent.ParticipantDisconnected, handleParticipantDisconnected);
      
      return () => {
        room.off(RoomEvent.ParticipantConnected, handleParticipantConnected);
        room.off(RoomEvent.ParticipantDisconnected, handleParticipantDisconnected);
      };
    }
  }, [room]);

  const handleParticipantConnected = (participant: RemoteParticipant) => {
    // Handle new participant joining
    participant.on('trackSubscribed', (track) => {
      if (track.kind === 'video' && remoteVideoRef.current) {
        track.attach(remoteVideoRef.current);
      }
    });
  };

  const handleParticipantDisconnected = (participant: Participant) => {
    // Clean up when participant leaves
    participant.removeAllListeners();
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
  };

  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-0 bg-black">
        {/* Remote video (AI character) */}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Local video (player) */}
      <div className="absolute bottom-4 right-4 w-1/4 aspect-video">
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      {/* Controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
        <button
          onClick={endCall}
          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
        >
          End Call
        </button>
      </div>
    </div>
  );
}; 