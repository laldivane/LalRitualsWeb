'use client';

import { Ritual } from '@/lib/types';
import RitualPlayer from '@/components/RitualPlayer';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function RitualView({ ritual }: { ritual: Ritual }) {
  const coverSrc = typeof ritual.coverImage === 'string' ? ritual.coverImage : '/placeholder.png';
  const formattedDate = new Date(ritual.releaseDate).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="relative min-h-screen">
      {/* Cinematic Background Blur */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <Image
          src={coverSrc}
          alt={`Atmospheric background for ${ritual.title}`}
          fill
          className="object-cover opacity-10 scale-125 blur-[120px]"
          priority
        />
        <div className="absolute inset-0 bg-void-deep/60" />
      </div>

      <div className="relative z-10 layout-container py-32 space-y-24">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-full flex flex-col items-center gap-20"
        >
          <div className="text-center space-y-6">
            <motion.p 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 1 }}
              className="font-terminal text-[10px] uppercase tracking-[0.5em] text-crimson drop-shadow-[0_0_8px_rgba(192,0,63,0.5)]"
            >
              {ritual.emotionalPhase.replace(/_/g, ' ')}
            </motion.p>
            
            <h1 className="font-display text-6xl font-light text-soft sm:text-8xl md:text-9xl tracking-tight leading-none px-4">
              {ritual.title}
            </h1>
            
            <div className="h-px w-24 bg-white/10 mx-auto" />
            
            <p className="font-terminal text-[10px] uppercase tracking-[0.3em] text-muted italic">
               Signal_Decoded // {formattedDate}
            </p>
          </div>

          {/* Focal Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 1.2, ease: "easeOut" }}
            className="relative w-full max-w-[540px] aspect-square border border-white/5 overflow-hidden bg-void-deep shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)] group"
          >
              <Image
                  src={coverSrc}
                  alt={ritual.title}
                  fill
                  className="object-cover transition-transform duration-2000 group-hover:scale-110"
                  priority
              />
              <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%]" />
              <div className="absolute inset-0 bg-gradient-to-t from-void-deep/60 via-transparent to-transparent pointer-events-none" />
          </motion.div>

          <RitualPlayer ritual={ritual} />
        </motion.div>

        {/* Narrative Section */}
        <div className="w-full max-w-[740px] mx-auto space-y-20">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center"
            >
                 <h2 className="mb-12 font-terminal text-[10px] uppercase tracking-[0.4em] text-muted/60">
                    // Transmission_Fragment
                </h2>
                <div className="space-y-2 font-display text-2xl leading-relaxed text-soft/70 border-l-2 border-crimson/20 pl-12 text-left italic">
                    {ritual.ritualText.map((p, i) => (
                        <p key={i} className={`animate-cinematic ${p.startsWith('[') ? 'text-crimson/50 text-xs font-terminal uppercase not-italic tracking-[0.2em] mt-8 mb-4' : ''}`} style={{ animationDelay: `${i * 0.05}s` }}>
                          {p}
                        </p>
                    ))}
                </div>
            </motion.div>

            <div className="pt-24 border-t border-white/5 flex flex-col items-center gap-12">
                 <div className="flex flex-col items-center gap-4 text-center">
                    <span className="font-terminal text-[9px] text-muted/40 uppercase tracking-widest italic">Proceed to deeper layers?</span>
                    <Link href="/void-map" className="terminal-btn">
                        NAVIGATE_VOID
                    </Link>
                 </div>
                 
                 <Link href="/" className="font-terminal text-[10px] uppercase tracking-[0.2em] text-muted hover:text-crimson transition-all">
                    [ RETURN_TO_ROOT ]
                </Link>
            </div>
        </div>
      </div>
    </div>
  );
}
