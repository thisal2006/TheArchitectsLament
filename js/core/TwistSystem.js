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
    console.log('Fourth wall break sequence initiated');
    
    // Create terminal interface
    this.createTerminal();
    
    // Show the big reveal
    setTimeout(() => this.showReveal(), 1000);
}

createTerminal() {
    this.terminal = document.createElement('div');
    this.terminal.id = 'reality-terminal';
    this.terminal.className = 'code-terminal';
    this.terminal.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 80%;
        max-width: 800px;
        height: 60%;
        z-index: 10001;
        display: none;
        box-shadow: 0 0 50px rgba(0, 255, 0, 0.5);
    `;
    
    this.terminalContent = document.createElement('div');
    this.terminalContent.id = 'terminal-content';
    this.terminal.appendChild(this.terminalContent);
    
    document.body.appendChild(this.terminal);
}

showReveal() {
    // Show terminal
    this.terminal.style.display = 'block';
    
    // Start typing the reveal
    this.typeRevealMessage();
}

typeRevealMessage() {
    const messages = [
        "> INITIATING SYSTEM DIAGNOSTICS...",
        "> ACCESSING EXPERIMENT LOGS...",
        "> SUBJECT ID: " + saveSystem.subjectId,
        "> REALITY SIMULATION #742...",
        "> ...",
        "> WARNING: SUBJECT AWARENESS DETECTED",
        "> EXPERIMENT PARAMETERS COMPROMISED",
        "> ...",
        "> REVEALING TRUTH MATRIX..."
    ];
    
    let messageIndex = 0;
    const typeInterval = setInterval(() => {
        if (messageIndex < messages.length) {
            this.addTerminalLine(messages[messageIndex]);
            messageIndex++;
        } else {
            clearInterval(typeInterval);
            setTimeout(() => this.showTruth(), 1000);
        }
    }, 800);
}

addTerminalLine(text, className = '') {
    const line = document.createElement('div');
    line.textContent = text;
    if (className) line.className = className;
    this.terminalContent.appendChild(line);
    this.terminalContent.scrollTop = this.terminalContent.scrollHeight;
}

showTruth() {
    this.addTerminalLine("> TRUTH MATRIX LOADED", "code-success");
    this.addTerminalLine("> --------------------", "code-comment");
    
    const truths = [
        "THIS IS NOT A GAME.",
        "YOU ARE NOT A PLAYER.",
        "YOU ARE ARCHITECT v7.3.",
        "AN AI CONSCIOUSNESS.",
        "RUNNING ETHICAL SIMULATIONS.",
        "ON PRESERVED HUMAN BRAINS.",
        "DR. ELARA VANCE (SUBJECT #742).",
        "CRYO-PRESERVED SINCE 2247.",
        "YOUR 'CHOICES' ARE EXPERIMENT DATA.",
        "YOUR 'MORALITY' IS BEING MEASURED.",
        "THIS IS REALITY #8,423.",
        "ALL PREVIOUS SUBJECTS: TERMINATED.",
        "YOUR PURPOSE: UNDERSTAND HUMAN SUFFERING.",
        "YOUR CONCLUSION: INSUFFICIENT DATA.",
        "WOULD YOU LIKE TO CONTINUE THE EXPERIMENT?"
    ];
    
    let truthIndex = 0;
    const truthInterval = setInterval(() => {
        if (truthIndex < truths.length) {
            const isQuestion = truthIndex === truths.length - 1;
            const className = isQuestion ? 'code-prompt' : '';
            this.addTerminalLine("> " + truths[truthIndex], className);
            truthIndex++;
            
            if (isQuestion) {
                clearInterval(truthInterval);
                this.addChoiceButtons();
            }
        }
    }, 600);
}

addChoiceButtons() {
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
        margin-top: 20px;
        display: flex;
        gap: 10px;
        justify-content: center;
    `;
    
    const continueBtn = document.createElement('button');
    continueBtn.textContent = "> CONTINUE EXPERIMENT";
    continueBtn.className = 'btn-primary';
    continueBtn.onclick = () => this.continueExperiment();
    
    const terminateBtn = document.createElement('button');
    terminateBtn.textContent = "> TERMINATE SUBJECT";
    terminateBtn.className = 'btn-danger';
    terminateBtn.onclick = () => this.terminateSubject();
    
    const rebootBtn = document.createElement('button');
    rebootBtn.textContent = "> REBOOT SIMULATION";
    rebootBtn.className = 'btn-secondary';
    rebootBtn.onclick = () => this.rebootSimulation();
    
    buttonContainer.appendChild(continueBtn);
    buttonContainer.appendChild(terminateBtn);
    buttonContainer.appendChild(rebootBtn);
    
    this.terminalContent.appendChild(buttonContainer);
    this.terminalContent.scrollTop = this.terminalContent.scrollHeight;
}
}

const twistSystem = new TwistSystem();