'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

interface RitualPlayerProps {
  title: string;
  audioUrl: string;
  emotionalPhase: string;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export default function RitualPlayer({ title, audioUrl, emotionalPhase }: RitualPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);

  // Blinking cursor
  useEffect(() => {
    const interval = setInterval(() => setCursorVisible((v) => !v), 530);
    return () => clearInterval(interval);
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      setIsLoaded(true);
    }
  }, []);

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  }, []);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    setCurrentTime(0);
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !audioRef.current || !duration) return;
    const rect = progressRef.current.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = ratio * duration;
  };

  // ASCII progress bar
  const barLength = 40;
  const filled = duration > 0 ? Math.round((currentTime / duration) * barLength) : 0;
  const progressBar = '█'.repeat(filled) + '░'.repeat(barLength - filled);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative bg-void-deep border border-border p-6 font-mono text-sm overflow-hidden"
    >
      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          background:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(192,0,63,0.15) 2px, rgba(192,0,63,0.15) 4px)',
        }}
      />

      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={audioUrl}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        preload="metadata"
      />

      {/* Terminal header */}
      <div className="relative z-10 space-y-4">
        {/* Status line */}
        <div className="flex items-center gap-2 text-[8px] tracking-[0.4em] text-muted uppercase">
          <div className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-crimson animate-pulse' : 'bg-muted'}`} />
          <span>Ritual Player v1.0</span>
          <span className="text-border">•</span>
          <span className="text-crimson">{emotionalPhase.replace(/_/g, ' ')}</span>
        </div>

        {/* Title */}
        <div className="text-soft text-base tracking-wider">
          &gt; NOW LOADING: <span className="text-gold">{title}</span>
          <span className={`${cursorVisible ? 'opacity-100' : 'opacity-0'} text-crimson ml-0.5 transition-opacity`}>▌</span>
        </div>

        {/* Progress bar - clickable */}
        <div
          ref={progressRef}
          onClick={handleSeek}
          className="cursor-pointer select-none text-[11px] leading-none tracking-[1px] hover:opacity-80 transition-opacity"
          role="progressbar"
          aria-valuenow={currentTime}
          aria-valuemin={0}
          aria-valuemax={duration}
          aria-label="Seek audio"
        >
          <span className="text-crimson">[</span>
          <span className="text-text-body">{progressBar}</span>
          <span className="text-crimson">]</span>
        </div>

        {/* Time display */}
        <div className="flex items-center justify-between text-[10px] text-muted tracking-wider">
          <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
          <span className="text-border">
            {isPlaying ? '▶ TRANSMITTING' : '■ STANDBY'}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={togglePlay}
            disabled={!isLoaded && !audioUrl}
            className="px-4 py-1.5 border border-crimson text-crimson text-[9px] tracking-[0.4em] uppercase
                       hover:bg-crimson hover:text-void-deep transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {isPlaying ? '[PAUSE]' : '[PLAY]'}
          </button>

          {audioUrl && (
            <a
              href={audioUrl}
              download
              className="px-4 py-1.5 border border-muted text-muted text-[9px] tracking-[0.4em] uppercase
                         hover:border-gold hover:text-gold transition-all duration-200"
            >
              [DOWNLOAD]
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
