class DataCorruption {
    constructor() {
        this.corruptionLevel = 0;
        this.corruptedElements = new Set();
        this.init();
    }

    init() {
        // Gradually increase corruption over time
        setInterval(() => {
            if (twistSystem.twistActivated && this.corruptionLevel < 100) {
                this.corruptionLevel += 0.1;
                this.applyCorruption();
            }
        }, 1000);
    }

    applyCorruption() {
        // Corrupt random text elements
        if (Math.random() < this.corruptionLevel / 500) {
            this.corruptRandomText();
        }
        
        // Corrupt save data occasionally
        if (Math.random() < this.corruptionLevel / 10000) {
            this.corruptSaveData();
        }
        
        // Add visual corruption at higher levels
        if (this.corruptionLevel > 50 && Math.random() < 0.01) {
            this.addVisualCorruption();
        }
    }

    corruptRandomText() {
        const textElements = document.querySelectorAll('p, div, span, button');
        if (textElements.length === 0) return;
        
        const element = textElements[Math.floor(Math.random() * textElements.length)];
        if (this.corruptedElements.has(element)) return;
        
        const originalText = element.textContent;
        if (!originalText || originalText.length < 3) return;
        
        this.corruptedElements.add(element);
        
        // Store original
        element.dataset.originalText = originalText;
        
        // Corrupt the text
        const corrupted = this.corruptText(originalText);
        element.textContent = corrupted;
        
        // Restore after delay
        setTimeout(() => {
            if (element.dataset.originalText) {
                element.textContent = element.dataset.originalText;
                this.corruptedElements.delete(element);
            }
        }, 3000 + Math.random() * 7000);
    }

    corruptText(text) {
        const words = text.split(' ');
        const corruptedWords = words.map(word => {
            if (Math.random() > 0.7) {
                // Sometimes corrupt entire word
                const corruptionTypes = [
                    '█'.repeat(word.length),
                    'ERROR',
                    'NULL',
                    '0x' + Math.random().toString(16).substr(2, 4),
                    word.split('').reverse().join(''),
                    word.toUpperCase()
                ];
                return corruptionTypes[Math.floor(Math.random() * corruptionTypes.length)];
            } else if (Math.random() > 0.5) {
                // Sometimes corrupt characters
                return word.split('').map(char => {
                    if (Math.random() > 0.8) {
                        const corruptChars = '�@#$%&*�';
                        return corruptChars[Math.floor(Math.random() * corruptChars.length)];
                    }
                    return char;
                }).join('');
            }
            return word;
        });
        
        return corruptedWords.join(' ');
    }

    corruptSaveData() {
        if (!saveSystem.currentSave) return;
        
        // Add corruption markers to save
        if (!saveSystem.currentSave.corruptionLogs) {
            saveSystem.currentSave.corruptionLogs = [];
        }
        
        const corruption = {
            timestamp: new Date().toISOString(),
            type: 'DATA_CORRUPTION',
            message: `Memory corruption detected at corruption level ${this.corruptionLevel.toFixed(1)}%`,
            severity: Math.min(Math.floor(this.corruptionLevel / 10), 10)
        };
        
        saveSystem.currentSave.corruptionLogs.push(corruption);
        
        // Occasionally lose some choice data
        if (Math.random() < 0.3 && saveSystem.currentSave.gameState.moralChoices) {
            const lostChoices = Math.floor(Math.random() * 3) + 1;
            saveSystem.currentSave.gameState.moralChoices.splice(-lostChoices, lostChoices);
            corruption.message += ` | Lost ${lostChoices} choice records`;
        }
        
        saveSystem.saveGame(saveSystem.currentSave);
        console.log('Save data corrupted:', corruption.message);
    }

    addVisualCorruption() {
        // Create temporary visual glitch
        const glitch = document.createElement('div');
        glitch.style.cssText = `
            position: fixed;
            top: ${Math.random() * 100}vh;
            left: ${Math.random() * 100}vw;
            width: ${50 + Math.random() * 100}px;
            height: ${10 + Math.random() * 50}px;
            background: rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.3);
            z-index: 9997;
            pointer-events: none;
            animation: visualGlitch ${0.5 + Math.random()}s ease;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes visualGlitch {
                0% { opacity: 0; transform: scale(0); }
                50% { opacity: 1; transform: scale(1) rotate(${Math.random() * 360}deg); }
                100% { opacity: 0; transform: scale(0); }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(glitch);
        
        setTimeout(() => {
            glitch.remove();
            style.remove();
        }, 1000);
    }

    getCorruptionReport() {
        return {
            level: this.corruptionLevel,
            corruptedElements: this.corruptedElements.size,
            saveCorruptions: saveSystem.currentSave?.corruptionLogs?.length || 0
        };
    }
}

const dataCorruption = new DataCorruption();