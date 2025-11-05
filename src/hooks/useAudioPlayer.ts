import { useState, useRef, useCallback } from 'react';

export const useAudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = useCallback(async (audioUrl: string, options?: {
    volume?: number;
    loop?: boolean;
    playbackRate?: number;
  }) => {
    try {
      setIsLoading(true);
      setError(null);

      // Stop current audio if playing
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      // Set audio options
      if (options?.volume !== undefined) {
        audio.volume = Math.max(0, Math.min(1, options.volume));
      }
      if (options?.loop !== undefined) {
        audio.loop = options.loop;
      }
      if (options?.playbackRate !== undefined) {
        audio.playbackRate = Math.max(0.5, Math.min(2, options.playbackRate));
      }

      audio.onloadeddata = () => {
        setIsLoading(false);
      };

      audio.onplay = () => {
        setIsPlaying(true);
      };

      audio.onended = () => {
        setIsPlaying(false);
        audioRef.current = null;
      };

      audio.onerror = (e) => {
        setIsPlaying(false);
        setIsLoading(false);
        setError('Audio playback failed');
        audioRef.current = null;
        console.error('Audio error:', e);
      };

      await audio.play();
    } catch (err) {
      setIsPlaying(false);
      setIsLoading(false);
      setError('Failed to play audio');
      console.error('Audio playback failed:', err);
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
  }, []);

  const resume = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, []);

  const setVolume = useCallback((volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, volume));
    }
  }, []);

  const setPlaybackRate = useCallback((rate: number) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = Math.max(0.5, Math.min(2, rate));
    }
  }, []);

  const toggleLoop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.loop = !audioRef.current.loop;
    }
  }, []);

  return {
    isPlaying,
    isLoading,
    error,
    play,
    stop,
    pause,
    resume,
    setVolume,
    setPlaybackRate,
    toggleLoop,
  };
};

// Preload audio files
export const useAudioPreloader = () => {
  const [preloadedAudios, setPreloadedAudios] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  const preloadAudio = useCallback(async (audioUrls: string[]) => {
    setIsLoading(true);

    const loadPromises = audioUrls.map(async (url) => {
      if (preloadedAudios.has(url)) return;

      try {
        const audio = new Audio();
        await new Promise((resolve, reject) => {
          audio.oncanplaythrough = resolve;
          audio.onerror = reject;
          audio.src = url;
        });

        setPreloadedAudios(prev => new Set(prev).add(url));
      } catch (error) {
        console.warn(`Failed to preload audio: ${url}`, error);
      }
    });

    await Promise.allSettled(loadPromises);
    setIsLoading(false);
  }, [preloadedAudios]);

  const isPreloaded = useCallback((url: string) => {
    return preloadedAudios.has(url);
  }, [preloadedAudios]);

  return {
    preloadAudio,
    isPreloaded,
    isLoading,
    preloadedCount: preloadedAudios.size,
  };
};

// Audio context for background music and sound effects
export const useAudioContext = () => {
  const [context, setContext] = useState<AudioContext | null>(null);
  const [backgroundMusic, setBackgroundMusic] = useState<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    // Initialize Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    setContext(audioContext);

    return () => {
      audioContext.close();
    };
  }, []);

  const playBackgroundMusic = useCallback(async (audioUrl: string) => {
    if (!context) return;

    try {
      const response = await fetch(audioUrl);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await context.decodeAudioData(arrayBuffer);

      const source = context.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(context.destination);
      source.loop = true;
      source.start();

      setBackgroundMusic(source);
    } catch (error) {
      console.error('Failed to play background music:', error);
    }
  }, [context]);

  const stopBackgroundMusic = useCallback(() => {
    if (backgroundMusic) {
      backgroundMusic.stop();
      setBackgroundMusic(null);
    }
  }, [backgroundMusic]);

  const playSoundEffect = useCallback(async (audioUrl: string, volume = 0.5) => {
    if (!context) return;

    try {
      const response = await fetch(audioUrl);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await context.decodeAudioData(arrayBuffer);

      const source = context.createBufferSource();
      const gainNode = context.createGain();

      source.buffer = audioBuffer;
      gainNode.gain.value = volume;

      source.connect(gainNode);
      gainNode.connect(context.destination);
      source.start();
    } catch (error) {
      console.error('Failed to play sound effect:', error);
    }
  }, [context]);

  return {
    playBackgroundMusic,
    stopBackgroundMusic,
    playSoundEffect,
  };
};