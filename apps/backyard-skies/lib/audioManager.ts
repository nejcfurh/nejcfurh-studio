type SoundOptions = {
  volume?: number;
  loop?: boolean;
  rate?: number;
  duration?: number;
};

type ActiveLoop = {
  source: OscillatorNode | AudioBufferSourceNode;
  gain: GainNode;
};

class AudioManager {
  private ctx: AudioContext | null = null;
  private muted = false;
  private activeLoops = new Map<string, ActiveLoop>();
  private unlockListenerAdded = false;

  private ensureContext(): AudioContext {
    if (!this.ctx) {
      // Use webkitAudioContext fallback for older Safari
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      this.ctx = new Ctor();
    }

    // On mobile Safari the context starts suspended and can only be
    // resumed inside a direct user-gesture handler. Register a one-time
    // touch/click listener that resumes the context and plays a silent
    // buffer to fully unlock audio (also works around the iOS silent switch).
    if (!this.unlockListenerAdded) {
      this.unlockListenerAdded = true;
      const unlock = () => {
        if (this.ctx && this.ctx.state !== 'running') {
          this.ctx.resume();
          // Silent buffer kick — required on iOS to actually unlock output
          const buf = this.ctx.createBuffer(1, 1, this.ctx.sampleRate);
          const src = this.ctx.createBufferSource();
          src.buffer = buf;
          src.connect(this.ctx.destination);
          src.start(0);
        }
        document.removeEventListener('touchstart', unlock, true);
        document.removeEventListener('touchend', unlock, true);
        document.removeEventListener('click', unlock, true);
      };
      document.addEventListener('touchstart', unlock, true);
      document.addEventListener('touchend', unlock, true);
      document.addEventListener('click', unlock, true);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  play(name: string, opts: SoundOptions = {}) {
    if (this.muted) return;
    const ctx = this.ensureContext();
    const { volume = 0.3, rate = 1, loop = false } = opts;

    // Stop any existing loop with same name
    if (loop && this.activeLoops.has(name)) {
      this.stopLoop(name);
    }

    const gainNode = ctx.createGain();
    gainNode.gain.value = volume;
    gainNode.connect(ctx.destination);

    // Generate procedural sounds based on name
    switch (name) {
      case 'flap':
        this.playFlap(ctx, gainNode, rate);
        break;
      case 'eat':
        this.playEat(ctx, gainNode, loop);
        break;
      case 'drink':
        this.playDrink(ctx, gainNode, loop);
        break;
      case 'eagle':
        this.playEagle(ctx, gainNode);
        break;
      case 'death':
        this.playDeath(ctx, gainNode);
        break;
      case 'score':
        this.playTick(ctx, gainNode);
        break;
      case 'tap':
        this.playTap(ctx, gainNode);
        break;
      case 'wind':
        this.playWind(ctx, gainNode, volume);
        break;
      case 'dodge':
        this.playDodge(ctx, gainNode);
        break;
    }
  }

  private playFlap(ctx: AudioContext, gain: GainNode, rate: number) {
    // Chirpy wing flap — quick rising tone + airy swoosh layered together
    const now = ctx.currentTime;
    const pitchBase = 600 + Math.random() * 400; // random base pitch each flap

    // Layer 1: Quick rising chirp (gives it a birdy feel)
    const chirp = ctx.createOscillator();
    chirp.type = 'sine';
    chirp.frequency.setValueAtTime(pitchBase * rate, now);
    chirp.frequency.exponentialRampToValueAtTime(pitchBase * rate * 1.8, now + 0.06);
    chirp.frequency.exponentialRampToValueAtTime(pitchBase * rate * 0.7, now + 0.12);
    const chirpGain = ctx.createGain();
    chirpGain.gain.setValueAtTime(0, now);
    chirpGain.gain.linearRampToValueAtTime(0.12, now + 0.015);
    chirpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    chirp.connect(chirpGain);
    chirpGain.connect(gain);
    chirp.start(now);
    chirp.stop(now + 0.13);

    // Layer 2: Soft airy whoosh (filtered noise, gives wing texture)
    const whooshDuration = 0.1;
    const bufferSize = Math.floor(ctx.sampleRate * whooshDuration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      const t = i / bufferSize;
      const env = Math.sin(t * Math.PI) * 0.6; // smooth hump
      data[i] = (Math.random() * 2 - 1) * env;
    }
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1200 + Math.random() * 600;
    filter.Q.value = 0.8;
    const whooshGain = ctx.createGain();
    whooshGain.gain.value = 0.06;
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.playbackRate.value = 0.8 + Math.random() * 0.4;
    source.connect(filter);
    filter.connect(whooshGain);
    whooshGain.connect(gain);
    source.start(now);
  }

  private playEat(ctx: AudioContext, gain: GainNode, loop: boolean) {
    // Pecking loop — repeating short taps baked into a buffer
    const bps = 3.5; // pecks per second
    const loopLen = 2; // seconds of buffer
    const bufferSize = Math.floor(ctx.sampleRate * loopLen);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    const peckInterval = Math.floor(ctx.sampleRate / bps);
    const peckSamples = Math.floor(ctx.sampleRate * 0.025); // 25ms per peck

    for (let i = 0; i < bufferSize; i++) {
      const inPeck = (i % peckInterval) < peckSamples;
      if (inPeck) {
        const t = (i % peckInterval) / peckSamples;
        // Short tap: sine burst with fast envelope
        const env = Math.sin(t * Math.PI);
        const freq = 1800 + Math.sin(i * 0.001) * 400; // slight variation
        data[i] = Math.sin(2 * Math.PI * freq * t * 0.025) * env * 0.5;
      } else {
        data[i] = 0;
      }
    }

    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 800;

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = loop;
    source.connect(filter);
    filter.connect(gain);
    gain.gain.value = 0.2;
    source.start();

    if (loop) {
      this.activeLoops.set('eat', { source, gain });
    }
  }

  private playDrink(ctx: AudioContext, gain: GainNode, loop: boolean) {
    // Gentle water droplet plops — sine pings with descending pitch
    const loopLen = 2;
    const bufferSize = Math.floor(ctx.sampleRate * loopLen);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Place 4-5 droplet pings at irregular intervals
    const drops = [0, 0.45, 0.8, 1.2, 1.6];
    for (const dropTime of drops) {
      const startSample = Math.floor(dropTime * ctx.sampleRate);
      const dropLen = Math.floor(ctx.sampleRate * 0.08); // 80ms per drop
      const baseFreq = 800 + Math.random() * 400;

      for (let j = 0; j < dropLen && startSample + j < bufferSize; j++) {
        const t = j / dropLen;
        // Fast decay envelope
        const env = Math.exp(-t * 12) * 0.35;
        // Descending pitch — mimics water surface tension release
        const freq = baseFreq * (1 - t * 0.4);
        data[startSample + j] += Math.sin(2 * Math.PI * freq * (j / ctx.sampleRate)) * env;
      }
    }

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 2000;

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = loop;
    source.connect(filter);
    filter.connect(gain);
    gain.gain.value = 0.18;
    source.start();

    if (loop) {
      this.activeLoops.set('drink', { source, gain });
    }
  }

  private playEagle(ctx: AudioContext, gain: GainNode) {
    // Distant raptor screech — descending frequency sweep
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(2200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.6);

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1500;
    filter.Q.value = 3;

    // Envelope
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

    osc.connect(filter);
    filter.connect(gain);
    osc.start();
    osc.stop(ctx.currentTime + 0.8);
  }

  private playDeath(ctx: AudioContext, gain: GainNode) {
    // Sad descending tone
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 1.0);

    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(400, ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 1.2);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

    osc.connect(gain);
    osc2.connect(gain);
    osc.start();
    osc2.start();
    osc.stop(ctx.currentTime + 1.2);
    osc2.stop(ctx.currentTime + 1.2);
  }

  private playTick(ctx: AudioContext, gain: GainNode) {
    // Quick tick sound
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 1200;

    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    osc.connect(gain);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  }

  private playTap(ctx: AudioContext, gain: GainNode) {
    // Subtle UI click
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 800;

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    osc.connect(gain);
    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  }

  private playWind(ctx: AudioContext, gain: GainNode, volume: number) {
    // Looping wind — filtered noise
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      const t = i / ctx.sampleRate;
      // Slow undulation
      const mod = 0.5 + 0.5 * Math.sin(t * Math.PI * 0.5);
      data[i] = (Math.random() * 2 - 1) * 0.5 * mod;
    }

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;
    filter.Q.value = 0.5;

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    source.connect(filter);
    filter.connect(gain);
    gain.gain.value = volume;
    source.start();

    this.activeLoops.set('wind', { source, gain });
  }

  private playDodge(ctx: AudioContext, gain: GainNode) {
    // Triumphant ascending swoosh
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.2);

    const osc2 = ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(600, ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(1600, ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

    osc.connect(gain);
    osc2.connect(gain);
    osc.start();
    osc2.start();
    osc.stop(ctx.currentTime + 0.4);
    osc2.stop(ctx.currentTime + 0.4);
  }

  stopLoop(name: string) {
    const loop = this.activeLoops.get(name);
    if (loop) {
      try {
        loop.source.stop();
      } catch {
        // Already stopped
      }
      this.activeLoops.delete(name);
    }
  }

  setWindVolume(volume: number) {
    const wind = this.activeLoops.get('wind');
    if (wind) {
      wind.gain.gain.value = this.muted ? 0 : volume;
    }
  }

  setMuted(m: boolean) {
    this.muted = m;
    if (m) {
      // Mute all active loops
      this.activeLoops.forEach(loop => {
        loop.gain.gain.value = 0;
      });
    }
  }

  stopAllLoops() {
    this.activeLoops.forEach((loop, name) => {
      try {
        loop.source.stop();
      } catch {
        // Already stopped
      }
    });
    this.activeLoops.clear();
  }
}

export const audioManager = new AudioManager();
