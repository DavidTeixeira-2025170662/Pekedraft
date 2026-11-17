// Web Audio API Procedural Synthesizer for Retro Pokémon Sounds & Chiptune BGM
// 100% Self-Contained, zero external network requests or CORS issues inside Discord Activities!

let audioCtx: AudioContext | null = null;
let soundEnabled = true;
let musicEnabled = true;
let masterVolume = 0.5;

let currentBgmInterval: number | null = null;
let currentBgmNodes: OscillatorNode[] = [];

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function toggleSound(): boolean {
  soundEnabled = !soundEnabled;
  return soundEnabled;
}

export function toggleMusic(): boolean {
  musicEnabled = !musicEnabled;
  if (!musicEnabled) {
    stopBGM();
  }
  return musicEnabled;
}

export function isSoundEnabled(): boolean {
  return soundEnabled;
}

export function isMusicEnabled(): boolean {
  return musicEnabled;
}

export function setMasterVolume(val: number) {
  masterVolume = Math.max(0, Math.min(1, val));
}

export function getMasterVolume(): number {
  return masterVolume;
}

// ==========================================
// SFX (Sound Effects)
// ==========================================

export function playClickSound() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(520, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.06);

  gain.gain.setValueAtTime(0.12 * masterVolume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.06);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.06);
}

export function playAttackSound(category: 'physical' | 'special' | 'status' = 'physical') {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  if (category === 'special') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(300, ctx.currentTime + 0.15);
  } else if (category === 'status') {
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.2);
  } else {
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(340, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(70, ctx.currentTime + 0.16);
  }

  gain.gain.setValueAtTime(0.2 * masterVolume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.18);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.18);
}

export function playSuperEffectiveSound() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'square';
  osc.frequency.setValueAtTime(587.33, ctx.currentTime);
  osc.frequency.setValueAtTime(880, ctx.currentTime + 0.07);
  osc.frequency.setValueAtTime(1174.66, ctx.currentTime + 0.14);

  gain.gain.setValueAtTime(0.25 * masterVolume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.28);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.28);
}

export function playBerryEatSound() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(400, ctx.currentTime);
  osc.frequency.setValueAtTime(600, ctx.currentTime + 0.08);
  osc.frequency.setValueAtTime(800, ctx.currentTime + 0.16);

  gain.gain.setValueAtTime(0.2 * masterVolume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.25);
}

export function playShinySparkleSound() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const sparkles = [1046.5, 1318.51, 1567.98, 2093.0];
  sparkles.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.07);

    gain.gain.setValueAtTime(0.2 * masterVolume, ctx.currentTime + idx * 0.07);
    gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + idx * 0.07 + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime + idx * 0.07);
    osc.stop(ctx.currentTime + idx * 0.07 + 0.2);
  });
}

export function playZMoveSound() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  // Crystal celestial chime sweep
  const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98, 2093.0];
  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.04);
    gain.gain.setValueAtTime(0.22 * masterVolume, ctx.currentTime + idx * 0.04);
    gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + idx * 0.04 + 0.35);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + idx * 0.04);
    osc.stop(ctx.currentTime + idx * 0.04 + 0.35);
  });

  // Colossal thunderous blast
  const boom = ctx.createOscillator();
  const boomGain = ctx.createGain();
  boom.type = 'sawtooth';
  boom.frequency.setValueAtTime(180, ctx.currentTime + 0.3);
  boom.frequency.exponentialRampToValueAtTime(32, ctx.currentTime + 0.85);
  boomGain.gain.setValueAtTime(0.35 * masterVolume, ctx.currentTime + 0.3);
  boomGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.85);
  boom.connect(boomGain);
  boomGain.connect(ctx.destination);
  boom.start(ctx.currentTime + 0.3);
  boom.stop(ctx.currentTime + 0.85);
}

export function playFaintSound() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(260, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.4);

  gain.gain.setValueAtTime(0.25 * masterVolume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.4);
}

export function playRouletteTickSound() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(750 + Math.random() * 150, ctx.currentTime);

  gain.gain.setValueAtTime(0.12 * masterVolume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.04);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.04);
}

export function playVictorySound() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);

    gain.gain.setValueAtTime(0.18 * masterVolume, ctx.currentTime + idx * 0.12);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + idx * 0.12 + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime + idx * 0.12);
    osc.stop(ctx.currentTime + idx * 0.12 + 0.35);
  });
}

// ==========================================
// Chiptune Procedural Background Music (BGM)
// ==========================================

export function stopBGM() {
  if (currentBgmInterval) {
    clearInterval(currentBgmInterval);
    currentBgmInterval = null;
  }
  currentBgmNodes.forEach((node) => {
    try {
      node.stop();
      node.disconnect();
    } catch {
      // ignore
    }
  });
  currentBgmNodes = [];
}

// Battle Theme (high-tempo authentic battle rhythm)
export function startBattleBGM() {
  stopBGM();
  if (!musicEnabled) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  // Authentic battle bassline & melody pattern (E minor key)
  const bassline = [164.81, 164.81, 196.0, 164.81, 220.0, 196.0, 164.81, 146.83];
  const leadMelody = [329.63, 392.0, 440.0, 493.88, 587.33, 493.88, 440.0, 392.0];
  let step = 0;

  const playStep = () => {
    if (!musicEnabled || !ctx) return;

    // Bass synth
    const bassOsc = ctx.createOscillator();
    const bassGain = ctx.createGain();
    bassOsc.type = 'triangle';
    bassOsc.frequency.setValueAtTime(bassline[step % bassline.length], ctx.currentTime);
    bassGain.gain.setValueAtTime(0.08 * masterVolume, ctx.currentTime);
    bassGain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.14);
    bassOsc.connect(bassGain);
    bassGain.connect(ctx.destination);
    bassOsc.start();
    bassOsc.stop(ctx.currentTime + 0.14);

    // Lead chiptune
    if (step % 2 === 0) {
      const leadOsc = ctx.createOscillator();
      const leadGain = ctx.createGain();
      leadOsc.type = 'square';
      leadOsc.frequency.setValueAtTime(leadMelody[(step / 2) % leadMelody.length], ctx.currentTime);
      leadGain.gain.setValueAtTime(0.06 * masterVolume, ctx.currentTime);
      leadGain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.24);
      leadOsc.connect(leadGain);
      leadGain.connect(ctx.destination);
      leadOsc.start();
      leadOsc.stop(ctx.currentTime + 0.24);
    }

    step = (step + 1) % 64;
  };

  playStep();
  currentBgmInterval = window.setInterval(playStep, 175); // ~137 BPM
}

// Lobby / Draft Theme (relaxed preparation beat)
export function startLobbyBGM() {
  stopBGM();
  if (!musicEnabled) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  const chords = [261.63, 329.63, 392.0, 523.25, 440.0, 349.23, 329.63, 293.66];
  let step = 0;

  const playStep = () => {
    if (!musicEnabled || !ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(chords[step % chords.length], ctx.currentTime);
    gain.gain.setValueAtTime(0.06 * masterVolume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.35);

    step = (step + 1) % chords.length;
  };

  playStep();
  currentBgmInterval = window.setInterval(playStep, 400); // Chill 75 BPM
}
