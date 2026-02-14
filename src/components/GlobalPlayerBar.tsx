'use client';

import { usePlayer } from '@/lib/PlayerContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Music } from 'lucide-react';
import Image from 'next/image';
import { urlForImage } from '@/sanity/lib/image';
import { usePathname } from 'next/navigation';

export default function GlobalPlayerBar() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    togglePlay,
    nextTrack,
    prevTrack,
    isMounted
  } = usePlayer();

  const pathname = usePathname();

  // Hide the global bar if we are on the home page (where the full player lives)
  // or if there is no track selected yet.
  const isPlayerPage = pathname === '/player';
  
  if (!isMounted || !currentTrack) return null;
  if (isPlayerPage) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-0 left-0 right-0 z-[120] bg-void-dark/80 backdrop-blur-xl border-t border-white/5 px-6 h-20 flex items-center gap-6"
    >
      <div className="flex items-center gap-4 w-1/3">
        <div className="relative h-12 w-12 flex-shrink-0 bg-void-deep border border-white/10 overflow-hidden rounded-sm">
          {currentTrack.coverImage && (
            <Image 
              src={typeof currentTrack.coverImage === 'string' ? currentTrack.coverImage : urlForImage(currentTrack.coverImage).url()} 
              alt="" fill className="object-cover"
            />
          )}
        </div>
        <div className="overflow-hidden">
          <p className="text-[10px] uppercase tracking-widest text-soft truncate font-medium">
            {currentTrack.title}
          </p>
          <p className="text-[8px] text-muted uppercase tracking-tighter truncate">
            {currentTrack.emotionalPhase?.replace(/_/g, ' ')}
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center gap-2">
        <div className="flex items-center gap-6">
          <button 
            onClick={prevTrack} 
            className="text-muted/80 hover:text-crimson transition-colors p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Previous ritual"
          >
            <SkipBack size={16} />
          </button>
          <button 
            onClick={togglePlay}
            className="h-10 w-10 rounded-full border border-crimson/30 flex items-center justify-center hover:bg-crimson/10 hover:border-crimson transition-all text-crimson"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
          </button>
          <button 
            onClick={nextTrack} 
            className="text-muted/80 hover:text-crimson transition-colors p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Next ritual"
          >
            <SkipForward size={16} />
          </button>
        </div>
        <div 
          className="w-full max-w-md h-1 bg-white/5 rounded-full overflow-hidden"
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Ritual progress"
        >
          <div 
            className="h-full bg-crimson shadow-[0_0_10px_#c0003f]" 
            style={{ width: `${progress}%` }} 
          />
        </div>
      </div>

      <div className="w-1/3 flex justify-end">
        <div className="flex items-center gap-2 text-crimson/40 animate-pulse">
            <div className="h-1 shadow-glow w-1 rounded-full bg-crimson" />
            <span className="text-[8px] uppercase font-terminal tracking-widest">Ritual_SyncING</span>
        </div>
      </div>
    </motion.div>
  );
}
