class AudioSettings {
    constructor() {
        this.panel = null;
        this.isVisible = false;
        this.createSettingsPanel();
        this.bindEvents();
    }

    createSettingsPanel() {
        // Create settings panel
        this.panel = document.createElement('div');
        this.panel.id = 'audio-settings-panel';
        this.panel.className = 'settings-panel';
        this.panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 400px;
            background: rgba(10, 10, 26, 0.95);
            border: 2px solid #00aaff;
            border-radius: 10px;
            padding: 30px;
            z-index: 10002;
            display: none;
            color: white;
            font-family: 'Raleway', sans-serif;
            box-shadow: 0 0 50px rgba(0, 170, 255, 0.3);
            backdrop-filter: blur(5px);
        `;

        // Create header
        const header = document.createElement('h2');
        header.textContent = 'AUDIO SETTINGS';
        header.style.cssText = `
            color: #00ffff;
            margin-bottom: 30px;
            text-align: center;
            border-bottom: 1px solid #00aaff;
            padding-bottom: 15px;
        `;
        this.panel.appendChild(header);

        // Music volume control
        this.panel.appendChild(this.createVolumeControl(
            'Music Volume',
            'music',
            audioSystem.musicVolume
        ));

        // SFX volume control
        this.panel.appendChild(this.createVolumeControl(
            'Sound Effects',
            'sfx',
            audioSystem.sfxVolume
        ));

        // Toggle buttons
        const toggles = document.createElement('div');
        toggles.style.cssText = `
            display: flex;
            justify-content: space-between;
            margin: 20px 0;
        `;

        // Music toggle
        toggles.appendChild(this.createToggleButton(
            'Music',
            'music',
            audioSystem.musicEnabled
        ));

        // SFX toggle
        toggles.appendChild(this.createToggleButton(
            'SFX',
            'sfx',
            audioSystem.sfxEnabled
        ));

        // Mute toggle
        toggles.appendChild(this.createToggleButton(
            'Mute All',
            'mute',
            audioSystem.muted
        ));

        this.panel.appendChild(toggles);

        // Test sound button
        const testBtn = document.createElement('button');
        testBtn.textContent = '🔊 TEST SOUND';
        testBtn.className = 'btn-secondary';
        testBtn.style.cssText = `
            width: 100%;
            margin: 20px 0;
            padding: 12px;
            font-size: 1rem;
        `;
        testBtn.onclick = () => this.testSound();
        this.panel.appendChild(testBtn);

        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'CLOSE';
        closeBtn.className = 'btn-primary';
        closeBtn.style.cssText = `
            width: 100%;
            margin-top: 10px;
        `;
        closeBtn.onclick = () => this.hide();
        this.panel.appendChild(closeBtn);

        document.body.appendChild(this.panel);
    }

    createVolumeControl(label, type, initialValue) {
        const container = document.createElement('div');
        container.style.cssText = `
            margin-bottom: 20px;
        `;

        const labelRow = document.createElement('div');
        labelRow.style.cssText = `
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            color: #8888cc;
        `;

        const labelText = document.createElement('span');
        labelText.textContent = label;

        const valueDisplay = document.createElement('span');
        valueDisplay.id = `${type}-volume-value`;
        valueDisplay.textContent = `${Math.round(initialValue * 100)}%`;

        labelRow.appendChild(labelText);
        labelRow.appendChild(valueDisplay);
        container.appendChild(labelRow);

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.id = `${type}-volume-slider`;
        slider.min = 0;
        slider.max = 100;
        slider.value = initialValue * 100;
        slider.style.cssText = `
            width: 100%;
            height: 6px;
            background: linear-gradient(90deg, #00aaff ${initialValue * 100}%, #333 ${initialValue * 100}%);
            border-radius: 3px;
            -webkit-appearance: none;
            appearance: none;
        `;

        slider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value) / 100;
            document.getElementById(`${type}-volume-value`).textContent = `${Math.round(value * 100)}%`;
            
            // Update gradient
            e.target.style.background = `linear-gradient(90deg, #00aaff ${value * 100}%, #333 ${value * 100}%)`;
            
            if (type === 'music') {
                audioSystem.setMusicVolume(value);
            } else {
                audioSystem.setSFXVolume(value);
            }
        });

        container.appendChild(slider);

        return container;
    }

    createToggleButton(label, type, initialState) {
        const btn = document.createElement('button');
        btn.textContent = `${label}: ${initialState ? 'ON' : 'OFF'}`;
        btn.style.cssText = `
            padding: 8px 16px;
            background: ${initialState ? 'rgba(0, 170, 255, 0.3)' : 'rgba(100, 100, 100, 0.3)'};
            border: 1px solid ${initialState ? '#00aaff' : '#888'};
            color: ${initialState ? '#00aaff' : '#888'};
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.3s;
            font-size: 0.9rem;
        `;

        btn.onclick = () => {
            let newState;
            if (type === 'music') {
                newState = audioSystem.toggleMusic();
            } else if (type === 'sfx') {
                newState = audioSystem.toggleSFX();
            } else {
                newState = audioSystem.toggleMute();
            }
            btn.textContent = `${label}: ${newState ? 'ON' : 'OFF'}`;
            btn.style.background = newState ? 'rgba(0, 170, 255, 0.3)' : 'rgba(100, 100, 100, 0.3)';
            btn.style.borderColor = newState ? '#00aaff' : '#888';
            btn.style.color = newState ? '#00aaff' : '#888';
        };

        return btn;
    }

    testSound() {
        // Play test sound sequence
        if (proceduralAudio.audioContext) {
            proceduralAudio.generateClick();
            setTimeout(() => proceduralAudio.generateChoice(), 200);
            setTimeout(() => proceduralAudio.generateGlitch(), 400);
        } else {
            audioSystem.playSound('click');
        }
    }

    show() {
        // Update current values
        this.updateUI();
        this.panel.style.display = 'block';
        this.isVisible = true;
        
        // Add backdrop
        this.backdrop = document.createElement('div');
        this.backdrop.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 10001;
        `;
        this.backdrop.onclick = () => this.hide();
        document.body.appendChild(this.backdrop);
    }

    hide() {
        this.panel.style.display = 'none';
        this.isVisible = false;
        if (this.backdrop) {
            this.backdrop.remove();
        }
        audioSystem.saveSettings();
    }

    updateUI() {
        // Update sliders
        const musicSlider = document.getElementById('music-volume-slider');
        const sfxSlider = document.getElementById('sfx-volume-slider');
        
        if (musicSlider) {
            musicSlider.value = audioSystem.musicVolume * 100;
            musicSlider.style.background = `linear-gradient(90deg, #00aaff ${audioSystem.musicVolume * 100}%, #333 ${audioSystem.musicVolume * 100}%)`;
            document.getElementById('music-volume-value').textContent = `${Math.round(audioSystem.musicVolume * 100)}%`;
        }
        
        if (sfxSlider) {
            sfxSlider.value = audioSystem.sfxVolume * 100;
            sfxSlider.style.background = `linear-gradient(90deg, #00aaff ${audioSystem.sfxVolume * 100}%, #333 ${audioSystem.sfxVolume * 100}%)`;
            document.getElementById('sfx-volume-value').textContent = `${Math.round(audioSystem.sfxVolume * 100)}%`;
        }
    }

    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }
}

const audioSettings = new AudioSettings();