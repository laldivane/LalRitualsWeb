'use client';

import VoidPlayer from "@/components/VoidPlayer";
import { motion } from "framer-motion";

export default function PlayerPage() {
  return (
    <div className="min-h-screen bg-void-deep py-20 sm:py-32">
      {/* ─── PLAYER INTERFACE ─── */}
      <section className="layout-container">
        <div className="h-[85vh] sm:h-[80vh] w-full bg-void-dark/20 overflow-hidden border border-white/5 rounded-sm shadow-2xl relative">
          <VoidPlayer />
          
          {/* Decorative Corner Accents */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-crimson/20 pointer-events-none" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-crimson/20 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-crimson/20 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-crimson/20 pointer-events-none" />
        </div>
      </section>
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-[-1] opacity-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-crimson/5 blur-[200px] rounded-full animate-pulse" />
      </div>
    </div>
  );
}
