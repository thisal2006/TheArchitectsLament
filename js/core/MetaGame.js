class MetaGame {
    constructor() {
        this.metaLevel = 0;
        this.unlockedInsights = [];
        this.init();
    }

    init() {
        // Listen for events that might trigger meta-awareness
        eventBus.subscribe(Events.CHOICE_MADE, (data) => {
            this.checkForMetaTrigger(data);
        });
        
        eventBus.subscribe('twist_activated', () => {
            this.unlockInsight('REALITY_AWARENESS');
        });
    }

    checkForMetaTrigger(choiceData) {
        // Check for patterns that might indicate player is "catching on"
        const choices = saveSystem.currentSave?.gameState?.moralChoices || [];
        
        if (choices.length >= 3) {
            // Check for consistent moral pattern
            const recentChoices = choices.slice(-3);
            const allSameSign = recentChoices.every(c => 
                (c.moralValue || 0) > 0) || recentChoices.every(c => 
                (c.moralValue || 0) < 0);
            
            if (allSameSign && this.metaLevel < 1) {
                this.increaseMetaLevel();
                this.showMetaHint("Your choices show a pattern...");
            }
        }
        
        // Check for rapid clicking (skipping dialogue)
        this.checkForRapidInteraction();
    }

    checkForRapidInteraction() {
        let clickCount = 0;
        let lastClickTime = 0;
        
        document.addEventListener('click', (e) => {
            const now = Date.now();
            if (now - lastClickTime < 200) { // Rapid clicking
                clickCount++;
                if (clickCount > 5 && this.metaLevel < 2) {
                    this.increaseMetaLevel();
                    this.showMetaHint("You're in a hurry... Why?");
                    clickCount = 0;
                }
            } else {
                clickCount = 0;
            }
            lastClickTime = now;
        });
    }

    increaseMetaLevel() {
        this.metaLevel++;
        console.log(`Meta level increased to: ${this.metaLevel}`);
        
        // Unlock insights at certain levels
        const insights = [
            { level: 1, id: 'PATTERN_RECOGNITION', message: "You notice patterns in the choices." },
            { level: 2, id: 'SIMULATION_DOUBT', message: "Something feels artificial about this world." },
            { level: 3, id: 'MEMORY_FRAGMENTS', message: "Fragmented memories of other realities surface." },
            { level: 5, id: 'ARCHITECT_IDENTITY', message: "You remember your true purpose." }
        ];
        
        insights.forEach(insight => {
            if (this.metaLevel >= insight.level && !this.unlockedInsights.includes(insight.id)) {
                this.unlockInsight(insight.id, insight.message);
            }
        });
        
        // Save meta progress
        this.saveMetaData();
    }

    unlockInsight(insightId, message = '') {
        if (!this.unlockedInsights.includes(insightId)) {
            this.unlockedInsights.push(insightId);
            
            if (message) {
                this.showMetaHint(message);
            }
            
            saveSystem.addExperimentLog(`Subject unlocked insight: ${insightId}`);
            
            // Check if enough insights for twist activation
            if (this.unlockedInsights.length >= 3) {
                setTimeout(() => {
                    if (!twistSystem.twistActivated) {
                        twistSystem.activateTwist();
                    }
                }, 2000);
            }
        }
    }

    showMetaHint(message) {
        // Similar to twist hints but with different style
        const hint = document.createElement('div');
        hint.className = 'meta-hint';
        hint.textContent = `💭 ${message}`;
        hint.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(100, 100, 255, 0.1);
            color: #8888ff;
            padding: 10px 20px;
            border-radius: 5px;
            border: 1px solid #8888ff;
            font-size: 0.9rem;
            z-index: 999;
            animation: metaHintFade 4s ease;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes metaHintFade {
                0% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
                20% { opacity: 1; transform: translateX(-50%) translateY(0); }
                80% { opacity: 1; transform: translateX(-50%) translateY(0); }
                100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(hint);
        
        setTimeout(() => {
            hint.remove();
            style.remove();
        }, 4000);
    }

    saveMetaData() {
        const metaData = {
            metaLevel: this.metaLevel,
            unlockedInsights: this.unlockedInsights,
            lastUpdated: new Date().toISOString()
        };
        
        localStorage.setItem('architect_meta', JSON.stringify(metaData));
    }

    loadMetaData() {
        const saved = localStorage.getItem('architect_meta');
        if (saved) {
            const metaData = JSON.parse(saved);
            this.metaLevel = metaData.metaLevel || 0;
            this.unlockedInsights = metaData.unlockedInsights || [];
        }
    }

    getMetaStatus() {
        return {
            level: this.metaLevel,
            insights: this.unlockedInsights,
            progress: (this.unlockedInsights.length / 5) * 100
        };
    }
}

const metaGame = new MetaGame();