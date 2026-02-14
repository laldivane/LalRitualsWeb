'use client';

import { useState, useRef, useEffect } from 'react';
import { Ritual } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Square, Loader2, Volume2, Shield } from 'lucide-react';

interface RitualPlayerProps {
  ritual: Ritual;
}

export default function RitualPlayer({ ritual }: RitualPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [bars, setBars] = useState<number[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Generate bars on mount to avoid hydration mismatch
    setBars(Array.from({ length: 32 }, () => Math.random()));
  }, []);

  useEffect(() => {
    setIsPlaying(false);
    setProgress(0);
  }, [ritual.id]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(e => console.error("Playback failed", e));
        }
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      if (!isNaN(total)) {
        setDuration(total);
        setProgress((current / total) * 100);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const seekTime = (Number(e.target.value) / 100) * audioRef.current.duration;
      audioRef.current.currentTime = seekTime;
      setProgress(Number(e.target.value));
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="w-full max-w-3xl border border-white/5 bg-void-card/60 backdrop-blur-2xl p-8 md:p-12 relative overflow-hidden group shadow-2xl"
    >
      <div className="absolute top-0 right-0 p-4 font-terminal text-[8px] text-muted/20 select-none group-hover:text-crimson/20 transition-colors">
        DECRYPTING_SIGNAL_0X{ritual.id.split('-')[1]}...
      </div>
      
      <audio
        ref={audioRef}
        src={ritual.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        onLoadedMetadata={handleTimeUpdate}
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => setIsBuffering(false)}
      />

      <div className="mb-12 flex items-end justify-between border-b border-white/10 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <motion.div 
               animate={isPlaying ? { 
                 scale: [1, 1.2, 1],
                 opacity: [0.4, 1, 0.4],
                 boxShadow: ["0 0 5px #c0003f", "0 0 20px #c0003f", "0 0 5px #c0003f"]
               } : {}}
               transition={{ duration: 2, repeat: Infinity }}
               className="h-2 w-2 rounded-full bg-crimson" 
             />
             <span className="font-terminal text-[10px] uppercase tracking-[0.3em] text-soft">
               STATUS: {isPlaying ? 'EMITTING' : 'IDLE'}
             </span>
          </div>
          <p className="font-terminal text-[11px] text-muted italic">
            {ritual.emotionalPhase.replace(/_/g, ' ')}
          </p>
        </div>
        
        <div className="text-right hidden sm:block">
           <Volume2 size={12} className="text-muted/40 mb-2 ml-auto" />
           <span className="font-terminal text-[9px] uppercase tracking-tighter text-muted/30">
             Frequency_Locked_Secure
           </span>
        </div>
      </div>

      <div className="mb-10 h-14 flex items-end justify-center gap-1.5 opacity-40">
        {bars.map((v, i) => (
          <motion.div 
            key={i}
            animate={{ 
              height: isPlaying ? [10, v * 40 + 10, 10] : 10,
              backgroundColor: isPlaying ? ["#c0003f", "#8a7a7a", "#c0003f"] : "#2a1a1f"
            }}
            transition={{ 
              duration: 0.8 + v, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-1 rounded-full"
          />
        ))}
      </div>

      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-8">
          <button 
            onClick={togglePlay}
            className="relative flex h-16 w-16 items-center justify-center rounded-full border border-crimson/30 hover:border-crimson hover:bg-crimson/10 transition-all duration-500 group/btn"
          >
            <AnimatePresence mode="wait">
              {isBuffering ? (
                <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Loader2 className="animate-spin text-crimson" size={24} />
                </motion.div>
              ) : isPlaying ? (
                <motion.div key="stop" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
                  <Square className="fill-crimson text-crimson" size={20} />
                </motion.div>
              ) : (
                <motion.div key="play" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
                  <Play className="fill-crimson text-crimson ml-1" size={24} />
                </motion.div>
              )}
            </AnimatePresence>
            <div className="absolute -inset-2 bg-crimson/5 blur-xl group-hover/btn:bg-crimson/10 transition-colors -z-10 rounded-full" />
          </button>

          <div className="flex-1 space-y-3">
             <div className="flex justify-between font-terminal text-[10px] tracking-widest text-muted/60">
                <span className="text-crimson/80 uppercase">Deciphering_Data...</span>
                <span>{formatTime(audioRef.current?.currentTime || 0)} / {formatTime(duration)}</span>
             </div>
             
             <div className="relative pt-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={handleSeek}
                  className="absolute inset-x-0 -top-1 z-30 w-full h-4 opacity-0 cursor-pointer"
                />
                <div className="h-2 w-full bg-black/40 border border-white/5 rounded-full overflow-hidden relative">
                   <motion.div 
                     className="h-full bg-crimson shadow-[0_0_15px_#c0003f]" 
                     style={{ width: `${progress}%` }} 
                   />
                </div>
             </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-8 border-t border-white/5">
           <div className="flex items-center gap-4">
              <Shield size={10} className="text-crimson/40" />
              <span className="font-terminal text-[8px] uppercase tracking-widest text-muted/40 hover:text-muted/80 transition-colors cursor-default">
                Source: Encrypted_GitHub_Storage
              </span>
           </div>
           
           <button className="font-terminal text-[9px] uppercase tracking-[0.2em] text-muted/40 hover:text-crimson transition-all border-b border-white/10 hover:border-crimson pb-1 px-1">
             Download_Fragment
           </button>
        </div>
      </div>
    </motion.div>
  );
}
