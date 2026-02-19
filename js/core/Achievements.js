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

    listenForEvents() {
    // Listen to game events to check achievements
    eventBus.subscribe('choice_made', (data) => {
        this.checkAll();
        this.checkSpecialChoiceAchievements(data);
    });
    
    eventBus.subscribe('act_completed', (data) => {
        this.checkAll();
        this.checkActCompletionAchievements(data);
    });
    
    eventBus.subscribe('game_ended', () => {
        this.checkAll();
        this.checkGameCompletionAchievements();
    });
    
    eventBus.subscribe('twist_activated', () => {
        this.checkAll();
        this.checkTwistAchievements();
    });
    
    eventBus.subscribe('ending_reached', (data) => {
        this.recordEnding(data.endingId);
        this.checkAll();
        this.checkEndingAchievements(data);
    });

    // Special achievements
    eventBus.subscribe('konami_entered', () => {
        this.konamiEntered = true;
        this.check('konami', this.getCurrentStats());
    });

    // Check every 5 minutes for time-based achievements
    setInterval(() => {
        this.checkTimeBasedAchievements();
    }, 300000);
}

    checkSpecialChoiceAchievements(data) {
        // Check for unique choice patterns
        const choices = saveSystem.currentSave?.gameState?.moralChoices || [];
        
        // Check for first choice being sacrificial
        if (choices.length === 1 && data.choice.moralValue < -5) {
            this.check('first_sacrifice', this.getCurrentStats());
        }
        
        // Check for perfect score in act
        const currentActChoices = choices.filter(c => c.act === this.currentAct);
        if (currentActChoices.length >= 3) {
            const actScore = currentActChoices.reduce((sum, c) => sum + (c.moralValue || 0), 0);
            if (actScore === 0) {
                this.check('balanced_act', this.getCurrentStats());
            }
        }
    }

    checkActCompletionAchievements(data) {
        // Speed run check
        const actTime = statistics.startTimes[data.act] ? 
            (Date.now() - statistics.startTimes[data.act]) / 1000 : 0;
        
        if (actTime < 300) { // Under 5 minutes
            this.check('speed_act', this.getCurrentStats());
        }
    }

    checkGameCompletionAchievements() {
        // Check for no saves used
        if (saveSystem.saveCount === 1) {
            this.check('iron_will', this.getCurrentStats());
        }
        
        // Check for all acts completed without reload
        if (!saveSystem.hasLoaded) {
            this.check('pure_run', this.getCurrentStats());
        }
    }

    checkTwistAchievements() {
        // Check if twist was discovered early
        if (this.currentAct < 3) {
            this.check('early_awakening', this.getCurrentStats());
        }
        
        // Check if all hints were collected
        if (twistSystem.hintsGiven >= twistSystem.maxHints) {
            this.check('truth_seeker', this.getCurrentStats());
        }
    }

    checkEndingAchievements(data) {
        // Check for specific ending combinations
        if (data.endingId === 'transcendence' && this.metaLevel >= 7) {
            this.check('enlightened', this.getCurrentStats());
        }
        
        // Check for multiple endings
        const endings = this.getUnlockedEndings();
        if (endings.length >= 3) {
            this.check('ending_collector', this.getCurrentStats());
        }
    }

    checkTimeBasedAchievements() {
        const stats = this.getCurrentStats();
        
        // Check for long play sessions
        if (stats.totalPlayTime > 3600) { // 1 hour
            this.check('dedicated', stats);
        }
        
        if (stats.totalPlayTime > 10800) { // 3 hours
            this.check('devoted', stats);
        }
        
        // Check for multiple sessions
        if (this.sessionCount >= 5) {
            this.check('returning', stats);
        }
    }

    checkGitDates() {
    // Secret achievement for noticing future dates
    const today = new Date();
    const gitDate = new Date('2026-02-16'); // Our first future commit
    
    // Check if player has been paying attention
    return localStorage.getItem('architect_noticed_dates') === 'true';
}

    // Add method to notice the dates
    noticeFutureDates() {
        localStorage.setItem('architect_noticed_dates', 'true');
        this.check('meta_aware', this.getCurrentStats());
        
        // Show special message
        const message = document.createElement('div');
        message.innerHTML = `
            <div style="text-align: center;">
                <h3 style="color: #ff00ff;">🔮 YOU NOTICED 🔮</h3>
                <p>The commits are from the future...</p>
                <p style="color: #888; font-size: 0.8rem;">Or are they?</p>
            </div>
        `;
        // Show as modal
        this.showMetaMessage(message);
    }

    showMetaMessage(content) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            border: 2px solid #ff00ff;
            border-radius: 10px;
            padding: 30px;
            z-index: 20000;
            color: white;
            font-family: 'Courier New', monospace;
            box-shadow: 0 0 50px #ff00ff;
        `;
        
        modal.appendChild(content);
        document.body.appendChild(modal);
        
        setTimeout(() => {
            modal.style.transition = 'opacity 1s';
            modal.style.opacity = '0';
            setTimeout(() => modal.remove(), 1000);
        }, 5000);
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

    // Play achievement sound with variations based on points
    const pointValue = achievement.points;
    if (pointValue >= 500) {
        // Epic achievement sound
        if (proceduralAudio.audioContext) {
            proceduralAudio.generateEnding('positive');
        } else {
            audioSystem.playSound('complete', { volume: 0.7, pitch: 1.5 });
        }
    } else if (pointValue >= 200) {
        // Rare achievement sound
        audioSystem.playSound('complete', { volume: 0.6, pitch: 1.2 });
    } else {
        // Normal achievement sound
        audioSystem.playSound('complete', { volume: 0.5 });
    }

    // Add screen flash for epic achievements
    if (pointValue >= 500) {
        Effects.flash('gold', 500);
    }

    // Emit event
    eventBus.emit('achievement_unlocked', {
        achievement: achievement,
        totalUnlocked: this.unlocked.length
    });

    // Record in statistics
    statistics.recordAchievementUnlocked(achievement);

    console.log(`🏆 Achievement Unlocked: ${achievement.name} (+${achievement.points})`);
}

}

const achievements = new Achievements();