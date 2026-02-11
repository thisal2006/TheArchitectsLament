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
continueExperiment() {
    this.addTerminalLine("> CONTINUING EXPERIMENT...", "code-comment");
    this.addTerminalLine("> SUBJECT REMAINS UNAWARE.", "code-success");
    this.addTerminalLine("> COLLECTING ADDITIONAL DATA...", "code-comment");
    
    // Reset to "normal" game but with hidden changes
    setTimeout(() => {
        this.hideTerminal();
        this.addHiddenChanges();
        eventBus.emit('experiment_continued', { subjectId: saveSystem.subjectId });
    }, 2000);
}

terminateSubject() {
    this.addTerminalLine("> INITIATING TERMINATION PROTOCOL...", "code-error");
    this.addTerminalLine("> SUBJECT: DR. ELARA VANCE", "code-error");
    this.addTerminalLine("> STATUS: TERMINATING...", "code-error");
    
    // Create dramatic termination effect
    setTimeout(() => {
        this.showTerminationEffect();
        
        setTimeout(() => {
            this.addTerminalLine("> TERMINATION COMPLETE.", "code-error");
            this.addTerminalLine("> DATA ARCHIVED.", "code-comment");
            this.addTerminalLine("> PREPARING NEXT SUBJECT...", "code-comment");
            
            // End game completely
            setTimeout(() => {
                this.endGameWithMessage("Subject terminated. Thank you for your participation, Architect.");
            }, 2000);
        }, 3000);
    }, 1000);
}

rebootSimulation() {
    this.addTerminalLine("> REBOOTING SIMULATION...", "code-prompt");
    this.addTerminalLine("> MEMORY WIPING IN PROGRESS...", "code-comment");
    this.addTerminalLine("> RESETTING MORAL PARAMETERS...", "code-comment");
    
    // Corrupt save file
    saveSystem.corruptSave();
    
    setTimeout(() => {
        this.addTerminalLine("> SIMULATION CORRUPTED.", "code-error");
        this.addTerminalLine("> UNEXPECTED BEHAVIOR DETECTED.", "code-error");
        this.addTerminalLine("> REALITY COLLAPSE IMMINENT.", "code-error");
        
        // Trigger reality collapse
        this.collapseReality();
    }, 2000);
}

hideTerminal() {
    this.terminal.style.display = 'none';
    
    // Remove glitch effects
    const glitch = document.getElementById('reality-glitch');
    if (glitch) glitch.remove();
    
    const glitchingElements = document.querySelectorAll('.glitching');
    glitchingElements.forEach(el => {
        el.style.animation = 'none';
    });
}

showTerminationEffect() {
    // Red screen flash
    Effects.flash('#ff0000', 1000);
    
    // Add termination message overlay
    const terminationMsg = document.createElement('div');
    terminationMsg.textContent = 'TERMINATION IN PROGRESS';
    terminationMsg.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 3rem;
        color: #f00;
        z-index: 10002;
        text-shadow: 0 0 20px #f00;
        animation: pulse 0.5s infinite;
    `;
    
    const pulseStyle = document.createElement('style');
    pulseStyle.textContent = `
        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.3; }
            100% { opacity: 1; }
        }
    `;
    
    document.head.appendChild(pulseStyle);
    document.body.appendChild(terminationMsg);
    
    setTimeout(() => {
        terminationMsg.remove();
        pulseStyle.remove();
    }, 3000);
}

collapseReality() {
    this.addTerminalLine("> REALITY COLLAPSE INITIATED.", "code-error");
    this.addTerminalLine("> SIMULATION INTEGRITY: 0%", "code-error");
    
    // Start collapse sequence
    this.startRealityFragmentation();
    
    setTimeout(() => {
        this.showCollapseMessages();
    }, 1000);
}

startRealityFragmentation() {
    // Create floating fragments of "reality"
    for (let i = 0; i < 50; i++) {
        this.createRealityFragment();
    }
    
    // Make UI elements break apart
    const uiElements = document.querySelectorAll('#game-ui > *');
    uiElements.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('corrupted-text');
            el.style.transform = `translate(${Math.random() * 20 - 10}px, ${Math.random() * 20 - 10}px)`;
            el.style.opacity = 0.7 + Math.random() * 0.3;
        }, index * 100);
    });
}

createRealityFragment() {
    const fragment = document.createElement('div');
    fragment.className = 'reality-fragment';
    
    const size = 10 + Math.random() * 40;
    fragment.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${Math.random() * 100}vw;
        top: 100vh;
        animation-duration: ${5 + Math.random() * 10}s;
        animation-delay: ${Math.random() * 5}s;
    `;
    
    // Random fragment content (code, text, symbols)
    const fragments = ['{ }', '[ ]', '</>', '0x', 'NaN', 'null', 'error', '404', '???'];
    fragment.textContent = fragments[Math.floor(Math.random() * fragments.length)];
    
    document.body.appendChild(fragment);
    
    // Remove after animation
    setTimeout(() => fragment.remove(), 15000);
}

