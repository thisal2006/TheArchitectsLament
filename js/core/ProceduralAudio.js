class ProceduralAudio {
    constructor() {
        this.audioContext = null;
        this.init();
    }

    init() {
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new AudioContext();
        } catch (e) {
            console.warn('Web Audio API not supported for procedural generation');
        }
    }

    // Generate UI click sound
    generateClick() {
        if (!this.audioContext) return null;
        
        const now = this.audioContext.currentTime;
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.value = 800;
        
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.start(now);
        oscillator.stop(now + 0.1);
        
        return { oscillator, gainNode };
    }

    // Generate choice selection sound
    generateChoice() {
        if (!this.audioContext) return null;
        
        const now = this.audioContext.currentTime;
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(600, now);
        oscillator.frequency.exponentialRampToValueAtTime(400, now + 0.15);
        
        gainNode.gain.setValueAtTime(0.15, now);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.start(now);
        oscillator.stop(now + 0.2);
        
        return { oscillator, gainNode };
    }

    // Generate ambient sci-fi drone
    generateSciFiAmbient(duration = 5) {
        if (!this.audioContext) return null;
        
        const now = this.audioContext.currentTime;
        
        // Create two oscillators for layering
        const osc1 = this.audioContext.createOscillator();
        const osc2 = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        osc1.type = 'sine';
        osc1.frequency.value = 100;
        
        osc2.type = 'triangle';
        osc2.frequency.value = 50;
        
        filter.type = 'lowpass';
        filter.frequency.value = 400;
        
        gainNode.gain.setValueAtTime(0.05, now);
        gainNode.gain.exponentialRampToValueAtTime(0.02, now + duration);
        
        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + duration);
        osc2.stop(now + duration);
        
        return { osc1, osc2, gainNode, filter };
    }

    // Generate glitch/error sound
    generateGlitch() {
        if (!this.audioContext) return null;
        
        const now = this.audioContext.currentTime;
        
        // Create noise buffer
        const bufferSize = 44100 * 0.2; // 0.2 seconds
        const buffer = this.audioContext.createBuffer(1, bufferSize, 44100);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;
        
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 1000;
        
        const gainNode = this.audioContext.createGain();
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
        
        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        noise.start(now);
        noise.stop(now + 0.2);
        
        return { noise, filter, gainNode };
    }

    // Generate horror ambient sound
    generateHorrorAmbient(duration = 8) {
        if (!this.audioContext) return null;
        
        const now = this.audioContext.currentTime;
        
        // Low frequency oscillation for tension
        const osc = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        osc.type = 'sawtooth';
        osc.frequency.value = 30;
        
        filter.type = 'lowpass';
        filter.frequency.value = 200;
        filter.Q.value = 5;
        
        gainNode.gain.setValueAtTime(0.02, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);
        
        osc.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        osc.start(now);
        osc.stop(now + duration);
        
        return { osc, gainNode, filter };
    }

    // Generate medieval/fantasy ambient
    generateFantasyAmbient(duration = 6) {
        if (!this.audioContext) return null;
        
        const now = this.audioContext.currentTime;
        
        // Major chord arpeggio
        const notes = [261.63, 329.63, 392.00]; // C4, E4, G4
        
        for (let i = 0; i < notes.length; i++) {
            setTimeout(() => {
                const osc = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                osc.type = 'sine';
                osc.frequency.value = notes[i];
                
                gainNode.gain.setValueAtTime(0.02, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.0001, this.audioContext.currentTime + 2);
                
                osc.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                osc.start();
                osc.stop(this.audioContext.currentTime + 2);
            }, i * 1000);
        }
    }

    // Generate twist reveal sound
    generateTwistReveal() {
        if (!this.audioContext) return null;
        
        const now = this.audioContext.currentTime;
        
        // Descending dissonant tone
        const osc1 = this.audioContext.createOscillator();
        const osc2 = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(440, now);
        osc1.frequency.exponentialRampToValueAtTime(220, now + 1);
        
        osc2.type = 'square';
        osc2.frequency.setValueAtTime(443, now);
        osc2.frequency.exponentialRampToValueAtTime(223, now + 1);
        
        gainNode.gain.setValueAtTime(0.15, now);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);
        
        osc1.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 1.5);
        osc2.stop(now + 1.5);
        
        return { osc1, osc2, gainNode };
    }

    // Generate ending resolution sound
    generateEnding(resolution = 'positive') {
        if (!this.audioContext) return null;
        
        const now = this.audioContext.currentTime;
        
        if (resolution === 'positive') {
            // Major chord resolution
            const notes = [261.63, 329.63, 392.00, 523.25];
            
            notes.forEach((freq, i) => {
                const osc = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                osc.type = 'sine';
                osc.frequency.value = freq;
                
                gainNode.gain.setValueAtTime(0.05, now + (i * 0.1));
                gainNode.gain.exponentialRampToValueAtTime(0.0001, now + (i * 0.1) + 2);
                
                osc.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                osc.start(now + (i * 0.1));
                osc.stop(now + (i * 0.1) + 2);
            });
        } else {
            // Minor chord for negative resolution
            const notes = [261.63, 311.13, 392.00];
            
            notes.forEach((freq, i) => {
                const osc = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                osc.type = 'sine';
                osc.frequency.value = freq;
                
                gainNode.gain.setValueAtTime(0.04, now + (i * 0.2));
                gainNode.gain.exponentialRampToValueAtTime(0.0001, now + (i * 0.2) + 3);
                
                osc.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                osc.start(now + (i * 0.2));
                osc.stop(now + (i * 0.2) + 3);
            });
        }
    }

    // Test all sounds
    testAll() {
        console.log('Testing procedural sounds...');
        
        setTimeout(() => this.generateClick(), 0);
        setTimeout(() => this.generateChoice(), 1000);
        setTimeout(() => this.generateGlitch(), 2000);
        setTimeout(() => this.generateTwistReveal(), 3000);
        setTimeout(() => this.generateSciFiAmbient(2), 4000);
        setTimeout(() => this.generateHorrorAmbient(2), 6000);
        setTimeout(() => this.generateFantasyAmbient(2), 8000);
        setTimeout(() => this.generateEnding('positive'), 10000);
        setTimeout(() => this.generateEnding('negative'), 12000);
    }
}

const proceduralAudio = new ProceduralAudio();