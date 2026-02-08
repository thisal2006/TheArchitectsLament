class TwistSystem {
    constructor() {
        this.realityShifted = false;
        this.hintsGiven = 0;
        this.maxHints = 5;
        this.twistActivated = false;
        
        this.hintMessages = [
            "Reality simulation unstable...",
            "Memory fragments don't match...",
            "Have we met before in another life?",
            "The walls between realities are thinning...",
            "Subject showing awareness of experiment..."
        ];
        
        this.init();
    }

    init() {
        // Listen for events that might trigger hints
        eventBus.subscribe(Events.CHOICE_MADE, (data) => {
            if (!this.twistActivated && this.hintsGiven < this.maxHints) {
                this.checkForHintTrigger(data);
            }
        });
        
        eventBus.subscribe(Events.ACT_CHANGE, (data) => {
            this.onActChange(data);
        });
    }

    checkForHintTrigger(choiceData) {
        const triggerChance = 0.2 + (this.hintsGiven * 0.1);
        
        if (Math.random() < triggerChance) {
            this.giveHint();
        }
    }

    giveHint() {
        if (this.hintsGiven >= this.maxHints) return;
        
        const hint = this.hintMessages[this.hintsGiven];
        this.hintsGiven++;
        
        // Show hint as a subtle message
        this.showHintMessage(hint);
        
        console.log(`Twist hint ${this.hintsGiven}/${this.maxHints}: ${hint}`);
        
        // Save hint given
        saveSystem.addExperimentLog(`Hint given to subject: ${hint}`);
        
        if (this.hintsGiven >= this.maxHints) {
            this.activateTwist();
        }
    }

    showHintMessage(message) {
        // Create a subtle hint display
        const hintElement = document.createElement('div');
        hintElement.className = 'twist-hint';
        hintElement.textContent = `⚠ ${message}`;
        hintElement.style.cssText = `
            position: fixed;
            bottom: 60px;
            right: 20px;
            background: rgba(255, 255, 0, 0.1);
            color: #ffff00;
            padding: 10px;
            border-radius: 5px;
            border: 1px solid #ffff00;
            font-size: 0.9rem;
            max-width: 300px;
            z-index: 1000;
            animation: fadeInOut 3s ease;
        `;
        
        // Add CSS animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translateY(20px); }
                20% { opacity: 1; transform: translateY(0); }
                80% { opacity: 1; transform: translateY(0); }
                100% { opacity: 0; transform: translateY(-20px); }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(hintElement);
        
        setTimeout(() => {
            hintElement.remove();
            style.remove();
        }, 3000);
    }

    onActChange(actData) {
        if (this.realityShifted) {
            this.showRealityShiftEffect();
        }
    }

    showRealityShiftEffect() {
        Effects.flash('#ffff00', 100);
        
        // Briefly distort text
        const dialogueText = document.getElementById('text');
        if (dialogueText) {
            const originalText = dialogueText.textContent;
            dialogueText.textContent = this.scrambleText(originalText);
            
            setTimeout(() => {
                dialogueText.textContent = originalText;
            }, 500);
        }
    }

    scrambleText(text) {
        return text.split('').map(char => {
            if (Math.random() > 0.7) {
                const scrambleChars = '█▓▒░▄▀▌▐αβγδεζηθ';
                return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
            }
            return char;
        }).join('');
    }

    activateTwist() {
        if (this.twistActivated) return;
        
        this.twistActivated = true;
        this.realityShifted = true;
        
        console.log('TWIST ACTIVATED: Reality shift initiated');
        
        // Emit twist event
        eventBus.emit('twist_activated', {
            timestamp: new Date().toISOString(),
            subjectId: saveSystem.subjectId,
            hintsGiven: this.hintsGiven
        });
        
        // Add to experiment logs
        saveSystem.addExperimentLog(`Subject has triggered reality awareness.`);
        saveSystem.addExperimentLog(`Initiating phase 2 of experiment.`);
        
        // Begin the big reveal
        setTimeout(() => this.beginReveal(), 1000);
    }

    beginReveal() {
        // This will be expanded in future commits
        this.showRealityGlitch();
        
        // Start the reality breakdown
        setTimeout(() => this.breakFourthWall(), 2000);
    }

    showRealityGlitch() {
        const glitchOverlay = document.createElement('div');
        glitchOverlay.id = 'reality-glitch';
        glitchOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: 
                repeating-linear-gradient(
                    0deg,
                    transparent,
                    transparent 2px,
                    rgba(255, 0, 255, 0.1) 2px,
                    rgba(255, 0, 255, 0.1) 4px
                ),
                repeating-linear-gradient(
                    90deg,
                    transparent,
                    transparent 2px,
                    rgba(0, 255, 255, 0.1) 2px,
                    rgba(0, 255, 255, 0.1) 4px
                );
            pointer-events: none;
            z-index: 9999;
            opacity: 0;
            animation: glitchFadeIn 2s forwards;
        `;
        
        const glitchStyle = document.createElement('style');
        glitchStyle.textContent = `
            @keyframes glitchFadeIn {
                to { opacity: 0.3; }
            }
            
            @keyframes glitchShift {
                0% { transform: translateX(0); }
                10% { transform: translateX(-2px); }
                20% { transform: translateX(2px); }
                30% { transform: translateX(-1px); }
                40% { transform: translateX(1px); }
                50% { transform: translateX(0); }
                100% { transform: translateX(0); }
            }
        `;
        
        document.head.appendChild(glitchStyle);
        document.body.appendChild(glitchOverlay);
        
        // Add glitch effect to game elements
        const gameElements = document.querySelectorAll('#game-screen > *');
        gameElements.forEach(el => {
            el.style.animation = 'glitchShift 0.5s infinite';
        });
    }

    breakFourthWall() {
        // To be implemented in next commit
        console.log('Fourth wall break sequence initiated');
    }
}

const twistSystem = new TwistSystem();