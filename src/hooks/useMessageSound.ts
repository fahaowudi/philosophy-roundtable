import { useRef, useCallback } from 'react';

export const useMessageSound = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  const playMessageSound = useCallback(() => {
    try {
      // 创建AudioContext（如果还没有）
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const audioContext = audioContextRef.current;

      // 创建振荡器
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      // 连接节点
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // 设置音调和音量
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

      // 播放
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
      console.error('播放音效失败:', error);
    }
  }, []);

  return { playMessageSound };
};
