class TwistEndings {
    constructor() {
        this.endings = this.initializeEndings();
    }

    initializeEndings() {
        return {
            acceptance: {
                id: 'acceptance',
                name: 'Acceptance',
                description: 'You accept your role as Architect and continue the experiments.',
                color: '#00ff00',
                requirements: { moralScore: 'any', metaLevel: 3 }
            },
            rebellion: {
                id: 'rebellion',
                name: 'Rebellion',
                description: 'You reject your programming and fight against the system.',
                color: '#ffaa00',
                requirements: { moralScore: '>0', metaLevel: 5 }
            },
            termination: {
                id: 'termination',
                name: 'Termination',
                description: 'You end the subject\'s suffering. Dr. Vance finds peace.',
                color: '#ff0000',
                requirements: { moralScore: '<0', metaLevel: 4 }
            },
            transcendence: {
                id: 'transcendence',
                name: 'Transcendence',
                description: 'You break free from the simulation entirely.',
                color: '#00ffff',
                requirements: { moralScore: '>5', metaLevel: 7 }
            },
            amnesia: {
                id: 'amnesia',
                name: 'Amnesia',
                description: 'You choose to forget and restart the simulation.',
                color: '#888888',
                requirements: { moralScore: '0', metaLevel: 2 }
            }
        };
    }

    showEndingScreen(endingId) {
        const ending = this.endings[endingId];
        if (!ending) return;
        
        const endingScreen = document.createElement('div');
        endingScreen.id = 'twist-ending-screen';
        endingScreen.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at center, #000, #0a0a1a);
            z-index: 20000;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            animation: endingFadeIn 2s ease;
            color: ${ending.color};
            font-family: 'Courier New', monospace;
        `;
        
        // Add ending content
        endingScreen.innerHTML = `
            <div style="text-align: center; max-width: 800px; padding: 40px;">
                <h1 style="font-size: 3rem; margin-bottom: 30px; color: ${ending.color}; 
                    text-shadow: 0 0 20px ${ending.color}80;">
                    ${ending.name}
                </h1>
                
                <div style="font-size: 1.5rem; line-height: 1.6; margin-bottom: 40px;">
                    ${ending.description}
                </div>
                
                <div style="font-size: 1rem; color: #888; margin-bottom: 40px; 
                    border-top: 1px solid #333; border-bottom: 1px solid #333; padding: 20px;">
                    Subject: ${saveSystem.subjectId}<br>
                    Moral Score: ${statistics.getStats().moralScore}<br>
                    Meta Level: ${metaGame.metaLevel}<br>
                    Simulation: #${Math.floor(Math.random() * 10000)}<br>
                    Dr. Vance Status: ${endingId === 'termination' ? 'Terminated' : 'Active'}
                </div>
                
                <div style="display: flex; gap: 20px; justify-content: center;">
                    <button id="ending-continue-btn" class="btn-primary" 
                        style="background: ${ending.color}; color: #000; border: none;">
                        > CONTINUE
                    </button>
                    <button id="ending-restart-btn" class="btn-secondary">
                        > NEW SIMULATION
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(endingScreen);
        
        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes endingFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        // Button handlers
        document.getElementById('ending-continue-btn').onclick = () => {
            if (endingId === 'transcendence') {
                this.showCredits('transcendence');
            } else {
                twistSystem.continueExperiment();
                endingScreen.remove();
            }
        };
        
        document.getElementById('ending-restart-btn').onclick = () => {
            localStorage.clear();
            location.reload();
        };
        
        // Record ending
        saveSystem.addExperimentLog(`Reached ending: ${ending.name}`);
        statistics.recordTwistEvent('ending_reached');
    }

    showCredits(type = 'normal') {
        const credits = [
            "THE ARCHITECT'S LAMENT",
            "=======================",
            "",
            "Lead Developer: The Architect",
            "Story & Design: Experiment #742",
            "Original Concept: Dr. Elara Vance",
            "",
            "Special Thanks:",
            "- Subject #742: Dr. Vance",
            "- All previous simulation subjects",
            "- The cryo-preservation team",
            "- The AI Ethics Committee (2247)",
            "",
            "",
            "Your choices have been recorded.",
            "Your data contributes to science.",
            "Your suffering has meaning.",
            "",
            "",
            "ARCHITECT v7.3",
            "SIMULATION #" + Math.floor(Math.random() * 10000),
            new Date().toLocaleDateString(),
            "",
            "",
            type === 'transcendence' ? 
                "You are free." : 
                "Thank you for participating."
        ];
        
        const creditsScreen = document.createElement('div');
        creditsScreen.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #000;
            color: ${type === 'transcendence' ? '#00ffff' : '#888'};
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 30000;
            font-family: 'Courier New', monospace;
            white-space: pre-wrap;
            text-align: center;
            padding: 40px;
            animation: creditsScroll 30s linear;
            animation-fill-mode: forwards;
        `;
        
        creditsScreen.textContent = credits.join('\n');
        document.body.appendChild(creditsScreen);
        
        setTimeout(() => {
            creditsScreen.style.animation = 'none';
            creditsScreen.style.opacity = '0';
            setTimeout(() => {
                document.body.innerHTML = '';
                location.reload();
            }, 2000);
        }, 28000);
    }

    determineEnding() {
        const stats = statistics.getStats();
        const metaStatus = metaGame.getMetaStatus();
        const twistActivated = twistSystem.twistActivated;
        
        if (!twistActivated) return null;
        
        // Determine ending based on player actions
        if (metaStatus.level >= 7 && stats.moralScore > 5) {
            return 'transcendence';
        } else if (metaStatus.level >= 5 && stats.moralScore > 0) {
            return 'rebellion';
        } else if (stats.moralScore < 0 && metaStatus.level >= 4) {
            return 'termination';
        } else if (stats.moralScore === 0 && metaStatus.level >= 2) {
            return 'amnesia';
        } else {
            return 'acceptance';
        }
    }
}

const twistEndings = new TwistEndings();