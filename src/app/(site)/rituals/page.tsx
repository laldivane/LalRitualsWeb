'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { client } from "@/sanity/lib/client";
import { ritualsQuery } from "@/sanity/lib/queries";
import { urlForImage } from "@/sanity/lib/image";
import { usePlayer } from "@/lib/PlayerContext";
import { Play } from "lucide-react";

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
    <div className="layout-container py-32 space-y-24">
      <h2 className="sr-only">Ritual transmissions</h2>
      <section className="text-center space-y-6">
        <h1 className="font-display text-6xl font-light tracking-widest text-soft sm:text-8xl">
          THE <span className="text-crimson italic">RITUALS</span>
        </h1>
        <p className="font-terminal text-[10px] uppercase tracking-[0.4em] text-muted max-w-xl mx-auto">
          // Indexing_Available_Transmissions //
        </p>
      </section>

      <motion.div 
        variants={containerVariants as any}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 place-items-center"
      >
        {rituals.map((ritual, index) => (
          <motion.div key={ritual._id || ritual.id} variants={itemVariants as any} className="w-full max-w-sm">
            <button 
              onClick={() => setCurrentTrackIndex(index)}
              className="group block w-full relative border border-white/5 bg-void-card/20 p-4 transition-all duration-500 hover:border-crimson/40 text-left"
              aria-label={`Play transmission: ${ritual.title}`}
            >
              <div className="relative mb-6 aspect-[4/5] overflow-hidden bg-void-deep">
                {ritual.coverImage ? (
                  <Image
                    src={typeof ritual.coverImage === 'string' ? ritual.coverImage : urlForImage(ritual.coverImage).url()}
                    alt={ritual.title}
                    fill
                    className={`object-cover transition-all duration-1000 ${isPlaying && currentTrackIndex === index ? 'grayscale-0 scale-105' : 'grayscale group-hover:grayscale-0 group-hover:scale-110'}`}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-void-dark text-muted/20 font-terminal text-[10px]">
                    NO_DATA_SOURCE
                  </div>
                )}
                
                {/* Play Overlay */}
                <div className={`absolute inset-0 flex items-center justify-center bg-void-deep/40 opacity-0 group-hover:opacity-100 transition-all duration-500 ${isPlaying && currentTrackIndex === index ? 'opacity-100 bg-void-deep/20' : ''}`}>
                    <div className="h-16 w-16 rounded-full border border-crimson/30 flex items-center justify-center bg-black/40 backdrop-blur-md text-crimson shadow-[0_0_30px_rgba(192,0,63,0.3)] transform group-hover:scale-110 transition-transform">
                        {isPlaying && currentTrackIndex === index ? (
                            <div className="flex gap-1 items-end h-5">
                                [ ACTIVE ]
                            </div>
                        ) : (
                            <Play fill="currentColor" size={24} className="ml-1" />
                        )}
                    </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-void-deep via-transparent to-transparent opacity-60" />
                
                <div className="absolute bottom-4 left-4">
                     <span className="whitespace-nowrap border border-crimson/30 bg-black/80 backdrop-blur-sm px-3 py-1 font-terminal text-[9px] uppercase tracking-widest text-crimson shadow-[0_0_10px_rgba(192,0,63,0.2)]">
                      {ritual.emotionalPhase?.replace(/_/g, ' ')}
                     </span>
                </div>
              </div>

              <div className="text-center">
                <h3 className={`mb-2 font-display text-2xl font-light transition-colors ${currentTrackIndex === index ? 'text-crimson' : 'text-soft group-hover:text-crimson'}`}>
                  {ritual.title}
                </h3>
                <p className="line-clamp-2 font-terminal text-[9px] uppercase tracking-widest text-muted/60">
                  {ritual.description}
                </p>
              </div>
            </button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
