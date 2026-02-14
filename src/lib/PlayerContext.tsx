'use client';

import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { client } from '@/sanity/lib/client';
import { ritualsQuery } from '@/sanity/lib/queries';
import { Ritual, LyricLine } from '@/lib/types';

interface PlayerContextType {
  rituals: Ritual[];
  currentTrackIndex: number;
  currentTrack: Ritual | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  waveformData: number[];
  isMounted: boolean;
  setCurrentTrackIndex: (index: number) => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  seek: (time: number) => void;
  activeLyric: LyricLine | null;
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [rituals, setRituals] = useState<Ritual[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [waveformData, setWaveformData] = useState<number[]>(new Array(48).fill(0));
  const [isMounted, setIsMounted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  useEffect(() => {
    async function fetchRituals() {
      const data = await client.fetch(ritualsQuery);
      setRituals(data);
      setIsMounted(true);
    }
    fetchRituals();
  }, []);

  const currentTrack = rituals[currentTrackIndex] || null;

  const initAudio = useCallback(() => {
    if (!audioContextRef.current && audioRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const context = new AudioContextClass();
      const analyser = context.createAnalyser();
      analyser.fftSize = 256;
      
      const source = context.createMediaElementSource(audioRef.current);
      source.connect(analyser);
      analyser.connect(context.destination);
      
      audioContextRef.current = context;
      analyserRef.current = analyser;
      sourceRef.current = source;
    }
  }, []);

  useEffect(() => {
    const update = () => {
      if (analyserRef.current && isPlaying) {
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteTimeDomainData(dataArray);
        
        const newWaveform = [];
        const step = Math.floor(dataArray.length / 48);
        for (let i = 0; i < 48; i++) {
          const amplitude = Math.abs(dataArray[i * step] - 128) / 128;
          newWaveform.push(amplitude);
        }
        setWaveformData(newWaveform);
        animationFrameRef.current = requestAnimationFrame(update);
      }
    };

    if (isPlaying) {
      animationFrameRef.current = requestAnimationFrame(update);
    } else {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    }
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying]);

  const togglePlay = () => {
    if (audioRef.current) {
      initAudio();
      if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume();
      }

      const nextPlayingState = !isPlaying;
      setIsPlaying(nextPlayingState);
      
      if (nextPlayingState) {
        audioRef.current.play().catch(e => console.error("Playback failed:", e));
      } else {
        audioRef.current.pause();
      }
    }
  };

  const nextTrack = () => {
    const nextIdx = (currentTrackIndex + 1) % rituals.length;
    setCurrentTrackIndex(nextIdx);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    const prevIdx = (currentTrackIndex - 1 + rituals.length) % rituals.length;
    setCurrentTrackIndex(prevIdx);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (!isNaN(audioRef.current.duration)) {
        setDuration(audioRef.current.duration);
      }
    }
  };

  const activeLyric = currentTrack?.syncedLyrics?.reduce((prev: LyricLine | null, curr: LyricLine) => {
    if (curr.time <= currentTime) {
      return curr;
    }
    return prev;
  }, null) || null;

  useEffect(() => {
    if (isPlaying && audioRef.current) {
        audioRef.current.play().catch(e => console.error("Auto-play failed:", e));
    }
  }, [currentTrackIndex, isPlaying]);

  return (
    <PlayerContext.Provider value={{
      rituals,
      currentTrackIndex,
      currentTrack,
      isPlaying,
      currentTime,
      duration,
      waveformData,
      isMounted,
      setCurrentTrackIndex,
      togglePlay,
      nextTrack,
      prevTrack,
      seek,
      activeLyric,
      audioRef
    }}>
      {children}
      <audio
        ref={audioRef}
        src={currentTrack?.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextTrack}
        onLoadedMetadata={handleTimeUpdate}
        crossOrigin="anonymous"
      />
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}
