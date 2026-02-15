'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Hash, Activity, Music, Maximize2, Minimize2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { urlForImage } from '@/sanity/lib/image';
import { LyricLine } from '@/lib/types';
import { usePlayer } from '@/lib/PlayerContext';
import Visualizer from './Visualizer';

export default function VoidPlayer() {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile(); // Check on mount
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const {
    rituals,
    currentTrackIndex,
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    frequencyData,
    isMounted,
    setCurrentTrackIndex,
    togglePlay,
    nextTrack,
    prevTrack,
    seek,
    activeLyric,
    visualizerMode,
    setVisualizerMode,
    showCoverArt,
    setShowCoverArt
  } = usePlayer();

  const lyricsContainerRef = useRef<HTMLDivElement | null>(null);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsFullScreen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  /* Manual Color Overrides */
  const MANUAL_COLOR_OVERRIDES: Record<string, string> = {
    'zehir': '#87e8a8', // Brightest green from the provided palette
    'hatalarım': '#ccad73', // Gold/Beige from the provided palette
    'hatalarim': '#ccad73'
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = (Number(e.target.value) / 100) * duration;
    seek(seekTime);
  };

  /* Helper to get Image URL */
  const coverUrl = currentTrack?.coverImage 
    ? (typeof currentTrack.coverImage === 'string' ? currentTrack.coverImage : urlForImage(currentTrack.coverImage).url()) 
    : undefined;

  /* Helper to resolve color */
  const getActiveColor = () => {
      if (!currentTrack) return undefined;
      
      const lowerTitle = currentTrack.title.toLowerCase();
      for (const [key, color] of Object.entries(MANUAL_COLOR_OVERRIDES)) {
          if (lowerTitle.includes(key)) return color;
      }

      return currentTrack.primaryColor || 
             currentTrack.vibrantColor || 
             currentTrack.darkVibrantColor || 
             currentTrack.lightVibrantColor || 
             currentTrack.secondaryColor || 
             currentTrack.mutedColor;
  };

  const activeColor = getActiveColor();

  return (
    <div className="flex flex-col lg:flex-row h-full w-full bg-void-deep text-soft overflow-hidden font-sans">
      <div className="mesh-gradient opacity-10" />

      {/* ─── SIDEBAR: TRACK LIST ─── */}
      <AnimatePresence initial={false}>
        {showSidebar && (
          <motion.aside 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: isMobile ? "100%" : 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 lg:static lg:z-auto lg:flex border-r border-white/5 bg-void-deep/95 lg:bg-void-dark/20 backdrop-blur-3xl lg:backdrop-blur-xl flex-col overflow-hidden"
          >
            <div className="w-full lg:w-80 h-full flex flex-col p-8 relative">
              <button 
                onClick={() => setShowSidebar(false)}
                className="lg:hidden absolute top-6 right-6 p-2 text-muted/50 hover:text-crimson transition-colors"
              >
                <Minimize2 size={20} />
              </button>
              <div className="mb-10 flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-crimson rounded-full animate-pulse" />
                  <h2 className="text-[10px] uppercase tracking-[0.6em] text-muted font-semibold">Queue</h2>
                </div>
                <span className="text-[9px] text-crimson/50 font-terminal tracking-wider">[{rituals.length}]</span>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar -mr-4">
                {rituals.map((ritual, index) => (
                  <button
                    key={ritual.id || ritual._id}
                    onClick={() => setCurrentTrackIndex(index)}
                    className={`w-full flex items-center gap-5 p-3 rounded-none transition-all duration-500 text-left group border-l-2 ${
                      currentTrackIndex === index 
                      ? 'bg-crimson/[0.03] border-crimson' 
                      : 'border-transparent hover:bg-white/[0.02] hover:border-white/10'
                    }`}
                  >
                    <div className="relative h-10 w-10 flex-shrink-0 bg-void-deep overflow-hidden">
                       {ritual.coverImage && (
                         <Image 
                          src={typeof ritual.coverImage === 'string' ? ritual.coverImage : urlForImage(ritual.coverImage).url()} 
                          alt="" fill className={`object-cover transition-all duration-1000 ${currentTrackIndex === index ? 'grayscale-0' : 'grayscale opacity-40 group-hover:opacity-100 group-hover:grayscale-0'}`} />
                       )}
                       {currentTrackIndex === index && isPlaying && (
                          <div className="absolute inset-0 bg-void-deep/60 flex items-center justify-center">
                              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity }}>
                                  <Music size={10} className="text-crimson" />
                              </motion.div>
                          </div>
                       )}
                    </div>

                    <div className="flex-1 overflow-hidden">
                      <p className={`text-[11px] truncate uppercase tracking-[0.2em] font-medium transition-colors duration-500 ${currentTrackIndex === index ? 'text-crimson' : 'text-soft/70 group-hover:text-soft'}`}>
                        {ritual.title}
                      </p>
                      <p className="text-[8px] text-muted/60 uppercase tracking-widest mt-1">{ritual.emotionalPhase?.replace(/_/g, ' ')}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-white/5 space-y-6">
                 <Link href="/rituals" className="flex items-center gap-3 text-[9px] text-muted/60 hover:text-crimson transition-all tracking-[0.4em] uppercase group">
                    <Hash size={10} className="group-hover:rotate-90 transition-transform duration-500" />
                    Return_To_Base
                 </Link>
                 <div className="p-4 bg-crimson/[0.02] border border-crimson/10">
                    <p className="text-[8px] text-crimson/60 leading-relaxed uppercase tracking-[0.2em]">
                      System_Status: Stable<br/>Connect: Encrypted<br/>Node: 0xLAL_DIVANE
                    </p>
                 </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ─── MAIN: DISPLAY ─── */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {!currentTrack ? (
          <div className="flex-1 flex items-center justify-center font-terminal text-[10px] uppercase tracking-[1em] text-crimson/20 animate-pulse">
            Sync_Void_Protocol
          </div>
        ) : (
          <>
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 sm:p-8 lg:p-24 text-center overflow-hidden">
            <div className="flex flex-col lg:flex-row w-full h-full items-center justify-center gap-8 sm:gap-16 lg:gap-32">
                {/* Art & Info */}
                <div className="flex flex-col items-center w-full max-w-[260px] sm:max-w-[340px] lg:max-w-[400px] aspect-square relative justify-center group">
                    {/* Visualizer Background */}
                    <div className="absolute inset-[-10%] pointer-events-none z-0 opacity-80">
                        {isMounted && <Visualizer data={frequencyData} imageUrl={coverUrl} color={activeColor} />}
                    </div>

                    {/* Circular Cover Art */}
                    <AnimatePresence mode="wait">
                        {showCoverArt && currentTrack?.coverImage && (
                            <motion.div 
                                key={(currentTrack?.id || currentTrack?._id) + '_art'}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                className="relative w-[46%] aspect-square rounded-full border border-white/10 bg-void-dark shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden z-10"
                            >
                                  <Image 
                                    src={coverUrl || ''} 
                                    alt="" 
                                    fill 
                                    className="object-cover" 
                                    priority 
                                  />
                                <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/10" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>



                {/* Lyrics Side Panel */}
                <motion.div 
                    key={(currentTrack?.id || currentTrack?._id) + '_lyrics'}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 1 }}
                    className="flex-1 w-full max-w-md h-full min-h-0 lg:border-l border-white/5 lg:pl-24 flex flex-col text-left"
                >
                    <div className="mb-6 sm:mb-12 flex items-center gap-4">
                        <div className="h-px w-8 bg-crimson/30" />
                        <h2 className="text-[10px] uppercase tracking-[0.6em] text-muted/60 font-semibold">Transmission</h2>
                    </div>
                    <div 
                        ref={lyricsContainerRef}
                        className="flex-1 overflow-y-auto custom-scrollbar pr-4 sm:pr-6 space-y-3 sm:space-y-4 font-classic text-base sm:text-lg md:text-xl text-soft/60 leading-relaxed scroll-smooth"
                    >
                        {(currentTrack?.ritualText || []).map((line: string, i: number) => {
                            if (!line) return null;
                            const isTechnical = line.startsWith('[');
                            
                            return (
                                <p 
                                    key={i} 
                                    className={`transition-all duration-700 ${
                                        isTechnical
                                        ? 'text-crimson/60 text-[10px] font-sans uppercase tracking-[0.4em] pt-6 sm:pt-8' 
                                        : 'hover:text-soft/90 cursor-default'
                                    }`}
                                >
                                    {line}
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
        <footer className={`min-h-[120px] sm:min-h-[128px] border-t border-white/5 bg-void-dark/60 backdrop-blur-3xl px-4 sm:px-8 lg:px-12 py-4 sm:py-0 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-10 relative z-20 transition-all duration-500`}>
             {/* Track Info */}
             <div className={`hidden ${showSidebar ? 'xl:flex' : 'lg:flex'} flex-col items-start min-w-[160px] max-w-[240px]`}>
                <p className="text-crimson text-[8px] uppercase tracking-[0.5em] font-semibold mb-1">Current_Ritual</p>
                <h2 className="font-display text-lg text-soft tracking-tight truncate w-full group-hover:text-crimson transition-colors duration-500 italic">
                  {currentTrack?.title}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[8px] text-muted/60 uppercase tracking-[0.2em] font-medium italic">{currentTrack?.emotionalPhase?.replace(/_/g, ' ')}</span>
                </div>
             </div>

             <div className="w-full sm:flex-1 flex flex-col sm:flex-row items-center gap-4 sm:gap-10">
                <div className="flex items-center gap-8 sm:gap-6">
                  <button onClick={prevTrack} className="text-muted/50 hover:text-crimson transition-all active:scale-90"><SkipBack size={18} className="sm:w-3.5 sm:h-3.5" /></button>
                  <button 
                    onClick={togglePlay}
                    className="h-14 w-14 sm:h-14 sm:w-14 rounded-full border border-crimson/30 flex items-center justify-center hover:border-crimson transition-all text-crimson bg-crimson/5 active:scale-95"
                  >
                    {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
                  </button>
                  <button onClick={nextTrack} className="text-muted/50 hover:text-crimson transition-all active:scale-90"><SkipForward size={18} className="sm:w-3.5 sm:h-3.5" /></button>
                </div>

                <div className="w-full sm:flex-1 flex flex-col gap-3">
                   <div className="flex justify-between text-[10px] sm:text-[8px] uppercase tracking-[0.3em] sm:tracking-[0.5em] text-muted/70 font-terminal">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                   </div>
                   <div className="relative h-1 sm:h-px bg-white/10 overflow-hidden group rounded-full">
                      <div 
                        className="h-full bg-crimson transition-all duration-100 shadow-[0_0_8px_rgba(192,0,63,0.6)]" 
                        style={{ width: `${progress}%` }} 
                      />
                      <input 
                        type="range" min="0" max="100" value={progress} onChange={handleSeek}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-6 -top-2.5"
                      />
                   </div>
                </div>
             </div>

              <div className="flex items-center gap-4 sm:gap-8">
                 {/* Mobile: compact fullscreen button */}
                 <button
                   onClick={() => setIsFullScreen(true)}
                   className="md:hidden text-muted/50 hover:text-crimson transition-all p-2"
                   aria-label="Fullscreen"
                 >
                   <Maximize2 size={18} />
                 </button>

                 {/* Desktop: full config panel */}
                 <div className="hidden md:flex flex-col items-end gap-2">
                    <span className="text-[8px] uppercase tracking-[0.5em] text-muted/40">Display_Config</span>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => setShowSidebar(!showSidebar)}
                        className={`text-[8px] px-2 py-1 border transition-all uppercase tracking-widest ${showSidebar ? 'bg-crimson border-crimson text-black font-bold' : 'border-white/5 text-muted/50 hover:border-crimson/20'}`}
                      >
                        {showSidebar ? 'QUEUE_ACTIVE' : 'SHOW_QUEUE'}
                      </button>
                      <button
                        onClick={() => setShowCoverArt(!showCoverArt)}
                        className={`text-[8px] px-2 py-1 border transition-all uppercase tracking-widest ${!showCoverArt ? 'bg-crimson border-crimson text-black font-bold' : 'border-white/5 text-muted/50 hover:border-crimson/20'}`}
                      >
                        {showCoverArt ? 'GALLERY' : 'FOCUS'}
                      </button>
                      <button
                        onClick={() => setIsFullScreen(true)}
                        className="text-[8px] px-2 py-1 border border-white/5 text-muted/50 hover:border-crimson/20 transition-all uppercase tracking-widest flex items-center gap-2"
                      >
                        <Maximize2 size={8} />
                        FULL
                      </button>
                    </div>
                 </div>
              </div>
        </footer>
      </main>

      {/* ─── FULLSCREEN VISUALIZER OVERLAY ─── */}
      <AnimatePresence>
        {isFullScreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-void-deep flex items-center justify-center p-12 overflow-hidden"
          >
            <div className="mesh-gradient opacity-30" />
            
            <div className="w-full h-full max-w-5xl max-h-[85vh] relative group flex items-center justify-center">
              <Visualizer data={frequencyData} imageUrl={coverUrl} color={activeColor} />
              
              {/* Cover Art in Center Circle */}
              {currentTrack?.coverImage && (
                 <div className="absolute w-[44%] aspect-square rounded-full overflow-hidden z-0 shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/10">
                    <div className="relative w-full h-full">
                        <Image 
                            src={coverUrl || ''} 
                            alt="" 
                            fill 
                            className="object-cover" 
                        />
                    </div>
                 </div>
              )}
              
              {/* Exit Button */}
              <button
                onClick={() => setIsFullScreen(false)}
                className="absolute top-0 right-0 p-8 text-muted/20 hover:text-crimson transition-all z-50 group-hover:opacity-100 opacity-0"
              >
                <Minimize2 size={24} strokeWidth={1} />
              </button>
            </div>

            {/* Corner Decorative Elements */}
            {/* Corner Decorative Elements - Full Screen */}
            <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-crimson/30" />
            <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-crimson/30" />
            <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-crimson/30" />
            <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-crimson/30" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
