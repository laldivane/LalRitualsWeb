'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { client } from "@/sanity/lib/client";
import { ritualsQuery } from "@/sanity/lib/queries";
import { urlForImage } from "@/sanity/lib/image";

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

export default function RitualsIndex() {
  const [rituals, setRituals] = useState<any[]>([]);

  useEffect(() => {
    async function fetchRituals() {
      const data = await client.fetch(ritualsQuery);
      setRituals(data);
    }
    fetchRituals();
  }, []);

  return (
    <div className="layout-container py-32 space-y-24">
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
        {rituals.map((ritual) => (
          <motion.div key={ritual._id || ritual.id} variants={itemVariants as any} className="w-full max-w-sm">
            <Link 
              href={`/rituals/${ritual.slug?.current || ritual.slug}`}
              className="group block relative border border-white/5 bg-void-card/20 p-4 transition-all duration-500 hover:border-crimson/40"
            >
              <div className="relative mb-6 aspect-[4/5] overflow-hidden bg-void-deep">
                {ritual.coverImage ? (
                  <Image
                    src={typeof ritual.coverImage === 'string' ? ritual.coverImage : urlForImage(ritual.coverImage).url()}
                    alt={ritual.title}
                    fill
                    className="object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-void-dark text-muted/20 font-terminal text-[10px]">
                    NO_DATA_SOURCE
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-void-deep via-transparent to-transparent opacity-60" />
                
                <div className="absolute bottom-4 left-4">
                     <span className="whitespace-nowrap border border-crimson/30 bg-black/80 backdrop-blur-sm px-3 py-1 font-terminal text-[9px] uppercase tracking-widest text-crimson shadow-[0_0_10px_rgba(192,0,63,0.2)]">
                      {ritual.emotionalPhase?.replace(/_/g, ' ')}
                     </span>
                </div>
              </div>

              <div className="text-center">
                <h3 className="mb-2 font-display text-2xl font-light text-soft group-hover:text-crimson transition-colors">
                  {ritual.title}
                </h3>
                <p className="line-clamp-2 font-terminal text-[9px] uppercase tracking-widest text-muted/60">
                  {ritual.description}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
