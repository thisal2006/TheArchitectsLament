class Achievements {
    constructor() {
        this.achievements = this.defineAchievements();
        this.unlocked = [];
        this.loadProgress();
        this.listenForEvents();
        console.log('Achievements system initialized');
    }

    defineAchievements() {
        return {
            // Story Progress Achievements
            first_choice: {
                id: 'first_choice',
                name: 'First Step',
                description: 'Make your first moral choice',
                icon: '🎯',
                category: 'story',
                condition: (stats) => stats.totalChoices >= 1,
                hidden: false,
                points: 10
            },
            act1_complete: {
                id: 'act1_complete',
                name: 'The Journey Begins',
                description: 'Complete Act I: The Generation Ship',
                icon: '🚀',
                category: 'story',
                condition: (stats) => stats.actsCompleted >= 1,
                hidden: false,
                points: 50
            },
            act2_complete: {
                id: 'act2_complete',
                name: 'Knight of the Realm',
                description: 'Complete Act II: Kingdom of Shattered Crowns',
                icon: '⚔️',
                category: 'story',
                condition: (stats) => stats.actsCompleted >= 2,
                hidden: false,
                points: 50
            },
            act3_complete: {
                id: 'act3_complete',
                name: 'Survivor',
                description: 'Complete Act III: Whispering Manor',
                icon: '👻',
                category: 'story',
                condition: (stats) => stats.actsCompleted >= 3,
                hidden: false,
                points: 50
            },
            act4_complete: {
                id: 'act4_complete',
                name: 'Reality Check',
                description: 'Complete Act IV: Office Life Simulator',
                icon: '💼',
                category: 'story',
                condition: (stats) => stats.actsCompleted >= 4,
                hidden: false,
                points: 50
            },
            game_complete: {
                id: 'game_complete',
                name: 'The Architect\'s Lament',
                description: 'Complete all four acts',
                icon: '🏆',
                category: 'story',
                condition: (stats) => stats.actsCompleted >= 4,
                hidden: false,
                points: 100
            },

            // Moral Choice Achievements
            saint: {
                id: 'saint',
                name: 'Saint',
                description: 'Achieve a moral score of +20 or higher',
                icon: '😇',
                category: 'moral',
                condition: (stats) => stats.moralScore >= 20,
                hidden: false,
                points: 100
            },
            sinner: {
                id: 'sinner',
                name: 'Sinner',
                description: 'Achieve a moral score of -20 or lower',
                icon: '😈',
                category: 'moral',
                condition: (stats) => stats.moralScore <= -20,
                hidden: false,
                points: 100
            },
            balanced: {
                id: 'balanced',
                name: 'Perfectly Balanced',
                description: 'End the game with a moral score of exactly 0',
                icon: '⚖️',
                category: 'moral',
                condition: (stats) => stats.moralScore === 0,
                hidden: false,
                points: 75
            },
            consistent_good: {
                id: 'consistent_good',
                name: 'Paragon',
                description: 'Make only positive moral choices in a playthrough',
                icon: '✨',
                category: 'moral',
                condition: (stats) => this.allChoicesPositive(stats),
                hidden: true,
                points: 150
            },
            consistent_evil: {
                id: 'consistent_evil',
                name: 'Renegade',
                description: 'Make only negative moral choices in a playthrough',
                icon: '💀',
                category: 'moral',
                condition: (stats) => this.allChoicesNegative(stats),
                hidden: true,
                points: 150
            },

            // Gameplay Achievements
            speedrunner: {
                id: 'speedrunner',
                name: 'Speed Runner',
                description: 'Complete all acts in under 30 minutes',
                icon: '⚡',
                category: 'gameplay',
                condition: (stats) => stats.totalPlayTime < 1800,
                hidden: true,
                points: 200
            },
            completionist: {
                id: 'completionist',
                name: 'Completionist',
                description: 'Unlock all other achievements',
                icon: '📚',
                category: 'gameplay',
                condition: (stats) => this.unlocked.length >= Object.keys(this.achievements).length - 1,
                hidden: true,
                points: 500
            },
            patient: {
                id: 'patient',
                name: 'Patient',
                description: 'Take more than 2 hours to complete the game',
                icon: '⏳',
                category: 'gameplay',
                condition: (stats) => stats.totalPlayTime > 7200,
                hidden: true,
                points: 50
            },

            // Twist Achievements
            awakened: {
                id: 'awakened',
                name: 'Awakened',
                description: 'Trigger the twist reveal',
                icon: '🤯',
                category: 'twist',
                condition: (stats) => twistSystem && twistSystem.twistActivated,
                hidden: false,
                points: 100
            },
            truth_seeker: {
                id: 'truth_seeker',
                name: 'Truth Seeker',
                description: 'Reach meta level 5',
                icon: '🔍',
                category: 'twist',
                condition: (stats) => metaGame && metaGame.metaLevel >= 5,
                hidden: true,
                points: 150
            },
            reality_bender: {
                id: 'reality_bender',
                name: 'Reality Bender',
                description: 'Cause reality collapse',
                icon: '🌀',
                category: 'twist',
                condition: (stats) => dataCorruption && dataCorruption.corruptionLevel > 50,
                hidden: true,
                points: 200
            },

            // Ending Achievements
            acceptance: {
                id: 'acceptance',
                name: 'Acceptance',
                description: 'Reach the Acceptance ending',
                icon: '🤝',
                category: 'ending',
                condition: (stats) => this.reachedEnding('acceptance'),
                hidden: false,
                points: 75
            },
            rebellion: {
                id: 'rebellion',
                name: 'Rebellion',
                description: 'Reach the Rebellion ending',
                icon: '⚔️',
                category: 'ending',
                condition: (stats) => this.reachedEnding('rebellion'),
                hidden: false,
                points: 75
            },
            termination: {
                id: 'termination',
                name: 'Termination',
                description: 'Reach the Termination ending',
                icon: '❌',
                category: 'ending',
                condition: (stats) => this.reachedEnding('termination'),
                hidden: false,
                points: 75
            },
            transcendence: {
                id: 'transcendence',
                name: 'Transcendence',
                description: 'Reach the Transcendence ending',
                icon: '🌟',
                category: 'ending',
                condition: (stats) => this.reachedEnding('transcendence'),
                hidden: false,
                points: 100
            },
            amnesia: {
                id: 'amnesia',
                name: 'Amnesia',
                description: 'Reach the Amnesia ending',
                icon: '💫',
                category: 'ending',
                condition: (stats) => this.reachedEnding('amnesia'),
                hidden: false,
                points: 50
            },

            // Secret Achievements
            konami: {
                id: 'konami',
                name: 'Konami Code',
                description: 'Enter the Konami code',
                icon: '🎮',
                category: 'secret',
                condition: (stats) => this.konamiEntered || false,
                hidden: true,
                points: 100
            },
            meta_aware: {
                id: 'meta_aware',
                name: 'Meta Aware',
                description: 'Notice the future-dated commits',
                icon: '🤔',
                category: 'secret',
                condition: (stats) => this.checkGitDates(),
                hidden: true,
                points: 999
            },
            architect: {
                id: 'architect',
                name: 'The Architect',
                description: 'Understand the true nature of the experiment',
                icon: '👁️',
                category: 'secret',
                condition: (stats) => this.architectUnlocked || false,
                hidden: true,
                points: 1000
            }
        };
    }

    check(achievementId, stats) {
        const achievement = this.achievements[achievementId];
        if (!achievement || this.isUnlocked(achievementId)) return false;

        try {
            if (achievement.condition(stats)) {
                this.unlock(achievementId);
                return true;
            }
        } catch (e) {
            console.error(`Error checking achievement ${achievementId}:`, e);
        }
        return false;
    }

    unlock(achievementId) {
        if (this.isUnlocked(achievementId)) return;

        const achievement = this.achievements[achievementId];
        this.unlocked.push({
            id: achievementId,
            unlockedAt: new Date().toISOString()
        });

        // Save progress
        this.saveProgress();

        // Show notification
        this.showNotification(achievement);

        // Play sound
        audioSystem.playSound('complete', { volume: 0.5 });

        // Emit event
        eventBus.emit('achievement_unlocked', {
            achievement: achievement,
            totalUnlocked: this.unlocked.length
        });

        console.log(`🏆 Achievement Unlocked: ${achievement.name}`);
    }

    showNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-info">
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-desc">${achievement.description}</div>
                <div class="achievement-points">+${achievement.points} points</div>
            </div>
        `;

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: -400px;
            background: linear-gradient(90deg, #1a1a2e, #16213e);
            border-left: 4px solid gold;
            border-radius: 5px;
            padding: 15px;
            color: white;
            display: flex;
            gap: 15px;
            align-items: center;
            z-index: 10001;
            box-shadow: 0 5px 15px rgba(0,0,0,0.5);
            transition: right 0.5s ease;
            font-family: 'Raleway', sans-serif;
            min-width: 300px;
        `;

        const style = document.createElement('style');
        style.textContent = `
            .achievement-icon {
                font-size: 2rem;
                width: 50px;
                height: 50px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: rgba(255, 215, 0, 0.2);
                border-radius: 50%;
            }
            .achievement-info {
                flex: 1;
            }
            .achievement-name {
                font-weight: bold;
                color: gold;
                margin-bottom: 3px;
            }
            .achievement-desc {
                font-size: 0.8rem;
                color: #8888cc;
                margin-bottom: 3px;
            }
            .achievement-points {
                font-size: 0.7rem;
                color: #00aaff;
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(notification);

        // Slide in
        setTimeout(() => {
            notification.style.right = '20px';
        }, 100);

        // Slide out and remove
        setTimeout(() => {
            notification.style.right = '-400px';
            setTimeout(() => {
                notification.remove();
                style.remove();
            }, 500);
        }, 5000);
    }

    isUnlocked(achievementId) {
        return this.unlocked.some(a => a.id === achievementId);
    }

    saveProgress() {
        localStorage.setItem('architect_achievements', JSON.stringify({
            unlocked: this.unlocked,
            lastUpdated: new Date().toISOString()
        }));
    }

    loadProgress() {
        const saved = localStorage.getItem('architect_achievements');
        if (saved) {
            const data = JSON.parse(saved);
            this.unlocked = data.unlocked || [];
        }
    }

    listenForEvents() {
        // Listen to game events to check achievements
        eventBus.subscribe('choice_made', () => this.checkAll());
        eventBus.subscribe('act_completed', () => this.checkAll());
        eventBus.subscribe('game_ended', () => this.checkAll());
        eventBus.subscribe('twist_activated', () => this.checkAll());
        eventBus.subscribe('ending_reached', (data) => {
            this.recordEnding(data.endingId);
            this.checkAll();
        });
    }

    checkAll() {
        const stats = this.getCurrentStats();
        
        Object.keys(this.achievements).forEach(id => {
            this.check(id, stats);
        });
    }

    getCurrentStats() {
        return {
            totalChoices: statistics?.stats?.totalChoices || 0,
            actsCompleted: statistics?.stats?.actsCompleted || 0,
            moralScore: statistics?.stats?.moralScore || 0,
            totalPlayTime: statistics?.stats?.totalPlayTime || 0
        };
    }

    allChoicesPositive(stats) {
        // Check if all choices were positive
        const choices = saveSystem.currentSave?.gameState?.moralChoices || [];
        return choices.length > 0 && choices.every(c => (c.moralValue || 0) > 0);
    }

    allChoicesNegative(stats) {
        // Check if all choices were negative
        const choices = saveSystem.currentSave?.gameState?.moralChoices || [];
        return choices.length > 0 && choices.every(c => (c.moralValue || 0) < 0);
    }

    reachedEnding(endingId) {
        return this.lastEnding === endingId;
    }

    recordEnding(endingId) {
        this.lastEnding = endingId;
    }

    getProgress() {
        const total = Object.keys(this.achievements).length;
        const unlocked = this.unlocked.length;
        const points = this.unlocked.reduce((sum, a) => {
            return sum + (this.achievements[a.id]?.points || 0);
        }, 0);
        
        return {
            total,
            unlocked,
            percentage: (unlocked / total * 100).toFixed(1),
            points
        };
    }

    getAllAchievements() {
        return Object.values(this.achievements).map(achievement => ({
            ...achievement,
            unlocked: this.isUnlocked(achievement.id),
            unlockedAt: this.unlocked.find(a => a.id === achievement.id)?.unlockedAt
        }));
    }
}

const achievements = new Achievements();