// Sound effects utility for Kantor AI

export type SoundType = 'approval' | 'celebrate' | 'typing' | 'warning';

interface SoundConfig {
  frequency: number;
  duration: number;
  type: 'sine' | 'square' | 'triangle' | 'sawtooth';
  volume: number;
}

const soundConfigs: Record<SoundType, SoundConfig> = {
  approval: {
    frequency: 800,
    duration: 300,
    type: 'sine',
    volume: 0.4,
  },
  celebrate: {
    frequency: 1200,
    duration: 500,
    type: 'sine',
    volume: 0.5,
  },
  typing: {
    frequency: 600,
    duration: 50,
    type: 'square',
    volume: 0.2,
  },
  warning: {
    frequency: 400,
    duration: 100,
    type: 'triangle',
    volume: 0.3,
  },
};

let audioContext: AudioContext | null = null;

const getAudioContext = (): AudioContext => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

export const playSound = (soundType: SoundType) => {
  if (typeof window === 'undefined') return;

  try {
    const ctx = getAudioContext();
    const config = soundConfigs[soundType];

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = config.type as OscillatorType;
    oscillator.frequency.value = config.frequency;

    gainNode.gain.setValueAtTime(config.volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      ctx.currentTime + config.duration / 1000
    );

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + config.duration / 1000);
  } catch (error) {
    console.warn('Sound playback failed:', error);
  }
};

// Batch sound effects
export const playMultipleSounds = (
  soundType: SoundType,
  count: number,
  interval: number
) => {
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      playSound(soundType);
    }, i * interval);
  }
};
