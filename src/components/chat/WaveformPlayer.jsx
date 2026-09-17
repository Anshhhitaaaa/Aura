import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

export default function WaveformPlayer({ audioUrl, duration = 10, waveform = [] }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);

  // Generate fallback waveform height bars if none supplied
  const barHeights = waveform.length > 0
    ? waveform
    : [30, 60, 90, 40, 70, 100, 50, 85, 30, 65, 45, 90, 75, 40, 80, 55, 35, 95];

  useEffect(() => {
    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      if (audio.duration) {
        const currentProgress = (audio.currentTime / audio.duration) * 100;
        setProgress(currentProgress);
        setCurrentTime(audio.currentTime);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioUrl]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(err => console.warn('Audio play error:', err));
      setIsPlaying(true);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/70 border border-white/80 shadow-xs max-w-xs">
      {/* Play/Pause Button */}
      <button
        onClick={togglePlay}
        className="w-9 h-9 rounded-full bg-gradient-to-r from-[#E89CAE] to-[#B8A7EA] text-white flex items-center justify-center shadow-xs hover:scale-105 active:scale-95 transition-transform flex-shrink-0"
      >
        {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
      </button>

      {/* Waveform Bar Spectrum */}
      <div className="flex-1 flex items-center gap-1 h-8">
        {barHeights.map((height, i) => {
          const barProgress = (i / barHeights.length) * 100;
          const isPlayed = barProgress <= progress;

          return (
            <div
              key={i}
              className="flex-1 rounded-full transition-all duration-150"
              style={{
                height: `${Math.max(20, height)}%`,
                backgroundColor: isPlayed ? '#E89CAE' : '#E1DAD0',
              }}
            />
          );
        })}
      </div>

      {/* Time Indicator */}
      <span className="text-[10px] font-semibold text-[#8C827A] flex-shrink-0">
        {formatTime(isPlaying ? currentTime : duration)}
      </span>
    </div>
  );
}
