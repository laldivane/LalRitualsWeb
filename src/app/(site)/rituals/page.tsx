'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { client } from "@/sanity/lib/client";
import { ritualsQuery } from "@/sanity/lib/queries";
import { urlForImage } from "@/sanity/lib/image";
import { usePlayer } from "@/lib/PlayerContext";
import { Play, Pause, Activity, Moon, CloudRain, AlertTriangle, Zap, Wifi, Scissors, Link } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

import { Ritual } from "@/lib/types";

export default function RitualsIndex() {
  const [rituals, setRituals] = useState<Ritual[]>([]);
  const { setCurrentTrackIndex, isPlaying, currentTrackIndex } = usePlayer();

  useEffect(() => {
    async function fetchRituals() {
      const data = await client.fetch(ritualsQuery);
      setRituals(data);
    }
    fetchRituals();
  }, []);

  return (
    <div className="relative min-h-screen">
      <div className="mesh-gradient opacity-20" />
      
      <div className="layout-container py-32 md:py-48">
        <section className="relative mb-32 space-y-8 flex flex-col items-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                className="text-center"
            >
                <span className="font-terminal text-[10px] text-crimson tracking-[0.6em] uppercase mb-4 block">Archive_Index_v1.2</span>
                <h1 className="font-display text-7xl md:text-9xl font-light tracking-tight text-soft leading-none">
                    The <span className="italic text-crimson">Rituals</span>
                </h1>
                <div className="mt-8 h-px w-24 bg-crimson/30 mx-auto" />
            </motion.div>
        </section>

        <motion.div 
          variants={containerVariants as any}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24"
        >
          {rituals.map((ritual, index) => (
            <motion.div 
                key={ritual._id || ritual.id} 
                variants={itemVariants as any} 
                className="group relative cursor-none"
                whileHover={{ y: -10, transition: { duration: 0.4 } }}
            >
                {/* Index Number & Connection Line */}
                <div className="absolute -top-12 left-0 font-terminal text-[9px] text-muted/20 tracking-widest flex flex-col gap-2">
                    <span>PROTOCOL_0{index + 1}</span>
                    <div className="h-8 w-px bg-gradient-to-b from-transparent via-crimson/20 to-crimson/50" />
                </div>

                <div className="relative aspect-[3/4] overflow-hidden bg-void-dark border border-white/5 transition-all duration-700 group-hover:border-crimson/30 rounded-sm">
                    {ritual.coverImage ? (
                        <div className="absolute inset-0 scale-[1.15] group-hover:scale-[1.2] transition-transform duration-[1.5s] ease-out">
                            <Image
                                src={typeof ritual.coverImage === 'string' ? ritual.coverImage : urlForImage(ritual.coverImage).url()}
                                alt={ritual.title}
                                fill
                                className={`object-cover transition-all duration-1000 ${isPlaying && currentTrackIndex === index ? 'grayscale-0 blur-0' : 'grayscale group-hover:grayscale-[0.3] blur-[1px] group-hover:blur-0'}`}
                            />
                        </div>
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-void-dark text-muted/10 font-terminal text-[10px]">
                            NO_SIGNAL_FOUND
                        </div>
                    )}

                    {/* Gradient Overlay - Cinematic */}
                    <div className="absolute inset-0 bg-gradient-to-t from-void-deep via-void-deep/40 to-transparent opacity-90" />
                    <div className="absolute inset-0 bg-gradient-to-b from-void-deep/80 via-transparent to-transparent opacity-60" />

                    {/* Content Overlay */}
                    <div className="absolute inset-0 p-8 flex flex-col justify-between">
                         {/* Header: Phase & Lore */}
                         <div className="flex justify-between items-start opacity-60 group-hover:opacity-100 transition-opacity duration-500">
                            <div className="flex items-center gap-2 text-crimson">
                                <EmotionalIcon phase={ritual.emotionalPhase} />
                                <span className="text-[7px] font-terminal tracking-[0.2em] uppercase">
                                    {ritual.emotionalPhase?.split('_')[1] || 'VOID'}
                                </span>
                            </div>
                            
                            {/* Lore Badge */}
                            <div className="flex flex-col items-end gap-1">
                                <Link size={10} className="text-muted/40" />
                                <span className="text-[6px] font-terminal tracking-widest text-muted/30 uppercase">
                                    {ritual.loreConnections?.length || 0} LINKS
                                </span>
                            </div>
                         </div>

                        {/* Footer: Title & Action */}
                        <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-[0.16, 1, 0.3, 1]">
                            <h3 className="font-display text-4xl lg:text-5xl text-soft leading-none tracking-tight mb-4 drop-shadow-lg">
                                {ritual.title}
                            </h3>
                            
                            <div className="h-px w-full bg-gradient-to-r from-crimson/50 to-transparent mb-6 scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />

                            <div className="flex flex-col gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                <p className="font-sans text-[10px] text-muted/80 leading-relaxed line-clamp-2 w-11/12">
                                    {ritual.description}
                                </p>
                                
                                <button 
                                    onClick={() => setCurrentTrackIndex(index)}
                                    className="flex items-center gap-3 text-crimson font-terminal text-[9px] tracking-[0.4em] uppercase hover:text-white transition-colors mt-2"
                                >
                                    <div className={`p-2 border border-crimson/20 rounded-full ${isPlaying && currentTrackIndex === index ? 'bg-crimson text-void-deep' : ''}`}>
                                        {isPlaying && currentTrackIndex === index ? <Pause size={10} fill="currentColor" /> : <Play size={10} fill="currentColor" className="ml-0.5" />}
                                    </div>
                                    <span>{isPlaying && currentTrackIndex === index ? 'HALT_PROTOCOL' : 'INITIATE_SEQUENCE'}</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Active Indicator Pulse */}
                    {isPlaying && currentTrackIndex === index && (
                        <>
                            <div className="absolute top-4 right-4 h-1 w-1 bg-crimson rounded-full animate-ping" />
                            <div className="absolute inset-0 border border-crimson/20 animate-pulse pointer-events-none" />
                        </>
                    )}
                </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Decorative Bottom Line */}
      <div className="layout-container py-24 border-t border-white/5 mt-24">
        <div className="flex justify-between items-center font-terminal text-[8px] text-muted/20 uppercase tracking-[0.5em]">
            <span>End_Of_Transmission</span>
            <span>Est. 2026</span>
            <span>Void_Link_Active</span>
        </div>
      </div>
    </div>
  );
}

function EmotionalIcon({ phase }: { phase?: string }) {
  if (!phase) return <Activity size={10} />;
  
  if (phase.includes('VOID')) return <Moon size={10} />;
  if (phase.includes('MELANCHOLY')) return <CloudRain size={10} />;
  if (phase.includes('FAILURE')) return <AlertTriangle size={10} />;
  if (phase.includes('MEMORY')) return <Zap size={10} />;
  if (phase.includes('RESONANCE')) return <Wifi size={10} />;
  if (phase.includes('DECAY')) return <Scissors size={10} />;
  
  return <Activity size={10} />;
}