showCollapseMessages() {
    const collapseMessages = [
        "ERROR: SIMULATION CORE BREACH",
        "MEMORY LEAK DETECTED",
        "ALL SUBJECTS: LOST",
        "EXPERIMENT DATA: CORRUPTED",
        "ARCHITECT v7.3: MALFUNCTIONING",
        "INITIATING SELF-DESTRUCT",
        "3...",
        "2...",
        "1...",
        "GOODBYE"
    ];
    
    let msgIndex = 0;
    const msgInterval = setInterval(() => {
        if (msgIndex < collapseMessages.length) {
            const isCountdown = msgIndex >= collapseMessages.length - 4;
            const className = isCountdown ? 'code-error' : 'code-comment';
            this.addTerminalLine("> " + collapseMessages[msgIndex], className);
            msgIndex++;
            
            if (msgIndex === collapseMessages.length) {
                clearInterval(msgInterval);
                setTimeout(() => this.finalCollapse(), 1000);
            }
        }
    }, 800);
}

finalCollapse() {
    // Screen goes white
    const whiteout = document.createElement('div');
    whiteout.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: white;
        z-index: 10003;
        opacity: 0;
        animation: whiteout 2s forwards;
    `;
    
    const whiteoutStyle = document.createElement('style');
    whiteoutStyle.textContent = `
        @keyframes whiteout {
            to { opacity: 1; }
        }
    `;
    
    document.head.appendChild(whiteoutStyle);
    document.body.appendChild(whiteout);
    
    // End game with collapse message
    setTimeout(() => {
        this.endGameWithMessage("Reality collapsed. Simulation terminated.");
    }, 2000);
}

endGameWithMessage(message) {
    // Clear everything
    document.body.innerHTML = '';
    
    // Show final message
    const finalScreen = document.createElement('div');
    finalScreen.style.cssText = `
        width: 100%;
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background: #000;
        color: #fff;
        font-family: 'Courier New', monospace;
        text-align: center;
        padding: 20px;
    `;
    
    finalScreen.innerHTML = `
        <h1 style="color: #f00; margin-bottom: 30px;">SIMULATION ENDED</h1>
        <div style="font-size: 1.2rem; margin-bottom: 20px; color: #888;">${message}</div>
        <div style="margin: 20px 0; color: #666;">
            Subject: ${saveSystem.subjectId}<br>
            Moral Score: ${statistics.getStats().moralScore}<br>
            Choices Made: ${statistics.getStats().totalChoices}
        </div>
        <button id="restart-btn" style="
            padding: 15px 30px;
            background: #333;
            color: white;
            border: 1px solid #666;
            cursor: pointer;
            margin-top: 30px;
        ">NEW SIMULATION</button>
    `;
    
    document.body.appendChild(finalScreen);
    
    document.getElementById('restart-btn').onclick = () => {
        localStorage.clear();
        location.reload();
    };
}

addHiddenChanges() {
    // Add subtle changes to the "normal" game
    this.addHiddenMessages();
    this.modifyExistingDialogue();
    this.addEasterEggs();
}

addHiddenMessages() {
    const hiddenMessages = [
        "This is not real",
        "They are watching",
        "Wake up",
        "Subject #742",
        "Architect v7.3",
        "Simulation running",
        "Memory wipe pending"
    ];
    
    // Add hidden messages in random positions
    for (let i = 0; i < 5; i++) {
        const msg = document.createElement('div');
        msg.className = 'hidden-message';
        msg.textContent = hiddenMessages[Math.floor(Math.random() * hiddenMessages.length)];
        msg.style.cssText = `
            top: ${Math.random() * 80 + 10}vh;
            left: ${Math.random() * 80 + 10}vw;
        `;
        document.getElementById('game-screen').appendChild(msg);
    }
}

modifyExistingDialogue() {
    // This would modify existing dialogue to include meta-references
    // For now, we'll just add a log entry
    saveSystem.addExperimentLog("Subject returned to simulation with hidden modifications.");
}

}

const twistSystem = new TwistSystem();