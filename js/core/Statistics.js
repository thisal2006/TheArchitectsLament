class Statistics {
    constructor() {
        this.stats = {
            totalPlayTime: 0,
            totalChoices: 0,
            moralScore: 0,
            actsCompleted: 0,
            fastestAct: null,
            slowestAct: null,
            mostCommonChoice: null,
            choiceDistribution: {}
        };
        
        this.startTimes = {};
        this.loadStats();
    }

    startAct(actNumber) {
        this.startTimes[actNumber] = Date.now();
    }

    endAct(actNumber) {
        if (!this.startTimes[actNumber]) return;
        
        const duration = Date.now() - this.startTimes[actNumber];
        this.stats.actsCompleted++;
        
        if (!this.stats.fastestAct || duration < this.stats.fastestAct.duration) {
            this.stats.fastestAct = { act: actNumber, duration: duration };
        }
        
        if (!this.stats.slowestAct || duration > this.stats.slowestAct.duration) {
            this.stats.slowestAct = { act: actNumber, duration: duration };
        }
        
        delete this.startTimes[actNumber];
        this.saveStats();
    }

    recordChoice(choice) {
        this.stats.totalChoices++;
        
        // Track choice distribution
        const choiceId = choice.id || choice.text.substring(0, 20);
        this.stats.choiceDistribution[choiceId] = (this.stats.choiceDistribution[choiceId] || 0) + 1;
        
        // Update most common choice
        if (!this.stats.mostCommonChoice || 
            this.stats.choiceDistribution[choiceId] > this.stats.choiceDistribution[this.stats.mostCommonChoice]) {
            this.stats.mostCommonChoice = choiceId;
        }
        
        this.saveStats();
    }

    updateMoralScore(change) {
        this.stats.moralScore += change;
        this.saveStats();
    }

    updatePlayTime() {
        // Called periodically to update total play time
        this.stats.totalPlayTime += 1; // in seconds
    }

    saveStats() {
        localStorage.setItem('architect_stats', JSON.stringify(this.stats));
    }

    loadStats() {
        const saved = localStorage.getItem('architect_stats');
        if (saved) {
            this.stats = JSON.parse(saved);
        }
    }

    getStats() {
        return {
            ...this.stats,
            averageActTime: this.stats.actsCompleted > 0 ? 
                (this.stats.totalPlayTime * 1000 / this.stats.actsCompleted) : 0,
            moralAlignment: this.stats.moralScore > 0 ? 'Altruistic' : 
                           this.stats.moralScore < 0 ? 'Selfish' : 'Neutral'
        };
    }

    generateReport() {
        const stats = this.getStats();
        const playTimeMinutes = Math.floor(stats.totalPlayTime / 60);
        const playTimeSeconds = stats.totalPlayTime % 60;
        
        return `
            EXPERIMENT STATISTICS REPORT
            ============================
            Subject ID: ${saveSystem.subjectId}
            
            Game Progress:
            -------------
            Total Play Time: ${playTimeMinutes}m ${playTimeSeconds}s
            Acts Completed: ${stats.actsCompleted}
            Total Choices Made: ${stats.totalChoices}
            
            Performance Metrics:
            -------------------
            Fastest Act: Act ${stats.fastestAct?.act || 'N/A'} (${Math.round(stats.fastestAct?.duration / 1000 || 0)}s)
            Slowest Act: Act ${stats.slowestAct?.act || 'N/A'} (${Math.round(stats.slowestAct?.duration / 1000 || 0)}s)
            Average Act Time: ${Math.round(stats.averageActTime / 1000)}s
            
            Moral Analysis:
            ---------------
            Moral Score: ${stats.moralScore}
            Alignment: ${stats.moralAlignment}
            Most Common Choice Type: ${stats.mostCommonChoice || 'N/A'}
            
            Choice Distribution:
            --------------------
            ${Object.entries(stats.choiceDistribution)
                .map(([choice, count]) => `${choice}: ${count} times`)
                .join('\n            ')}
        `;
    }

    reset() {
        this.stats = {
            totalPlayTime: 0,
            totalChoices: 0,
            moralScore: 0,
            actsCompleted: 0,
            fastestAct: null,
            slowestAct: null,
            mostCommonChoice: null,
            choiceDistribution: {}
        };
        this.startTimes = {};
        this.saveStats();
    }

    addMetaStatistics() {
    this.stats.metaStats = {
        timesTwisted: 0,
        timesCollapsed: 0,
        timesTerminated: 0,
        insightsUnlocked: 0,
        highestMetaLevel: 0,
        corruptionLevel: 0
    };
}

recordTwistEvent(eventType) {
    if (!this.stats.metaStats) {
        this.stats.metaStats = {};
    }
    
    switch(eventType) {
        case 'twist_activated':
            this.stats.metaStats.timesTwisted++;
            break;
        case 'reality_collapse':
            this.stats.metaStats.timesCollapsed++;
            break;
        case 'termination':
            this.stats.metaStats.timesTerminated++;
            break;
    }
    
    this.stats.metaStats.highestMetaLevel = Math.max(
        this.stats.metaStats.highestMetaLevel || 0,
        metaGame.metaLevel || 0
    );
    
    this.saveStats();
}
}

const statistics = new Statistics();