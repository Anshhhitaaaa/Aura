import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc 
} from 'firebase/firestore';
import { db, isDemoMode } from '../config/firebase';
import { useAuth } from './AuthContext';

const CallContext = createContext();

export const useCall = () => useContext(CallContext);

const STUN_SERVERS = {
  iceServers: [
    { urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'] }
  ]
};

export const CallProvider = ({ children }) => {
  const { currentUser } = useAuth();
  
  // Call States: 'idle' | 'outgoing' | 'incoming' | 'connected' | 'ended'
  const [callState, setCallState] = useState('idle');
  const [callType, setCallType] = useState('video'); // 'video' | 'voice'
  const [targetUser, setTargetUser] = useState(null);
  
  // Media States
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  
  // Media Streams
  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const ringAudioRef = useRef(null);

  // Sound Synthesizer via Web Audio API for soft ringtone
  const playRingtone = (type = 'incoming') => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      let osc = ctx.createOscillator();
      let gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(type === 'incoming' ? 440 : 350, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      ringAudioRef.current = { ctx, osc };

      setTimeout(() => {
        try {
          osc.stop();
          ctx.close();
        } catch(e) {}
      }, 2500);
    } catch(e) {
      console.warn('AudioContext ringtone warning:', e);
    }
  };

  const stopRingtone = () => {
    if (ringAudioRef.current) {
      try {
        ringAudioRef.current.osc?.stop();
        ringAudioRef.current.ctx?.close();
      } catch(e) {}
      ringAudioRef.current = null;
    }
  };

  // Start Local Media Stream (Camera / Microphone)
  const startLocalStream = async (videoRequired = true) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: videoRequired ? { width: 1280, height: 720 } : false,
        audio: true
      });
      localStreamRef.current = stream;
      return stream;
    } catch (err) {
      console.warn('Camera/Mic permission warning, using canvas fallback stream:', err);
      // Create a canvas stream fallback if no webcam is available
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#E89CAE';
      ctx.fillRect(0, 0, 640, 480);
      ctx.fillStyle = '#2A2624';
      ctx.font = '24px Space Grotesk';
      ctx.fillText('Aura Video Stream', 200, 240);

      const stream = canvas.captureStream(30);
      localStreamRef.current = stream;
      return stream;
    }
  };

  // Initiate Outgoing Call
  const initiateCall = async (user, type = 'video') => {
    setTargetUser(user);
    setCallType(type);
    setCallState('outgoing');
    setIsAudioMuted(false);
    setIsVideoOff(type === 'voice');

    playRingtone('outgoing');
    const localStream = await startLocalStream(type === 'video');

    if (isDemoMode) {
      // In Demo Mode, simulate target accepting call after 2.5 seconds
      setTimeout(() => {
        stopRingtone();
        remoteStreamRef.current = localStream; // Loopback local stream for immediate crisp video demo
        setCallState('connected');
      }, 2500);
    } else {
      // Production WebRTC + Firestore Signaling logic
      try {
        const pc = new RTCPeerConnection(STUN_SERVERS);
        peerConnectionRef.current = pc;

        localStream.getTracks().forEach(track => pc.addTrack(track, localStream));

        pc.ontrack = (event) => {
          remoteStreamRef.current = event.streams[0];
        };

        const callDocRef = doc(collection(db, 'calls'));
        const callerCandidates = collection(callDocRef, 'callerCandidates');
        const calleeCandidates = collection(callDocRef, 'calleeCandidates');

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            addDoc(callerCandidates, event.candidate.toJSON());
          }
        };

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        const callData = {
          callerId: currentUser.uid,
          callerName: currentUser.displayName,
          callerAvatar: currentUser.avatar,
          receiverId: user.uid,
          type,
          offer: { type: offer.type, sdp: offer.sdp },
          status: 'outgoing',
          createdAt: new Date().toISOString()
        };

        await setDoc(callDocRef, callData);

        // Listen for Answer
        onSnapshot(callDocRef, (snapshot) => {
          const data = snapshot.data();
          if (data?.answer && !pc.currentRemoteDescription) {
            stopRingtone();
            const answer = new RTCSessionDescription(data.answer);
            pc.setRemoteDescription(answer);
            setCallState('connected');
          }
        });

        // Listen for Callee Candidates
        onSnapshot(calleeCandidates, (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
              pc.addIceCandidate(new RTCIceCandidate(change.doc.data()));
            }
          });
        });
      } catch (err) {
        console.error('WebRTC offer error:', err);
        setCallState('idle');
      }
    }
  };

  // Simulate Incoming Call (Triggerable for testing or demo)
  const simulateIncomingCall = (caller, type = 'video') => {
    setTargetUser(caller);
    setCallType(type);
    setCallState('incoming');
    playRingtone('incoming');
  };

  // Accept Incoming Call
  const acceptCall = async () => {
    stopRingtone();
    const localStream = await startLocalStream(callType === 'video');

    if (isDemoMode) {
      remoteStreamRef.current = localStream;
      setCallState('connected');
    } else {
      setCallState('connected');
    }
  };

  // Reject / End Call
  const endCall = () => {
    stopRingtone();
    
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(t => t.stop());
      localStreamRef.current = null;
    }

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    remoteStreamRef.current = null;
    setCallState('ended');

    setTimeout(() => {
      setCallState('idle');
      setTargetUser(null);
    }, 1000);
  };

  // Toggle Audio Mute
  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioMuted(!audioTrack.enabled);
      }
    }
  };

  // Toggle Video Off/On
  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };

  const value = {
    callState,
    callType,
    targetUser,
    isAudioMuted,
    isVideoOff,
    localStreamRef,
    remoteStreamRef,
    initiateCall,
    simulateIncomingCall,
    acceptCall,
    endCall,
    toggleAudio,
    toggleVideo,
  };

  return <CallContext.Provider value={value}>{children}</CallContext.Provider>;
};
