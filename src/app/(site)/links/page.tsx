'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Music, 
  Disc, 
  Radio, 
  Headphones, 
  ExternalLink,
  Twitter,
  Play
} from 'lucide-react';

const links = [
  {
    label: 'Apple Music',
    url: 'https://music.apple.com/us/artist/lal-divane/1869927989',
    icon: Music,
    color: 'hover:text-[#FA243C]' // Apple-ish red
  },
  {
    label: 'Amazon Music',
    url: 'https://music.amazon.com/artists/B0GHH7JS7F/lal-divane',
    icon: ShoppingCartIcon,
    color: 'hover:text-[#FF9900]' // Amazon orange
  },
  {
    label: 'Deezer',
    url: 'https://www.deezer.com/tr/artist/368362732',
    icon: Radio,
    color: 'hover:text-[#FEAA2D]' // Deezer rainbow/orange
  },
  {
    label: 'Tidal',
    url: 'https://tidal.com/artist/73227066/u',
    icon: Disc,
    color: 'hover:text-white' // Black/White
  },
  {
    label: 'Anghami',
    url: 'https://play.anghami.com/artist/26974888',
    icon: Headphones,
    color: 'hover:text-[#A64CA6]' // Anghami purple
  },
  {
    label: 'Boomplay',
    url: 'https://www.boomplay.com/artists/124895825',
    icon: Play,
    color: 'hover:text-[#00DDA2]' // Boomplay green
  },
  {
    label: 'Audiomack',
    url: 'https://audiomack.com/lal-divane',
    icon: Headphones,
    color: 'hover:text-[#FFA500]' // Audiomack orange
  },
  {
    label: 'Qobuz',
    url: 'https://www.qobuz.com/nl-nl/interpreter/lal-divane/30637650',
    icon: Disc,
    color: 'hover:text-black' // Qobuz black
  },
  {
    label: 'Kugou',
    url: 'https://www.kugou.com/mixsong/dx244a34.html?fromsearch=lal%20divane',
    icon: Music,
    color: 'hover:text-[#009AF3]' // Kugou blue
  },
  {
    label: 'X (Twitter)',
    url: 'https://x.com/LalDivaneMusic',
    icon: Twitter,
    color: 'hover:text-white'
  }
];

function ShoppingCartIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="8" cy="21" r="1" />
            <circle cx="19" cy="21" r="1" />
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
        </svg>
    )
}

export default function LinksPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center py-32">
      <div className="mesh-gradient opacity-20" />
      
      <div className="layout-container w-full max-w-lg relative z-10">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-16 space-y-4"
        >
            <div className="w-24 h-24 mx-auto rounded-full bg-void-dark border border-white/10 relative overflow-hidden mb-8 group">
                {/* Profile Image could go here if available, for now using a placeholder or just brand initials */}
                <div className="absolute inset-0 flex items-center justify-center font-display text-4xl text-crimson italic">
                    L
                </div>
                <div className="absolute inset-0 bg-crimson/10 animate-pulse" />
            </div>
            
            <h1 className="font-display text-4xl md:text-5xl text-soft tracking-tight">
                LAL DIVANE
            </h1>
            <p className="font-terminal text-[10px] text-crimson tracking-[0.4em] uppercase">
                Digital_Ritual_Protocol_Active
            </p>
        </motion.div>

        <div className="space-y-4">
             {links.map((link, index) => (
                <motion.a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className={`block w-full bg-void-dark/40 backdrop-blur-sm border border-white/5 hover:border-crimson/30 p-4 relative group overflow-hidden transition-all duration-300 ${link.color}`}
                >
                    <div className="absolute inset-0 bg-crimson/0 group-hover:bg-crimson/5 transition-colors duration-500" />
                    
                    <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-4">
                            <link.icon size={20} className="text-muted/60 group-hover:text-inherit transition-colors" />
                            <span className="font-sans text-sm tracking-widest uppercase text-soft/80 group-hover:text-white transition-colors font-medium">
                                {link.label}
                            </span>
                        </div>
                        <ExternalLink size={14} className="text-muted/20 group-hover:text-crimson transition-colors opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transform duration-300" />
                    </div>
                </motion.a>
             ))}
        </div>

        <div className="mt-16 text-center">
             <Link href="/" className="font-terminal text-[8px] text-muted/30 hover:text-crimson transition-all tracking-[0.3em] uppercase">
                Return_To_Void
             </Link>
        </div>
      </div>
    </div>
  );
}
