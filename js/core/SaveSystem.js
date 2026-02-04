class SaveSystem {
    constructor() {
        this.saveKey = 'architect_save';
        this.subjectId = this.generateSubjectId();
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
}

const saveSystem = new SaveSystem();