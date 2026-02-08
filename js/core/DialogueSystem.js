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
        this.typeNextLine();

    }

    nextLine() {
        if (this.currentLine < this.currentDialogue.lines.length - 1) {
            this.currentLine++;
            this.updateUI();
            return true;
        }
        return false;
    }

    
    typeNextLine() {
        const line = this.currentDialogue.lines[this.currentLine];
        this.typewriter.type(line);
    }

    showChoicesIfReady() {
        if (this.currentLine === this.currentDialogue.lines.length - 1) {
            this.showChoices();
        }
    }

    updateUI() {
        const dialogue = this.currentDialogue;
        if (!dialogue) return;

        document.getElementById('speaker').textContent = dialogue.speaker || 'Unknown';
        this.typeNextLine();
        
        const choicesDiv = document.getElementById('choices');
        choicesDiv.innerHTML = '';
        
        if (this.currentLine === dialogue.lines.length - 1 && this.choices.length > 0) {
            this.choices.forEach((choice, index) => {
                const btn = document.createElement('button');
                btn.className = 'choice-btn';
                btn.textContent = `${index + 1}. ${choice.text}`;
                btn.onclick = () => this.makeChoice(choice);
                choicesDiv.appendChild(btn);
            });
        }
    }

    makeChoice(choice) {
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