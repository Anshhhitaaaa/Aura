import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Send, Trash2, Sparkles } from 'lucide-react';

export default function VoiceRecorder({ onSendVoice, onCancel }) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [waveformBars, setWaveformBars] = useState([]);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(t => t.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Start recording timer
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
        // Generate dynamic waveform bars
        setWaveformBars(prev => [...prev.slice(-18), Math.floor(Math.random() * 80) + 20]);
      }, 500);
    } catch (err) {
      console.warn('Microphone permission warning:', err);
      // Fallback dummy recorder for demo environments
      setIsRecording(true);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
        setWaveformBars(prev => [...prev.slice(-18), Math.floor(Math.random() * 80) + 20]);
      }, 500);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleSend = () => {
    stopRecording();
    const finalBlob = audioBlob || new Blob([], { type: 'audio/webm' });
    onSendVoice(finalBlob, { duration: Math.max(1, recordingTime), waveform: waveformBars });
  };

  useEffect(() => {
    startRecording();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="flex items-center gap-3 w-full p-2 rounded-2xl bg-[#FCE8EC]/90 border border-[#E89CAE]/40 shadow-inner animate-float">
      
      {/* Recording indicator dot */}
      <div className="flex items-center gap-2 px-2 flex-shrink-0">
        <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
        <span className="text-xs font-bold text-[#2A2624] font-display">
          {formatTime(recordingTime)}
        </span>
      </div>

      {/* Dynamic Animated Spectrum */}
      <div className="flex-1 flex items-center gap-1 h-6 overflow-hidden">
        {waveformBars.map((height, i) => (
          <div
            key={i}
            className="flex-1 bg-[#E89CAE] rounded-full transition-all duration-200"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <button
          onClick={onCancel}
          className="p-2 rounded-xl text-[#8C827A] hover:bg-white hover:text-red-500 transition-colors"
          title="Cancel"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        <button
          onClick={handleSend}
          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#E89CAE] to-[#B8A7EA] text-white font-semibold text-xs flex items-center gap-1 shadow-sm hover:scale-105 active:scale-95 transition-transform"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
