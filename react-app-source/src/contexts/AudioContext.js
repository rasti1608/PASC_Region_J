import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import audioService from '../services/audio';

const AudioContext = createContext(null);

export function AudioProvider({ children }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    // Initialize audio service
    audioService.initialize();

    // Subscribe to audio state changes
    const unsubscribe = audioService.subscribe((state) => {
      setIsPlaying(state.isPlaying);
      setIsMuted(state.isMuted);
    });

    // Set initial state
    setIsPlaying(audioService.isPlaying());
    setIsMuted(audioService.isMuted());

    return () => {
      unsubscribe();
    };
  }, []);

  const play = useCallback(() => {
    return audioService.play();
  }, []);

  const pause = useCallback(() => {
    audioService.pause();
  }, []);

  const toggle = useCallback(() => {
    return audioService.toggle();
  }, []);

  const toggleMute = useCallback(() => {
    audioService.toggleMute();
  }, []);

  const value = {
    isPlaying,
    isMuted,
    play,
    pause,
    toggle,
    toggleMute
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}

export default AudioContext;
