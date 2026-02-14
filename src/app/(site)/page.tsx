'use client';

import Link from "next/link";
import { motion, useScroll, useSpring } from "framer-motion";
import SystemIntro from "@/components/SystemIntro";
import { Activity, ArrowDown, Cpu, Zap, Radio, Database, Shield, Wifi } from "lucide-react";
import { useState, useEffect } from "react";
import { client } from "@/sanity/lib/client";
import { loreNodesQuery, settingsQuery } from "@/sanity/lib/queries";

import { Settings, LoreNode } from '@/lib/types';

export default function Home() {
  const [activeSection, setActiveSection] = useState('hero');
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loreNodes, setLoreNodes] = useState<LoreNode[]>([]);
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const loreIcons = [
    <Cpu key="cpu" size={20} strokeWidth={1} />,
    <Zap key="zap" size={20} strokeWidth={1} />,
    <Radio key="radio" size={20} strokeWidth={1} />,
    <Database key="db" size={20} strokeWidth={1} />,
    <Shield key="shield" size={20} strokeWidth={1} />,
    <Wifi key="wifi" size={20} strokeWidth={1} />
  ];

  useEffect(() => {
    async function fetchData() {
      const [settingsData, loreData] = await Promise.all([
        client.fetch(settingsQuery),
        client.fetch(loreNodesQuery)
      ]);
      setSettings(settingsData);
      setLoreNodes(loreData);
    }
    fetchData();

    const handleScroll = () => {
      const sections = ['hero', 'lore', 'player'];
      const scrollPos = window.scrollY + window.innerHeight / 2;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && scrollPos >= element.offsetTop && scrollPos < element.offsetTop + element.offsetHeight) {
          setActiveSection(section);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col bg-void-deep relative">
      <SystemIntro />
      <div className="mesh-gradient opacity-20" />
      
      {/* ─── SECTION NAVIGATOR ─── */}
      <div className="fixed right-6 md:right-12 top-1/2 -translate-y-1/2 z-[100] hidden sm:flex flex-col items-center gap-12">
        {['hero', 'lore'].map((id) => (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            className="group relative flex items-center justify-center p-2"
            aria-label={`Scroll to ${id} section`}
          >
            <div className={`w-1 h-1 rounded-full transition-all duration-700 ${activeSection === id ? 'bg-crimson scale-[3] shadow-[0_0_15px_rgba(192,0,63,0.8)]' : 'bg-white/10 group-hover:bg-white/40'}`} />
            
            <span className={`absolute right-10 text-[8px] tracking-[0.6em] uppercase font-sans transition-all duration-700 whitespace-nowrap opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-4 ${
              activeSection === id ? 'text-crimson opacity-100' : 'text-muted'
            }`}>
              {id}
            </span>
          </button>
        ))}
      </div>

      <motion.div className="fixed top-0 left-0 right-0 h-[1px] bg-crimson/50 z-[110] origin-left" style={{ scaleX }} />

      {/* ─── HERO SECTION ─── */}
      <section id="hero" className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-crimson/5 blur-[150px] rounded-full animate-pulse" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-void-deep/30 to-void-deep" />
        </div>

        <div className="relative z-10 text-center space-y-12 px-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-6"
          >
            <div className="flex items-center gap-3 px-4 py-1.5 border border-white/5 rounded-full bg-white/[0.02] backdrop-blur-sm">
              <span className="w-1 h-1 bg-crimson rounded-full animate-ping" />
              <span className="text-[9px] tracking-[0.5em] text-muted font-sans uppercase">
                {settings?.systemStatus || 'Protocol_Initialized'}
              </span>
            </div>
            
            <h1 className="font-display text-7xl sm:text-9xl md:text-[12rem] font-light text-soft tracking-tighter leading-none">
              {settings?.heroTitle?.split(' ')[0] || 'LAL'} <span className="text-crimson italic">{settings?.heroTitle?.split(' ')[1] || 'DIVANE'}</span>
            </h1>
            
            <p className="max-w-xl md:max-w-2xl mx-auto font-classic text-xl md:text-3xl text-muted/60 leading-relaxed font-light">
              &quot;{settings?.heroSubtitle || 'Anatolian decay meets digital lament.'}&quot;
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1.5 }}
            className="pt-12"
          >
            <Link 
              href="/player"
              className="group relative inline-flex items-center gap-4 text-soft hover:text-crimson transition-colors duration-700"
            >
              <span className="font-sans text-[10px] tracking-[0.6em] uppercase">Enter_The_Void</span>
              <div className="w-12 h-px bg-soft/20 group-hover:bg-crimson/50 group-hover:w-24 transition-all duration-700" />
            </Link>
          </motion.div>
        </div>

        <motion.button 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 text-muted/20 hover:text-crimson/40 transition-colors cursor-pointer p-4"
          onClick={() => scrollTo('lore')}
        >
          <ArrowDown size={20} strokeWidth={1} />
        </motion.button>
      </section>

      {/* ─── LORE SECTION ─── */}
      <section id="lore" className="relative min-h-screen py-48 w-full flex flex-col items-center justify-center border-t border-white/5">
         <div className="layout-container mb-24 text-center">
            <span className="font-terminal text-[10px] text-crimson tracking-[0.6em] uppercase block mb-4">Lore_Fragments</span>
            <h2 className="font-display text-5xl md:text-7xl text-soft tracking-tight">Digital <span className="italic">Echoes</span></h2>
         </div>

         <div className="layout-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 relative z-10">
            {(loreNodes.length > 0 ? loreNodes : []).map((lore, index) => (
                <LoreCard 
                    key={lore._id || lore.id}
                    index={index}
                    icon={loreIcons[index % loreIcons.length]}
                    title={lore.title}
                    desc={lore.content[0]}
                />
            ))}
         </div>
      </section>
    </div>
  );
}

function LoreCard({ icon, title, desc, index }: { icon: React.ReactNode, title: string, desc: string, index: number }) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="p-10 border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] transition-all duration-1000 group relative overflow-hidden"
        >
            <div className="absolute top-0 left-0 w-px h-0 bg-crimson/50 transition-all duration-1000 group-hover:h-full" />
            
            <div className="text-muted/40 mb-8 group-hover:text-crimson transition-colors duration-1000">
                {icon}
            </div>
            
            <div className="space-y-4">
                <span className="font-terminal text-[8px] text-crimson/30 tracking-[0.5em] uppercase">Fragment_{String(index + 1).padStart(2, '0')}</span>
                <h3 className="font-sans text-[11px] tracking-[0.4em] text-soft uppercase group-hover:text-crimson transition-colors duration-700">{title}</h3>
                <p className="font-classic text-lg md:text-xl text-muted/50 leading-relaxed font-light italic">
                    &quot;{desc}&quot;
                </p>
            </div>
        </motion.div>
    );
}
