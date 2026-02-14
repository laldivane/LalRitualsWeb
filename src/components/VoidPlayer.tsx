'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Shield, Hash, Activity, Music } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { client } from '@/sanity/lib/client';
import { ritualsQuery } from '@/sanity/lib/queries';
import { urlForImage } from '@/sanity/lib/image';
import { Ritual, LyricLine } from '@/lib/types';

export default function VoidPlayer() {
  const [rituals, setRituals] = useState<any[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [waveformData, setWaveformData] = useState<number[]>(new Array(48).fill(0));
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    async function fetchRituals() {
      const data = await client.fetch(ritualsQuery);
      setRituals(data);
      setIsMounted(true);
    }
    fetchRituals();
  }, []);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  const currentTrack = rituals[currentTrackIndex];
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Initialize Web Audio API
  const initAudio = useCallback(() => {
    if (!audioContextRef.current && audioRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const context = new AudioContextClass();
      const analyser = context.createAnalyser();
      analyser.fftSize = 256; 
      
      const source = context.createMediaElementSource(audioRef.current);
      source.connect(analyser);
      analyser.connect(context.destination);
      
      audioContextRef.current = context;
      analyserRef.current = analyser;
      sourceRef.current = source;
    }
  }, []);

  useEffect(() => {
    const update = () => {
      if (analyserRef.current && isPlaying) {
        // Use Time Domain Data for Waveform
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteTimeDomainData(dataArray);
        
        const newWaveform = [];
        const step = Math.floor(dataArray.length / 48);
        for (let i = 0; i < 48; i++) {
          // Normalize sample (centered around 128)
          const amplitude = Math.abs(dataArray[i * step] - 128) / 128;
          newWaveform.push(amplitude);
        }
        setWaveformData(newWaveform);
        animationFrameRef.current = requestAnimationFrame(update);
      }
    };

    if (isPlaying) {
      animationFrameRef.current = requestAnimationFrame(update);
    } else {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    }
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying]);

  const togglePlay = () => {
    if (audioRef.current) {
      initAudio();
      if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume();
      }

      const nextPlayingState = !isPlaying;
      setIsPlaying(nextPlayingState);
      
      if (nextPlayingState) {
        audioRef.current.play().catch(e => console.error("Playback failed:", e));
      } else {
        audioRef.current.pause();
      }
    }
  };

  useEffect(() => {
    // Handling track change auto-play
    if (isPlaying && audioRef.current) {
        audioRef.current.play().catch(e => console.error("Auto-play failed:", e));
    }
  }, [currentTrackIndex, isPlaying]);

  const nextTrack = () => {
    const nextIdx = (currentTrackIndex + 1) % rituals.length;
    setCurrentTrackIndex(nextIdx);
    setCurrentTime(0);
    // Explicitly keeping it playing if it was playing, or starting if it was an auto-advance
    setIsPlaying(true);
  };

  const prevTrack = () => {
    const prevIdx = (currentTrackIndex - 1 + rituals.length) % rituals.length;
    setCurrentTrackIndex(prevIdx);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (!isNaN(audioRef.current.duration)) {
        setDuration(audioRef.current.duration);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const seekTime = (Number(e.target.value) / 100) * audioRef.current.duration;
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const activeLyricRef = useRef<HTMLParagraphElement | null>(null);

  const activeLyric = currentTrack?.syncedLyrics?.reduce((prev: LyricLine | null, curr: LyricLine) => {
    if (curr.time <= currentTime) {
      return curr;
    }
    return prev;
  }, null);

  useEffect(() => {
    if (activeLyricRef.current) {
      activeLyricRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activeLyric]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'l' && isPlaying) {
        console.log(`{ time: ${currentTime.toFixed(2)}, text: "" },`);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentTime, isPlaying]);

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatPreciseTime = (time: number) => {
    return time.toFixed(2);
  };

  return (
    <div className="flex flex-col lg:flex-row h-full w-full bg-void-deep text-soft overflow-hidden font-terminal">
      {/* ─── SIDEBAR: TRACK LIST ─── */}
      <aside className="hidden lg:flex w-80 border-r border-white/5 bg-void-dark/20 backdrop-blur-xl flex-col p-6 overflow-hidden">
        <div className="mb-8 flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <Activity size={14} className="text-crimson" />
            <h2 className="text-[10px] uppercase tracking-[0.4em] text-muted font-bold">Ritual_Queue</h2>
          </div>
          <span className="text-[9px] text-crimson/40 font-mono italic">{rituals.length}_FILES</span>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-1 pr-2 custom-scrollbar -mr-2">
          {rituals.map((ritual, index) => (
            <button
              key={ritual.id}
              onClick={() => {
                const sameTrack = currentTrackIndex === index;
                setCurrentTrackIndex(index);
                if (!sameTrack) {
                    setCurrentTime(0);
                    setWaveformData(new Array(48).fill(0));
                }
                setIsPlaying(true);
                initAudio();
              }}
              className={`w-full flex items-center gap-4 p-3 rounded-sm transition-all text-left group border border-transparent ${
                currentTrackIndex === index 
                ? 'bg-crimson/10 border-crimson/20 shadow-[0_0_15px_rgba(192,0,63,0.05)]' 
                : 'hover:bg-white/5 hover:border-white/5'
              }`}
            >
              <div className="text-[9px] font-mono text-muted w-4 opacity-50">
                {String(index + 1).padStart(2, '0')}
              </div>

              <div className="relative h-10 w-10 flex-shrink-0 bg-void-deep border border-white/10 overflow-hidden ring-1 ring-white/5">
                 {ritual.coverImage && (
                   <Image 
                    src={typeof ritual.coverImage === 'string' ? ritual.coverImage : urlForImage(ritual.coverImage).url()} 
                    alt="" fill className={`object-cover transition-all duration-700 ${currentTrackIndex === index ? 'grayscale-0 scale-110' : 'grayscale opacity-60 group-hover:opacity-100 group-hover:grayscale-0'}`} />
                 )}
                 {currentTrackIndex === index && isPlaying && (
                    <div className="absolute inset-0 bg-void-deep/40 flex items-center justify-center">
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 1 }}
                        >
                            <Music size={12} className="text-crimson" />
                        </motion.div>
                    </div>
                 )}
              </div>

              <div className="flex-1 overflow-hidden">
                <p className={`text-[10px] truncate uppercase tracking-widest font-medium ${currentTrackIndex === index ? 'text-crimson' : 'text-soft/70 group-hover:text-soft'}`}>
                  {ritual.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                    <p className="text-[7px] text-muted truncate uppercase tracking-tighter">{ritual.emotionalPhase?.replace(/_/g, ' ')}</p>
                    {currentTrackIndex === index && (
                        <span className="h-1 w-1 bg-crimson rounded-full animate-pulse" />
                    )}
                </div>
              </div>

              {currentTrackIndex === index && (
                <div className="text-[8px] font-mono text-crimson animate-pulse">
                    LVL_AC
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-white/5 flex flex-col gap-4">
           <Link href="/rituals" className="flex items-center gap-3 text-[9px] text-muted hover:text-soft transition-colors tracking-[0.2em] group">
              <Hash size={12} className="group-hover:text-crimson transition-colors" />
              VOICE_CORE_ROOT
           </Link>
           <div className="p-3 bg-crimson/10 border border-crimson/20 rounded-sm shadow-[0_0_15px_rgba(192,0,63,0.05)]">
              <p className="text-[8px] text-crimson leading-relaxed uppercase italic font-medium tracking-[0.1em]">
                System is synchronized with the void. Every ritual is a data packet. Do not interrupt the stream.
              </p>
           </div>
        </div>
      </aside>

      {/* ─── MAIN: DISPLAY ─── */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {!currentTrack ? (
          <div className="flex-1 flex items-center justify-center font-terminal text-[10px] uppercase tracking-[0.5em] text-crimson/40 animate-pulse">
            {"// Synchronizing_Ritual_Stream //"}
          </div>
        ) : (
          <>
            <audio
              ref={audioRef}
              src={currentTrack.audioUrl}
              onTimeUpdate={handleTimeUpdate}
              onEnded={nextTrack}
              onLoadedMetadata={handleTimeUpdate}
              crossOrigin="anonymous"
            />

        {/* Dynamic Background */}
        <div className="absolute inset-0 z-0 opacity-20 transition-all duration-1000">
           <div className={`absolute inset-0 bg-gradient-to-br from-crimson/20 via-transparent to-transparent`} />
           <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-crimson/10 blur-[150px] rounded-full" />
        </div>

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 sm:p-12 lg:p-20 text-center overflow-hidden">
            <div className="flex flex-col lg:flex-row w-full h-full items-center justify-center gap-12 lg:gap-32">
                {/* Art & Info */}
                <div className="flex flex-col items-center w-full max-w-[280px] sm:max-w-sm relative mt-10 lg:mt-20">
                    {/* Circular Visualizer Path */}
                    <div className="absolute inset-0 -m-8 pointer-events-none z-0">
                        {isMounted && (
                          <svg viewBox="0 0 120 120" className="w-full h-full transform -rotate-90">
                              {/* Outer Glow Ring */}
                              <circle 
                                  cx="60" cy="60" r="50" 
                                  fill="none" 
                                  stroke="currentColor" 
                                  strokeWidth="0.2" 
                                  className="text-crimson/5 opacity-50"
                              />
                            
                            {waveformData.map((v, i) => {
                                const angle = (i / waveformData.length) * Math.PI * 2;
                                const radius = 51;
                                const minHeight = 0.5;
                                const height = v * 8;
                                
                                const x1 = 60 + Math.cos(angle) * radius;
                                const y1 = 60 + Math.sin(angle) * radius;
                                const x2 = 60 + Math.cos(angle) * (radius + minHeight + height);
                                const y2 = 60 + Math.sin(angle) * (radius + minHeight + height);
                                
                                return (
                                    <line
                                        key={i}
                                        x1={x1} y1={y1}
                                        x2={x2} y2={y2}
                                        stroke="currentColor"
                                        strokeWidth="0.8"
                                        className="text-crimson"
                                        style={{
                                            opacity: 0.2 + v * 0.8,
                                            filter: `drop-shadow(0 0 2px rgba(192, 0, 63, ${v}))`,
                                        }}
                                    />
                                );
                            })}
                          </svg>
                        )}
                    </div>

                    <motion.div 
                    key={(currentTrack?.id || currentTrack?._id) + '_art'}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                    className="relative aspect-square w-full border border-white/10 bg-void-deep shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden group mb-12 z-10"
                    >
                        {currentTrack?.coverImage && (
                          <Image 
                            src={typeof currentTrack.coverImage === 'string' ? currentTrack.coverImage : urlForImage(currentTrack.coverImage).url()} 
                            alt="" fill className="object-cover" priority 
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-void-deep/60 to-transparent" />
                        <div className="absolute inset-0 border-[15px] border-void-deep/20 pointer-events-none" />
                    </motion.div>

                    <div className="space-y-4 z-10 text-center">
                        <motion.p 
                        key={(currentTrack?.id || currentTrack?._id) + '_phase'}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-crimson text-[10px] uppercase tracking-[0.5em] font-bold"
                        >
                        {currentTrack?.emotionalPhase?.replace(/_/g, ' ')}
                        </motion.p>
                        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-light text-soft tracking-tight">
                        {currentTrack?.title}
                        </h1>
                        <p className="font-display text-xs sm:text-sm italic text-muted max-w-sm mx-auto leading-relaxed opacity-80 line-clamp-2 md:line-clamp-none">
                        &quot;{currentTrack?.description}&quot;
                        </p>
                    </div>
                </div>

                {/* Lyrics Side Panel */}
                <motion.div 
                    key={(currentTrack?.id || currentTrack?._id) + '_lyrics'}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex-1 w-full max-w-md h-[250px] sm:h-[450px] border-t lg:border-t-0 lg:border-l border-white/5 pt-12 lg:pt-0 lg:pl-20 flex flex-col text-left"
                >
                    <div className="mb-8 flex items-center gap-3">
                        <Music size={14} className="text-crimson" />
                        <h2 className="text-[10px] uppercase tracking-[0.4em] text-muted">Transmission_Lyrics</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 space-y-4 font-display text-lg sm:text-xl italic text-soft/40 leading-relaxed scroll-smooth">
                        {((currentTrack?.syncedLyrics && currentTrack.syncedLyrics.length > 0) ? currentTrack.syncedLyrics : currentTrack?.ritualText || []).map((line: any, i: number) => {
                            const isString = typeof line === 'string';
                            const text = isString ? line : (line as LyricLine).text;
                            const isActive = activeLyric === line;
                            
                            return (
                                <p 
                                    key={i} 
                                    ref={isActive ? activeLyricRef : null}
                                    className={
                                        isActive 
                                        ? 'text-soft text-3xl not-italic scale-105 transition-all duration-700 origin-left opacity-100' 
                                        : isString && line.startsWith('[')
                                        ? 'text-crimson/50 text-xs font-terminal uppercase not-italic tracking-[0.2em] mt-8 mb-4 border-b border-crimson/10 pb-2' 
                                        : 'hover:text-soft transition-colors cursor-default'
                                    }
                                >
                                    {text}
                                </p>
                            );
                        })}
                    </div>
                </motion.div>
             </div>
          </div>
        </>
      )}

        {/* ─── CONTROLS: BOTTOM BAR ─── */}
        <footer className="h-40 sm:h-32 border-t border-white/5 bg-void-dark/40 backdrop-blur-2xl px-6 sm:px-12 flex flex-col sm:row items-center justify-center gap-6 sm:gap-12 relative z-20">
             <div className="w-full sm:flex-1 flex items-center gap-4 sm:gap-8">
                <div className="flex items-center gap-2 sm:gap-4">
                  <button onClick={prevTrack} className="text-muted hover:text-crimson transition-colors p-2">
                    <SkipBack size={18} />
                  </button>
                  <button 
                    onClick={togglePlay}
                    className="h-12 w-12 sm:h-14 sm:w-14 rounded-full border border-crimson/30 flex items-center justify-center hover:bg-crimson/10 hover:border-crimson transition-all text-crimson shadow-[0_0_15px_rgba(192,0,63,0.2)]"
                  >
                    {isPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" className="ml-1" />}
                  </button>
                  <button onClick={nextTrack} className="text-muted hover:text-crimson transition-colors p-2">
                    <SkipForward size={18} />
                  </button>
                </div>

                <div className="flex-1 space-y-2">
                   <div className="flex justify-between text-[9px] uppercase tracking-widest text-muted">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                   </div>
                   <div className="relative h-1 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-crimson shadow-[0_0_10px_#c0003f] transition-all duration-100 ease-linear" 
                        style={{ width: `${progress}%` }} 
                      />
                      <input 
                        type="range" 
                        min="0" max="100" 
                        value={progress} 
                        onChange={handleSeek}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full"
                      />
                   </div>
                </div>
             </div>

             <div className="flex items-center gap-6 border-l border-white/5 pl-12 h-16">
                <div className="hidden lg:block text-right">
                   <p className="text-[8px] uppercase text-muted tracking-widest mb-1">Live_Waveform_Sync</p>
                   <div className="flex items-center gap-2 justify-end">
                      <Shield size={10} className="text-crimson/40" />
                      <span className="text-[8px] uppercase text-crimson/40 italic">OSCILLOSCOPE_ACTIVE</span>
                   </div>
                </div>
             </div>
        </footer>
      </main>
    </div>
  );
}
