'use client';

import VoidPlayer from "@/components/VoidPlayer";
import { motion, useScroll, useSpring } from "framer-motion";
import { Activity, ArrowDown, Cpu, Zap, Radio, Database, Shield, Wifi } from "lucide-react";
import { useState, useEffect } from "react";
import { client } from "@/sanity/lib/client";
import { loreNodesQuery, settingsQuery } from "@/sanity/lib/queries";

export default function Home() {
  const [activeSection, setActiveSection] = useState('hero');
  const [settings, setSettings] = useState<any>(null);
  const [loreNodes, setLoreNodes] = useState<any[]>([]);
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const loreIcons = [
    <Cpu key="cpu" size={24} />,
    <Zap key="zap" size={24} />,
    <Radio key="radio" size={24} />,
    <Database key="db" size={24} />,
    <Shield key="shield" size={24} />,
    <Wifi key="wifi" size={24} />
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
      {/* ─── SECTION NAVIGATOR ─── */}
      <div className="fixed right-6 md:right-12 top-1/2 -translate-y-1/2 z-[100] hidden sm:flex flex-col items-center gap-8">
        <div className="h-24 w-px bg-gradient-to-b from-transparent via-crimson/20 to-crimson/40" />
        
        {['hero', 'lore', 'player'].map((id) => (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            className="group relative flex items-center justify-center h-4 w-4"
          >
            <motion.div
              animate={{ 
                rotate: activeSection === id ? 360 : 0,
                scale: activeSection === id ? 1.5 : 1
              }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              className={`absolute inset-0 border rounded-full transition-colors duration-500 ${
                activeSection === id ? 'border-crimson shadow-[0_0_10px_#c0003f]' : 'border-white/10 group-hover:border-white/30'
              }`}
              style={{ padding: '2px' }}
            >
                <div className={`w-full h-full rounded-full border border-dashed text-[4px] flex items-center justify-center ${activeSection === id ? 'border-crimson/50' : 'border-transparent'}`}>
                    {activeSection === id && <div className="w-1 h-1 bg-crimson rounded-full animate-pulse" />}
                </div>
            </motion.div>
            
            <span className={`absolute right-8 text-[8px] tracking-[0.3em] uppercase font-terminal transition-all duration-500 whitespace-nowrap opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-4 ${
              activeSection === id ? 'text-crimson opacity-100' : 'text-muted'
            }`}>
              {id}_protocol
            </span>
          </button>
        ))}

        <div className="h-24 w-px bg-gradient-to-t from-transparent via-crimson/20 to-crimson/40" />
      </div>

      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-crimson z-[110] origin-left" style={{ scaleX }} />

      {/* ─── HERO SECTION ─── */}
      <section id="hero" className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-crimson/5 blur-[150px] rounded-full animate-pulse" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-void-deep/50 to-void-deep" />
        </div>

        <div className="relative z-10 text-center space-y-8 px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="flex items-center gap-3 px-4 py-1 border border-crimson/30 rounded-full bg-crimson/5 backdrop-blur-sm">
              <Activity size={12} className="text-crimson animate-pulse" />
              <span className="text-[10px] tracking-[0.4em] text-crimson font-terminal uppercase">
                {settings?.systemStatus || 'System_Active // Void_Protocol'}
              </span>
            </div>
            
            <h1 className="font-display text-5xl sm:text-7xl md:text-9xl font-light text-soft tracking-tight leading-tight md:leading-none">
              {settings?.heroTitle?.split(' ')[0] || 'LAL'} <span className="text-crimson opacity-80">{settings?.heroTitle?.split(' ')[1] || 'DIVANE'}</span>
            </h1>
            
            <p className="max-w-xl md:max-w-2xl mx-auto font-display text-lg md:text-2xl text-muted italic leading-relaxed px-4">
              &quot;{settings?.heroSubtitle || 'Anatolian decay meets digital lament. A ritual encoded in the fiber of the void.'}&quot;
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="flex items-center justify-center gap-8 pt-8"
          >
            <button 
              onClick={() => scrollTo('player')}
              className="terminal-btn"
            >
              Initialize_Ritual
            </button>
          </motion.div>
        </div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 text-crimson/40 cursor-pointer"
          onClick={() => scrollTo('lore')}
        >
          <ArrowDown size={24} />
        </motion.div>
      </section>

      {/* ─── LORE SECTION (DYNAMIC) ─── */}
      <section id="lore" className="relative min-h-screen py-32 w-full flex items-center justify-center overflow-hidden border-t border-white/5">
         <div className="layout-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
            {(loreNodes.length > 0 ? loreNodes : []).map((lore, index) => (
                <LoreCard 
                    key={lore._id || lore.id}
                    icon={loreIcons[index % loreIcons.length]}
                    title={lore.title}
                    desc={lore.content[0]} // Use the first lyrical line
                />
            ))}
         </div>
         
         <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
            <div className="absolute top-1/2 left-0 w-full h-px bg-crimson" />
            <div className="absolute top-0 left-1/2 w-px h-full bg-crimson" />
         </div>
      </section>

      {/* ─── PLAYER SECTION ─── */}
      <section id="player" className="relative w-full min-h-screen bg-void-dark/20 border-t border-white/5">
        <VoidPlayer />
      </section>
    </div>
  );
}

function LoreCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-8 border border-white/5 bg-white/[0.02] backdrop-blur-md rounded-sm group hover:border-crimson/40 transition-all duration-700"
        >
            <div className="text-crimson/60 mb-6 group-hover:text-crimson group-hover:scale-110 transition-all duration-700">
                {icon}
            </div>
            <h3 className="font-terminal text-[12px] tracking-[0.4em] text-soft mb-4 uppercase">{title}</h3>
            <p className="font-display text-muted text-lg leading-relaxed italic opacity-80 group-hover:opacity-100 transition-opacity">
                &quot;{desc}&quot;
            </p>
        </motion.div>
    );
}
