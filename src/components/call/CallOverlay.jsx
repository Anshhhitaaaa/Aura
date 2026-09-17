import React, { useEffect, useRef } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff, Sparkles, Volume2 } from 'lucide-react';
import { useCall } from '../../context/CallContext';

export default function CallOverlay() {
  const {
    callState,
    callType,
    targetUser,
    isAudioMuted,
    isVideoOff,
    localStreamRef,
    remoteStreamRef,
    acceptCall,
    endCall,
    toggleAudio,
    toggleVideo,
  } = useCall();

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // Hook streams to video elements
  useEffect(() => {
    if (localVideoRef.current && localStreamRef.current) {
      localVideoRef.current.srcObject = localStreamRef.current;
    }
  }, [callState, isVideoOff]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStreamRef.current) {
      remoteVideoRef.current.srcObject = remoteStreamRef.current;
    }
  }, [callState]);

  if (callState === 'idle') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2A2624]/70 backdrop-blur-2xl animate-fade-in">
      
      {/* 1. INCOMING CALL POPUP MODAL */}
      {callState === 'incoming' && (
        <div className="w-full max-w-sm glass-card rounded-3xl p-8 text-center space-y-6 animate-float border border-white/80 shadow-2xl">
          <div className="relative inline-block">
            <img
              src={targetUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'}
              alt={targetUser?.displayName}
              className="w-24 h-24 rounded-full object-cover ring-4 ring-[#E89CAE] mx-auto shadow-lg"
            />
            <span className="absolute inset-0 rounded-full ring-4 ring-[#E89CAE] animate-ping opacity-40" />
          </div>

          <div>
            <h3 className="font-display font-bold text-xl text-[#2A2624]">{targetUser?.displayName}</h3>
            <p className="text-xs text-[#7A726A] mt-1 flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#E89CAE]" />
              <span>Incoming {callType === 'video' ? 'Video' : 'Voice'} Call...</span>
            </p>
          </div>

          <div className="flex items-center justify-center gap-6 pt-2">
            <button
              onClick={endCall}
              className="w-14 h-14 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform"
              title="Decline"
            >
              <PhoneOff className="w-6 h-6" />
            </button>

            <button
              onClick={acceptCall}
              className="w-14 h-14 rounded-full bg-gradient-to-r from-[#98B09A] to-[#E89CAE] text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform animate-bounce"
              title="Accept"
            >
              <Phone className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* 2. OUTGOING CALL / CONNECTED SCREEN */}
      {(callState === 'outgoing' || callState === 'connected' || callState === 'ended') && (
        <div className="w-full max-w-4xl h-[85vh] glass-card rounded-3xl overflow-hidden relative flex flex-col justify-between p-6 border border-white/80 shadow-2xl">
          
          {/* Main Remote View */}
          <div className="absolute inset-0 bg-[#2A2624] flex items-center justify-center">
            {callType === 'video' && !isVideoOff ? (
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center space-y-4">
                <div className="relative inline-block">
                  <img
                    src={targetUser?.avatar}
                    alt={targetUser?.displayName}
                    className="w-32 h-32 rounded-full object-cover ring-4 ring-[#E89CAE]/60 shadow-2xl mx-auto"
                  />
                  {callState === 'connected' && (
                    <span className="absolute inset-0 rounded-full ring-4 ring-[#B8A7EA] animate-pulse-ring" />
                  )}
                </div>
                <h3 className="font-display font-bold text-2xl text-white tracking-tight">
                  {targetUser?.displayName}
                </h3>
                <p className="text-xs text-white/70 font-medium flex items-center justify-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-[#E89CAE]" />
                  <span>{callState === 'outgoing' ? 'Calling...' : callState === 'ended' ? 'Call Ended' : 'Aura HD Voice Active'}</span>
                </p>
              </div>
            )}
          </div>

          {/* Header Tag */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="px-4 py-2 rounded-2xl glass-panel text-xs font-semibold text-[#2A2624] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#98B09A] animate-ping" />
              <span>{targetUser?.displayName}</span>
            </div>

            <span className="px-3 py-1 rounded-xl bg-white/20 backdrop-blur-md text-white text-[11px] font-medium">
              WebRTC Peer Connection
            </span>
          </div>

          {/* Local PIP Video Preview */}
          {callType === 'video' && (
            <div className="absolute top-6 right-6 w-36 h-48 rounded-2xl overflow-hidden ring-2 ring-white/80 shadow-2xl z-20 bg-black">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* In-Call Controls Bar */}
          <div className="relative z-10 flex items-center justify-center gap-4">
            <button
              onClick={toggleAudio}
              className={`p-4 rounded-2xl backdrop-blur-md transition-all ${
                isAudioMuted ? 'bg-red-500 text-white' : 'bg-white/30 text-white hover:bg-white/50'
              }`}
              title={isAudioMuted ? 'Unmute' : 'Mute'}
            >
              {isAudioMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {callType === 'video' && (
              <button
                onClick={toggleVideo}
                className={`p-4 rounded-2xl backdrop-blur-md transition-all ${
                  isVideoOff ? 'bg-red-500 text-white' : 'bg-white/30 text-white hover:bg-white/50'
                }`}
                title={isVideoOff ? 'Turn Video On' : 'Turn Video Off'}
              >
                {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
              </button>
            )}

            <button
              onClick={endCall}
              className="p-4 rounded-2xl bg-red-500 text-white hover:bg-red-600 transition-all shadow-lg hover:scale-105 active:scale-95"
              title="End Call"
            >
              <PhoneOff className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
