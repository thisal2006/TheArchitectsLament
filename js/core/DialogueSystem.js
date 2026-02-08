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
        if (typeof soundSystem !== 'undefined') {
            soundSystem.play('choice');
        }

        eventBus.emit(Events.CHOICE_MADE, {
            choice: choice,
            dialogueId: this.currentDialogue.id
        });

        if (choice.consequence) {
            alert(choice.consequence);
        }

        this.currentDialogue = null;
        this.choices = [];
    }
}

const dialogueSystem = new DialogueSystem();
