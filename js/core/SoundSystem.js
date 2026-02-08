class SoundSystem {
    constructor() {
        this.sounds = {};
        this.muted = false;
    }

    load(name, url) {
        const audio = new Audio(url);
        this.sounds[name] = audio;
    }

    play(name, volume = 1.0) {
        if (this.muted || !this.sounds[name]) return;
        
        const sound = this.sounds[name].cloneNode();
        sound.volume = volume;
        sound.play().catch(e => console.log('Audio play failed:', e));
    }

    mute() {
        this.muted = true;
    }

    unmute() {
        this.muted = false;
    }
}

const soundSystem = new SoundSystem();