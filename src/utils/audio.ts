/**
 * Web Audio API synthesizer for realistic school bells
 */
class SchoolBellAudio {
  private ctx: AudioContext | null = null;
  private isRinging: boolean = false;

  private getAudioContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /**
   * Plays a realistic technical college school bell chime
   * @param durationSeconds Duration of bell ringing
   */
  public ring(durationSeconds: number = 3.5, onComplete?: () => void): void {
    if (this.isRinging) return;
    this.isRinging = true;

    try {
      const ctx = this.getAudioContext();
      const startTime = ctx.currentTime;
      const endTime = startTime + durationSeconds;

      // Master gain
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.3, startTime);
      masterGain.gain.exponentialRampToValueAtTime(0.001, endTime);
      masterGain.connect(ctx.destination);

      // We create twin strike oscillators with fast tremolo modulation to mimic an electro-mechanical bell
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const strikeMod = ctx.createOscillator();
      const modGain = ctx.createGain();

      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(840, startTime);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1120, startTime);

      // 16Hz vibration hammer
      strikeMod.type = 'square';
      strikeMod.frequency.setValueAtTime(14, startTime);

      modGain.gain.setValueAtTime(0.4, startTime);
      strikeMod.connect(modGain.gain);

      const bellGain = ctx.createGain();
      bellGain.gain.setValueAtTime(0.7, startTime);

      osc1.connect(bellGain);
      osc2.connect(bellGain);
      bellGain.connect(masterGain);

      strikeMod.start(startTime);
      osc1.start(startTime);
      osc2.start(startTime);

      strikeMod.stop(endTime);
      osc1.stop(endTime);
      osc2.stop(endTime);

      setTimeout(() => {
        this.isRinging = false;
        if (onComplete) onComplete();
      }, durationSeconds * 1000);
    } catch {
      this.isRinging = false;
      if (onComplete) onComplete();
    }
  }

  public getIsRinging(): boolean {
    return this.isRinging;
  }
}

export const bellAudio = new SchoolBellAudio();
