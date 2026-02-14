class DialogueSystem {
    constructor() {
        this.currentDialogue = null;
        this.currentLine = 0;
        this.choices = [];
        this.typewriter = new Typewriter(document.getElementById('text'), 40);
        this.typewriter.onComplete = () => this.showChoicesIfReady();
    }

    start(dialogue) {
        this.currentDialogue = dialogue;
        this.currentLine = 0;
        this.choices = dialogue.choices || [];
        this.updateUI();
    }

    nextLine() {
        if (this.currentLine < this.currentDialogue.lines.length - 1) {
            this.currentLine++;
            this.updateUI();
            return true;
        }
        return false;
    }

    typeCurrentLine() {
        const line = this.currentDialogue.lines[this.currentLine];
        this.typewriter.type(line);
    }

    updateUI() {
        const dialogue = this.currentDialogue;
        if (!dialogue) return;

        document.getElementById('speaker').textContent =
            dialogue.speaker || 'Unknown';

        const choicesDiv = document.getElementById('choices');
        choicesDiv.innerHTML = '';

        this.typeCurrentLine();
    }

    // =============================
    // NEW FLOW CONTROL
    // =============================

    showChoicesIfReady() {
        if (this.currentLine === this.currentDialogue.lines.length - 1) {
            this.showChoices();
        } else {
            this.showContinuePrompt();
        }
    }

    showContinuePrompt() {
        const continueBtn = document.createElement('button');
        continueBtn.textContent = 'Continue (Space)';
        continueBtn.className = 'continue-btn';
        continueBtn.onclick = () => this.nextLine();

        const choicesDiv = document.getElementById('choices');
        choicesDiv.innerHTML = '';
        choicesDiv.appendChild(continueBtn);
    }

    showChoices() {
        const choicesDiv = document.getElementById('choices');
        choicesDiv.innerHTML = '';

        this.choices.forEach((choice) => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';

            btn.innerHTML = `
                ${choice.text}
                <span class="moral-value ${choice.moralValue > 0 ? 'positive' : 'negative'}">
                    ${choice.moralValue > 0 ? '+' : ''}${choice.moralValue}
                </span>
            `;

            btn.onclick = () => this.makeChoice(choice);
            choicesDiv.appendChild(btn);
        });
    }

makeChoice(choice) {
    // Play choice sound
    audioSystem.playSound('choice', { 
        volume: 0.5,
        pitch: choice.moralValue > 0 ? 1.2 : 0.8
    });
    
    // Record choice
    this.choiceHistory.push({
        timestamp: new Date().toISOString(),
        dialogueId: this.currentDialogue.id,
        choiceId: choice.id,
        choiceText: choice.text,
        moralValue: choice.moralValue,
        consequence: choice.consequence
    });

    // Save to game state
    if (saveSystem.currentSave) {
        if (!saveSystem.currentSave.gameState.moralChoices) {
            saveSystem.currentSave.gameState.moralChoices = [];
        }
        saveSystem.currentSave.gameState.moralChoices.push({
            act: saveSystem.currentSave.gameState.currentAct || 1,
            ...this.choiceHistory[this.choiceHistory.length - 1]
        });
        saveSystem.saveGame(saveSystem.currentSave);
    }

    // Emit events
    eventBus.emit(EventTypes.CHOICE_MADE, {
        choiceId: choice.id,
        text: choice.text,
        moralValue: choice.moralValue,
        context: this.currentDialogue.context
    });

    if (choice.moralValue !== 0) {
        eventBus.emit(EventTypes.MORAL_DECISION, {
            choiceId: choice.id,
            value: choice.moralValue,
            isEthical: choice.moralValue > 0
        });
    }

    console.log(`Choice selected: ${choice.text} (Moral: ${choice.moralValue})`);
    
    // Clear current dialogue
    this.currentDialogue = null;
    this.choices = [];
    
    return choice;
}

nextLine() {
    if (this.currentLine < this.currentDialogue.lines.length - 1) {
        this.currentLine++;
        const nextLine = this.currentDialogue.lines[this.currentLine];
        this.startTypewriter(nextLine);
        
        // Play typing sound
        audioSystem.playSound('click', { volume: 0.1, pitch: 1.5 });
        return true;
    }
    return false;
}
}

const dialogueSystem = new DialogueSystem();
