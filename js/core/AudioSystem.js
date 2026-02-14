class AudioSystem {
    constructor() {
        this.sounds = {};
        this.music = {};
        this.currentMusic = null;
        this.musicVolume = 0.5;
        this.sfxVolume = 0.7;
        this.muted = false;
        this.musicEnabled = true;
        this.sfxEnabled = true;
        
        // Audio context for Web Audio API (better control)
        this.audioContext = null;
        this.initAudioContext();
        
        // Initialize audio settings from localStorage
        this.loadSettings();
        
        console.log('Audio System initialized');
    }

    initAudioContext() {
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new AudioContext();
            
            // Resume audio context on user interaction (browser policy)
            document.addEventListener('click', () => {
                if (this.audioContext.state === 'suspended') {
                    this.audioContext.resume();
                }
            }, { once: true });
        } catch (e) {
            console.warn('Web Audio API not supported:', e);
        }
    }

    loadSettings() {
        const settings = localStorage.getItem('architect_audio_settings');
        if (settings) {
            const parsed = JSON.parse(settings);
            this.musicVolume = parsed.musicVolume || 0.5;
            this.sfxVolume = parsed.sfxVolume || 0.7;
            this.muted = parsed.muted || false;
            this.musicEnabled = parsed.musicEnabled !== false;
            this.sfxEnabled = parsed.sfxEnabled !== false;
        }
    }

    saveSettings() {
        const settings = {
            musicVolume: this.musicVolume,
            sfxVolume: this.sfxVolume,
            muted: this.muted,
            musicEnabled: this.musicEnabled,
            sfxEnabled: this.sfxEnabled
        };
        localStorage.setItem('architect_audio_settings', JSON.stringify(settings));
    }

    // Register a sound effect
    registerSound(name, urls) {
        this.sounds[name] = {
            urls: Array.isArray(urls) ? urls : [urls],
            buffer: null,
            loaded: false
        };
        
        // Try multiple formats for compatibility
        this.loadSound(name);
    }

    loadSound(name) {
        const sound = this.sounds[name];
        if (!sound) return;
        
        // Try each URL until one works
        const tryUrl = (index) => {
            if (index >= sound.urls.length) {
                console.warn(`Could not load sound: ${name}`);
                return;
            }
            
            const url = sound.urls[index];
            const audio = new Audio();
            
            audio.addEventListener('canplaythrough', () => {
                sound.audio = audio;
                sound.loaded = true;
                console.log(`Loaded sound: ${name} (${url})`);
            }, { once: true });
            
            audio.addEventListener('error', () => {
                console.warn(`Failed to load ${url}, trying next format...`);
                tryUrl(index + 1);
            }, { once: true });
            
            audio.src = url;
            audio.load();
        };
        
        tryUrl(0);
    }

    // Register background music
    registerMusic(name, url, loop = true) {
        this.music[name] = {
            url: url,
            audio: null,
            loaded: false,
            loop: loop
        };
        
        const audio = new Audio();
        audio.addEventListener('canplaythrough', () => {
            this.music[name].audio = audio;
            this.music[name].loaded = true;
            console.log(`Loaded music: ${name}`);
        });
        
        audio.addEventListener('error', () => {
            console.warn(`Failed to load music: ${name}`);
        });
        
        audio.src = url;
        audio.loop = loop;
        audio.load();
    }

    // Play sound effect
    playSound(name, options = {}) {
        if (this.muted || !this.sfxEnabled) return;
        if (!this.sounds[name] || !this.sounds[name].loaded) {
            console.warn(`Sound not loaded: ${name}`);
            return;
        }

        try {
            const sound = this.sounds[name];
            const audio = sound.audio.cloneNode();
            audio.volume = this.sfxVolume * (options.volume || 1);
            audio.playbackRate = options.pitch || 1;
            
            if (options.delay) {
                setTimeout(() => audio.play(), options.delay);
            } else {
                audio.play();
            }
            
            return audio;
        } catch (e) {
            console.error(`Error playing sound ${name}:`, e);
        }
    }

    // Play background music
    playMusic(name, fadeIn = true) {
        if (this.muted || !this.musicEnabled) return;
        if (!this.music[name] || !this.music[name].loaded) {
            console.warn(`Music not loaded: ${name}`);
            return;
        }

        // Stop current music
        if (this.currentMusic) {
            this.stopMusic(true);
        }

        const music = this.music[name];
        const audio = music.audio.cloneNode();
        audio.loop = music.loop;
        audio.volume = 0; // Start at 0 for fade in
        
        if (fadeIn) {
            audio.play();
            this.fadeIn(audio, this.musicVolume, 2000);
        } else {
            audio.volume = this.musicVolume;
            audio.play();
        }
        
        this.currentMusic = {
            name: name,
            audio: audio
        };
        
        eventBus.emit('music_changed', { name: name });
    }

    // Stop current music
    stopMusic(fadeOut = true) {
        if (!this.currentMusic) return;
        
        if (fadeOut) {
            this.fadeOut(this.currentMusic.audio, 1000, () => {
                this.currentMusic.audio.pause();
                this.currentMusic = null;
            });
        } else {
            this.currentMusic.audio.pause();
            this.currentMusic = null;
        }
    }

    // Fade in audio
    fadeIn(audio, targetVolume, duration) {
        const startTime = Date.now();
        const startVolume = 0;
        
        const fade = () => {
            const now = Date.now();
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            audio.volume = startVolume + (targetVolume - startVolume) * progress;
            
            if (progress < 1) {
                requestAnimationFrame(fade);
            }
        };
        
        requestAnimationFrame(fade);
    }

    // Fade out audio
    fadeOut(audio, duration, callback) {
        const startTime = Date.now();
        const startVolume = audio.volume;
        
        const fade = () => {
            const now = Date.now();
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            audio.volume = startVolume * (1 - progress);
            
            if (progress < 1) {
                requestAnimationFrame(fade);
            } else {
                if (callback) callback();
            }
        };
        
        requestAnimationFrame(fade);
    }

    // Set music volume
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        if (this.currentMusic) {
            this.currentMusic.audio.volume = this.musicVolume;
        }
        this.saveSettings();
        eventBus.emit('volume_changed', { type: 'music', volume: this.musicVolume });
    }

    // Set SFX volume
    setSFXVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
        this.saveSettings();
        eventBus.emit('volume_changed', { type: 'sfx', volume: this.sfxVolume });
    }

    // Toggle mute
    toggleMute() {
        this.muted = !this.muted;
        
        if (this.muted) {
            if (this.currentMusic) {
                this.currentMusic.audio.volume = 0;
            }
        } else {
            if (this.currentMusic) {
                this.currentMusic.audio.volume = this.musicVolume;
            }
        }
        
        this.saveSettings();
        eventBus.emit('mute_toggled', { muted: this.muted });
        
        return this.muted;
    }

    // Toggle music
    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        
        if (!this.musicEnabled && this.currentMusic) {
            this.stopMusic(true);
        }
        
        this.saveSettings();
        eventBus.emit('music_toggled', { enabled: this.musicEnabled });
        
        return this.musicEnabled;
    }

    // Toggle SFX
    toggleSFX() {
        this.sfxEnabled = !this.sfxEnabled;
        this.saveSettings();
        eventBus.emit('sfx_toggled', { enabled: this.sfxEnabled });
        
        return this.sfxEnabled;
    }

    // Generate simple sounds procedurally (fallback if files don't exist)
    generateProceduralSound(type) {
        if (!this.audioContext) return null;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        switch(type) {
            case 'click':
                oscillator.frequency.value = 800;
                gainNode.gain.value = 0.1;
                oscillator.type = 'sine';
                gainNode.gain.exponentialRampToValueAtTime(0.00001, this.audioContext.currentTime + 0.1);
                break;
                
            case 'choice':
                oscillator.frequency.value = 600;
                gainNode.gain.value = 0.1;
                oscillator.type = 'sine';
                oscillator.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.1);
                gainNode.gain.exponentialRampToValueAtTime(0.00001, this.audioContext.currentTime + 0.15);
                break;
                
            case 'error':
                oscillator.frequency.value = 200;
                gainNode.gain.value = 0.2;
                oscillator.type = 'sawtooth';
                oscillator.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 0.3);
                gainNode.gain.exponentialRampToValueAtTime(0.00001, this.audioContext.currentTime + 0.3);
                break;
                
            case 'glitch':
                oscillator.frequency.value = 300;
                gainNode.gain.value = 0.05;
                oscillator.type = 'square';
                
                // Add noise
                const noise = this.audioContext.createBufferSource();
                const buffer = this.audioContext.createBuffer(1, 1000, 44100);
                const data = buffer.getChannelData(0);
                for (let i = 0; i < 1000; i++) {
                    data[i] = Math.random() * 2 - 1;
                }
                noise.buffer = buffer;
                noise.connect(gainNode);
                noise.start();
                noise.stop(this.audioContext.currentTime + 0.2);
                break;
        }
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + (type === 'error' ? 0.3 : 0.15));
        
        return { oscillator, gainNode };
    }

    // Preload all audio assets
    preloadAll() {
        // Register sound effects (using procedural generation as fallback)
        this.registerSound('click', ['assets/sounds/click.mp3', 'assets/sounds/click.wav', 'assets/sounds/click.ogg']);
        this.registerSound('choice', ['assets/sounds/choice.mp3', 'assets/sounds/choice.wav', 'assets/sounds/choice.ogg']);
        this.registerSound('complete', ['assets/sounds/complete.mp3', 'assets/sounds/complete.wav', 'assets/sounds/complete.ogg']);
        this.registerSound('error', ['assets/sounds/error.mp3', 'assets/sounds/error.wav', 'assets/sounds/error.ogg']);
        this.registerSound('hover', ['assets/sounds/hover.mp3', 'assets/sounds/hover.wav', 'assets/sounds/hover.ogg']);
        this.registerSound('save', ['assets/sounds/save.mp3', 'assets/sounds/save.wav', 'assets/sounds/save.ogg']);
        this.registerSound('glitch', ['assets/sounds/glitch.mp3', 'assets/sounds/glitch.wav', 'assets/sounds/glitch.ogg']);
        this.registerSound('reveal', ['assets/sounds/reveal.mp3', 'assets/sounds/reveal.wav', 'assets/sounds/reveal.ogg']);
        
        // Register background music
        this.registerMusic('act1_sci_fi', 'assets/music/act1_ambient.mp3');
        this.registerMusic('act2_fantasy', 'assets/music/act2_medieval.mp3');
        this.registerMusic('act3_horror', 'assets/music/act3_horror.mp3');
        this.registerMusic('act4_realism', 'assets/music/act4_office.mp3');
        this.registerMusic('menu_theme', 'assets/music/menu_theme.mp3');
        this.registerMusic('twist_theme', 'assets/music/twist_reveal.mp3');
        this.registerMusic('ending_theme', 'assets/music/ending.mp3');
    }
}

// Create global audio system instance
const audioSystem = new AudioSystem();