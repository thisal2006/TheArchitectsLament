class Game {
    constructor() {
        this.currentAct = 1;
        this.moralScore = 0;
        this.choices = [];
        this.init();
    }

    init() {
        document.getElementById('start-btn').addEventListener('click', () => {
            this.startGame();
        });

        eventBus.subscribe(Events.CHOICE_MADE, (data) => {
            this.choices.push(data);
            this.moralScore += data.choice.moralValue || 0;
            this.nextAct();
        });
    }

    startGame() {
        document.getElementById('title-screen').classList.remove('active');
        document.getElementById('game-screen').classList.add('active');
        
        eventBus.emit(Events.GAME_START, {
            subjectId: saveSystem.subjectId,
            timestamp: new Date()
        });
        
        this.loadAct(1);
    }

    loadAct(actNumber) {
        this.currentAct = actNumber;
        
        const acts = {
            1: {
                id: 'act1',
                speaker: 'SHIP AI',
                lines: [
                    'Alert: Oxygen levels critical in Sector 7-B.',
                    'Life support failure in 5 minutes.',
                    'Two crew members trapped. Only one oxygen mask.',
                    'Who do you save?'
                ],
                choices: [
                    { text: 'Save the engineer (crew of 50 depend on him)', moralValue: -2 },
                    { text: 'Save the medic (only medical expert on board)', moralValue: -2 },
                    { text: 'Try to save both (risk losing both)', moralValue: 1 }
                ]
            },

            2: {
                id: 'act2',
                speaker: 'KING ARCTURUS',
                lines: [
                    'Welcome, Sir Knight. The prisoner has confessed.',
                    'He stole bread during the famine to feed his family.',
                    'The law demands execution for theft from the royal stores.',
                    'What is your judgment?'
                ],
                choices: [
                    { text: 'Execute him (uphold the law)', moralValue: -3 },
                    { text: 'Pardon him (show mercy)', moralValue: 2 },
                    { text: 'Imprison him (compromise)', moralValue: -1 }
                ]
            }
        };

        if (acts[actNumber]) {
            dialogueSystem.start(acts[actNumber]);
        }
    }

    nextAct() {
        this.currentAct++;
        if (this.currentAct <= 4) {
            this.loadAct(this.currentAct);
        } else {
            this.endGame();
        }
    }

    endGame() {
        alert(`Game Over!\nMoral Score: ${this.moralScore}\nTotal Choices: ${this.choices.length}`);
        
        const saveData = {
            act: this.currentAct,
            moralScore: this.moralScore,
            choices: this.choices,
            timestamp: new Date().toISOString()
        };
        
        saveSystem.save(saveData);
    }
}

const game = new Game();