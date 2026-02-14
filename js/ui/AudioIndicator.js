class AudioIndicator {
    constructor() {
        this.createIndicator();
        this.bindEvents();
    }

    createIndicator() {
        this.indicator = document.createElement('div');
        this.indicator.id = 'audio-indicator';
        this.indicator.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: rgba(0, 0, 0, 0.5);
            border: 2px solid #00aaff;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            z-index: 9999;
            transition: all 0.3s;
        `;
        
        this.indicator.textContent = audioSystem.muted ? '🔇' : '🔊';
        this.indicator.title = 'Click to toggle mute';
        
        this.indicator.onclick = () => {
            const muted = audioSystem.toggleMute();
            this.indicator.textContent = muted ? '🔇' : '🔊';
            this.indicator.style.borderColor = muted ? '#ff6666' : '#00aaff';
        };
        
        document.body.appendChild(this.indicator);
    }

    bindEvents() {
        eventBus.subscribe('mute_toggled', (data) => {
            this.indicator.textContent = data.muted ? '🔇' : '🔊';
            this.indicator.style.borderColor = data.muted ? '#ff6666' : '#00aaff';
        });
        
        eventBus.subscribe('music_changed', (data) => {
            // Add visual pulse when music changes
            this.indicator.style.transform = 'scale(1.2)';
            setTimeout(() => {
                this.indicator.style.transform = 'scale(1)';
            }, 200);
        });
    }
}

const audioIndicator = new AudioIndicator();