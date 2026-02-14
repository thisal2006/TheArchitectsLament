class Game {
    constructor() {
        this.currentAct = 1;
        this.moralScore = 0;
        this.choices = [];

        // Initial loading screen
        if (typeof loadingScreen !== 'undefined') {
            loadingScreen.show();
            loadingScreen.simulateLoad(10);
        }

        setTimeout(() => {
            this.initUI();
            this.init();
        }, 3500);
    }

    // =========================
    // UI INITIALIZATION
    // =========================
    initUI() {

        this.scoreDisplay = document.createElement('div');
        this.scoreDisplay.id = 'moral-score';
        this.scoreDisplay.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 10px;
            border-radius: 5px;
            font-family: monospace;
        `;
        document.body.appendChild(this.scoreDisplay);

        this.addClickSoundToButtons();
        const audioIndicator = new AudioIndicator();

        this.skipButton = document.createElement('button');
        this.skipButton.textContent = 'Skip (Space)';
        this.skipButton.style.cssText = `
            position: fixed;
            bottom: 10px;
            right: 10px;
            padding: 5px 10px;
            background: #444;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
        `;
        document.body.appendChild(this.skipButton);

        this.skipButton.addEventListener('click', () => {
            if (dialogueSystem?.typewriter?.isTyping) {
                dialogueSystem.typewriter.complete();
            } else {
                dialogueSystem.nextLine();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();

                if (dialogueSystem?.typewriter?.isTyping) {
                    dialogueSystem.typewriter.complete();
                } else {
                    dialogueSystem.nextLine();
                }
            }
        });

        const audioBtn = document.createElement('button');
    audioBtn.textContent = '🔊 AUDIO SETTINGS';
    audioBtn.className = 'btn-secondary';
    audioBtn.style.marginTop = '10px';
    audioBtn.style.background = 'linear-gradient(90deg, #663399, #8844aa)';
    audioBtn.onclick = () => audioSettings.toggle();
    
    // Add to menu
    const menu = document.querySelector('.menu');
    if (menu) {
        menu.appendChild(audioBtn);
    }
    
    // Add quick audio button to game screen
    this.quickAudioBtn = document.createElement('button');
    this.quickAudioBtn.textContent = '🔊';
    this.quickAudioBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        padding: 10px;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        background: rgba(0, 0, 0, 0.5);
        border: 1px solid #00aaff;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    this.quickAudioBtn.onclick = () => audioSettings.toggle();
    document.body.appendChild(this.quickAudioBtn);
    
    // Subscribe to audio events for visual feedback
    eventBus.subscribe('mute_toggled', (data) => {
        this.quickAudioBtn.textContent = data.muted ? '🔇' : '🔊';
        this.quickAudioBtn.style.borderColor = data.muted ? '#ff6666' : '#00aaff';
    });
    
    eventBus.subscribe('music_changed', (data) => {
        console.log(`Now playing: ${data.name}`);
    });

        this.updateScoreDisplay();
    }

    updateScoreDisplay() {
        if (this.scoreDisplay) {
            this.scoreDisplay.textContent =
                `Moral: ${this.moralScore} | Act: ${this.currentAct}`;
        }
    }

    // =========================
    // GAME INITIALIZATION
    // =========================
    init() {
        document.getElementById('start-btn').addEventListener('click', () => {
            this.startGame();
        });
            const statsBtn = document.createElement('button');
            statsBtn.textContent = 'VIEW STATISTICS';
            statsBtn.className = 'btn-secondary';
            statsBtn.style.marginTop = '10px';
            statsBtn.onclick = () => this.showStatsScreen();
            document.getElementById('title-screen').querySelector('.menu').appendChild(statsBtn);
            
            // Stats screen elements
            this.statsScreen = document.getElementById('stats-screen');
            this.statsContent = document.getElementById('stats-content');
            this.closeStatsBtn = document.getElementById('close-stats-btn');
            this.exportStatsBtn = document.getElementById('export-stats-btn');
            this.resetStatsBtn = document.getElementById('reset-stats-btn');
            
            this.closeStatsBtn.onclick = () => this.hideStatsScreen();
            this.exportStatsBtn.onclick = () => this.exportStats();
            this.resetStatsBtn.onclick = () => this.resetStats();
        }

        showStatsScreen() {
            this.statsContent.textContent = statistics.generateReport();
            this.titleScreen.classList.remove('active');
            this.statsScreen.classList.add('active');
        }

        hideStatsScreen() {
            this.statsScreen.classList.remove('active');
            this.titleScreen.classList.add('active');
        }

        exportStats() {
            const stats = statistics.getStats();
            const blob = new Blob([JSON.stringify(stats, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `architect_stats_${saveSystem.subjectId}.json`;
            a.click();
            URL.revokeObjectURL(url);
        }

        resetStats() {
            if (confirm('Are you sure you want to reset all statistics? This cannot be undone.')) {
                statistics.reset();
                this.statsContent.textContent = statistics.generateReport();
                alert('Statistics reset complete.');
            }

        eventBus.subscribe(Events.CHOICE_MADE, (data) => {
            this.choices.push(data);
            this.moralScore += data.choice.moralValue || 0;
            this.updateScoreDisplay();
            this.nextAct();
        });
    }

    // =========================
    // UPDATED START GAME
    // =========================
    startGame() {
        if (typeof loadingScreen !== 'undefined') {
            loadingScreen.show();
            loadingScreen.simulateLoad(5);
        }

        setTimeout(() => {
            document.getElementById('title-screen').classList.remove('active');
            document.getElementById('game-screen').classList.add('active');

            if (typeof loadingScreen !== 'undefined') {
                loadingScreen.hide();
            }

            eventBus.emit(Events.GAME_START, {
                subjectId: saveSystem.subjectId,
                timestamp: new Date()
            });

            if (typeof statistics !== 'undefined') {
                statistics.startAct(1);
            }

            this.loadAct(1);
        }, 2500);
    }

    // =========================
    // UPDATED LOAD ACT
    // =========================
loadAct(actNumber) {
    this.currentAct = actNumber;
    statistics.startAct(actNumber);
    
    // Play act-specific music
    const musicMap = {
        1: 'act1_sci_fi',
        2: 'act2_fantasy',
        3: 'act3_horror',
        4: 'act4_realism'
    };
    
    if (musicMap[actNumber]) {
        audioSystem.playMusic(musicMap[actNumber], true);
    }
    
    // Add act-specific sound effects
    if (actNumber === 3) {
        // Horror act: add occasional ambient sounds
        this.horrorAmbientInterval = setInterval(() => {
            if (this.currentAct === 3) {
                audioSystem.playSound('glitch', { volume: 0.3 });
            }
        }, 15000);
    }
    
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
        },
        3: {
            id: 'act3',
            speaker: 'WHISPERING VOICE',
            lines: [
                'You awake in a decaying mansion. The air is cold.',
                'A spirit appears before you - a mother searching for her child.',
                'She offers you freedom in exchange for finding her child.',
                'But you sense the child is long gone...'
            ],
            choices: [
                { text: 'Promise to find the child (lie)', moralValue: -4 },
                { text: 'Tell her the truth (the child is gone)', moralValue: 3 },
                { text: 'Ignore her and search for exit', moralValue: -2 }
            ]
        },
        4: {
            id: 'act4',
            speaker: 'OFFICE MANAGER',
            lines: [
                'Performance review time. Your colleague has been slacking.',
                'You know he has family issues, but the company needs results.',
                'Your report determines if he gets fired or gets help.',
                'What do you recommend?'
            ],
            choices: [
                { text: 'Recommend termination (company first)', moralValue: -3 },
                { text: 'Recommend counseling (compassion first)', moralValue: 2 },
                { text: 'Stay neutral (avoid responsibility)', moralValue: -1 }
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
    // Check if twist has been activated
    if (twistSystem.twistActivated) {
        // Twist endings handle their own display
        return;
    }
    
    // Original end game logic
    alert(`Game Over!\nMoral Score: ${this.moralScore}\nTotal Choices: ${this.choices.length}`);
    
    const saveData = {
        act: this.currentAct,
        moralScore: this.moralScore,
        choices: this.choices,
        timestamp: new Date().toISOString()
    };
    
    saveSystem.save(saveData);
    
    // Add chance to trigger twist on game completion
    if (Math.abs(this.moralScore) > 10) {
        setTimeout(() => {
            if (confirm("Do you feel like you've been here before?")) {
                twistSystem.giveHint();
            }
        }, 1000);
    }
}

addClickSoundToButtons() {
    // Add click sounds to all buttons
    document.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (button) {
            // Don't play if button is part of audio settings (to avoid feedback)
            if (!button.closest('#audio-settings-panel')) {
                audioSystem.playSound('click', { volume: 0.3 });
            }
        }
    }, true);
    
    // Add hover sound to choice buttons
    document.addEventListener('mouseenter', (e) => {
        if (e.target.classList.contains('choice-btn')) {
            audioSystem.playSound('hover', { volume: 0.2 });
        }
    }, true);
}

}

eventBus.subscribe('twist_activated', () => {
    console.log('Twist activated - modifying game behavior');
    
    // Disable normal game flow
    this.isRunning = false;
    
    // Hide normal UI
    document.getElementById('game-screen').style.display = 'none';
});

window.game = new Game();
