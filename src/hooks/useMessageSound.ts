import { useCallback, useEffect, useRef } from "react";

type BrowserWindow = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext;
  };

export const useMessageSound = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    return () => {
      const audioContext = audioContextRef.current;

      if (!audioContext) {
        return;
      }

      audioContextRef.current = null;
      void audioContext.close().catch(() => undefined);
    };
  }, []);

  const playMessageSound = useCallback(() => {
    try {
      const audioWindow = window as BrowserWindow;
      const AudioContextClass =
        audioWindow.AudioContext ?? audioWindow.webkitAudioContext;

      if (!AudioContextClass) {
        return;
      }

      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContextClass();
      }

      const audioContext = audioContextRef.current;

      if (audioContext.state === "suspended") {
        void audioContext.resume().catch(() => undefined);
      }

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.18, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.12
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.12);
    } catch (error) {
      console.error("播放提示音失败:", error);
    }
  }, []);

  return { playMessageSound };
};
