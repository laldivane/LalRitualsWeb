'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const BOOT_SEQUENCES = [
  "INITIALIZING_VOID_PROTOCOL...",
  "SEARCHING_FOR_LAL_DIVANE...",
  "MEMORY_FRAGMENT_0X882_LOADED",
  "DECRYPTING_RESISTANCE_STRATUM...",
  "LOADING_EMOTIONAL_INTERFACE...",
  "SYSTEM_STATUS: STABLE_VOID"
];

export default function SystemIntro() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (currentStep < BOOT_SEQUENCES.length) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 400 + Math.random() * 600);
      return () => clearTimeout(timer);
    } else {
      const finishTimer = setTimeout(() => {
        setComplete(true);
        setTimeout(() => setIsVisible(false), 1000);
      }, 800);
      return () => clearTimeout(finishTimer);
    }
  }, [currentStep]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-void-deep flex flex-col items-center justify-center p-8 font-terminal"
        >
          {/* Noise/Scanline Overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          
          <div className="w-full max-w-md space-y-6 relative">
            {/* Terminal Header */}
            <div className="flex justify-between items-center text-[10px] text-crimson/40 tracking-[0.4em] mb-12">
              <span>BOOT_v2.0.26</span>
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                ● LIVE
              </motion.span>
            </div>

            {/* Sequence List */}
            <div className="space-y-3 min-h-[180px]">
              {BOOT_SEQUENCES.slice(0, currentStep).map((text, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`text-[10px] md:text-[12px] tracking-[0.2em] flex items-center gap-3 ${
                    i === currentStep - 1 ? 'text-crimson' : 'text-muted/60'
                  }`}
                >
                  <span className="opacity-40">{">"}</span>
                  {text}
                </motion.div>
              ))}
              
              {currentStep < BOOT_SEQUENCES.length && (
                <motion.div
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.4, repeat: Infinity }}
                  className="w-2 h-4 bg-crimson"
                />
              )}
            </div>

            {/* Progress Bar */}
            <div className="relative h-[2px] w-full bg-white/5 overflow-hidden">
               <motion.div 
                 className="absolute inset-y-0 left-0 bg-crimson shadow-[0_0_10px_#c0003f]"
                 initial={{ width: "0%" }}
                 animate={{ width: `${(currentStep / BOOT_SEQUENCES.length) * 100}%` }}
               />
            </div>

            {/* Success Message */}
            {complete && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center pt-8"
              >
                <span className="text-xl md:text-2xl font-display italic text-soft animate-pulse">
                  Welcome to the Void
                </span>
              </motion.div>
            )}
          </div>
          
          {/* Corner Decorations */}
          <div className="absolute top-12 left-12 w-12 h-12 border-t border-l border-crimson/20" />
          <div className="absolute top-12 right-12 w-12 h-12 border-t border-r border-crimson/20" />
          <div className="absolute bottom-12 left-12 w-12 h-12 border-b border-l border-crimson/20" />
          <div className="absolute bottom-12 right-12 w-12 h-12 border-b border-r border-crimson/20" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
