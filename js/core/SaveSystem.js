class SaveSystem {
    constructor() {
        this.saveKey = 'architect_save';
        this.subjectId = this.generateSubjectId();
        this.autoSaveInterval = null;
        this.startAutoSave();
    }

    generateSubjectId() {
        return 'SUBJ_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    save(gameData) {
        const save = {
            subjectId: this.subjectId,
            timestamp: new Date().toISOString(),
            data: gameData
        };

        localStorage.setItem(this.saveKey, JSON.stringify(save));
        eventBus.emit(Events.SAVE_GAME, save);

        return save;
    }

    load() {
        const save = localStorage.getItem(this.saveKey);
        return save ? JSON.parse(save) : null;
    }

    clear() {
        localStorage.removeItem(this.saveKey);
    }

    // ======================
    // 🔄 AUTO SAVE FEATURE
    // ======================

    startAutoSave() {
        this.autoSaveInterval = setInterval(() => {
            if (window.game) {
                this.autoSave();
            }
        }, 30000); // Every 30 seconds
    }

    autoSave() {
        if (!window.game) return;

        const gameData = {
            act: window.game.currentAct,
            moralScore: window.game.moralScore,
            choices: window.game.choices,
            timestamp: new Date().toISOString()
        };

        this.save(gameData);
        console.log('Game auto-saved');
    }

    stopAutoSave() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
            this.autoSaveInterval = null;
        }
    }
}

const saveSystem = new SaveSystem();
