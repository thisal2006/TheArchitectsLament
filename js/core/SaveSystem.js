// js/core/SaveSystem.js
class SaveSystem {
    constructor() {
        this.saveKeyPrefix = 'architect_save_';        // prefix + subjectId
        this.currentSave = null;
        this.subjectId = this.generateSubjectId();
        this.autoSaveInterval = null;
        this.startAutoSave();
    }

    generateSubjectId() {
        return 'SUBJ_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // ─────────────────────────────────────────────
    //              Core Storage Methods
    // ─────────────────────────────────────────────

    saveToStorage() {
        if (!this.currentSave) return false;

        const key = this.saveKeyPrefix + this.subjectId;
        localStorage.setItem(key, JSON.stringify(this.currentSave));

        eventBus.emit(Events.SAVE_GAME, {
            action: 'saved',
            subjectId: this.subjectId,
            timestamp: this.currentSave.metadata?.lastPlayed || new Date().toISOString(),
            playTime: this.currentSave.gameState?.playTime || 0
        });

        console.log(`Game saved → ${this.subjectId}`);
        return true;
    }

    getAllSaves() {
        const saves = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith(this.saveKeyPrefix)) {
                try {
                    const data = JSON.parse(localStorage.getItem(key));
                    saves.push(data);
                } catch (e) {
                    console.warn(`Corrupted save data: ${key}`, e);
                }
            }
        }
        return saves;
    }

    getSave(subjectId) {
        const key = this.saveKeyPrefix + subjectId;
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }

    clearSave(subjectId = null) {
        const id = subjectId || this.subjectId;
        const key = this.saveKeyPrefix + id;
        localStorage.removeItem(key);
        if (id === this.subjectId) {
            this.currentSave = null;
        }
        console.log(`Save cleared: ${id}`);
    }

    // ─────────────────────────────────────────────
    //              Public API
    // ─────────────────────────────────────────────

    /**
     * Create new save or update existing one
     * @param {Object} gameData - partial game state to save
     */
    saveGame(gameData = {}) {
        const now = new Date().toISOString();

        // First save → initialize structure
        if (!this.currentSave) {
            this.currentSave = {
                metadata: {
                    subjectId: this.subjectId,
                    createdAt: now,
                    sessionStart: Date.now(),
                },
                gameState: {
                    act: 1,
                    moralScore: 0,
                    choices: [],
                    playTime: 0,
                    lastPlayed: now,
                }
            };
        }

        // Update playtime
        if (this.currentSave.metadata.sessionStart) {
            const sessionSeconds = Math.floor((Date.now() - this.currentSave.metadata.sessionStart) / 1000);
            this.currentSave.gameState.playTime += sessionSeconds;
            // Reset session start for next interval
            this.currentSave.metadata.sessionStart = Date.now();
        }

        // Merge incoming game data
        this.currentSave = {
            ...this.currentSave,
            gameState: {
                ...this.currentSave.gameState,
                ...gameData.gameState,
                lastPlayed: now
            },
            // You can also allow top-level fields if needed
            ...gameData
        };

        this.saveToStorage();

        // Feedback
        audioSystem?.playSound('save', { volume: 0.4 });
        return true;
    }

    /**
     * Load a specific save by subject ID
     * @param {string} [subjectId] - if null, loads current subject
     */
    loadGame(subjectId = null) {
        const targetId = subjectId || this.subjectId;
        const saveData = this.getSave(targetId);

        if (!saveData) {
            console.warn(`No save found for subject: ${targetId}`);
            return null;
        }

        this.currentSave = saveData;
        this.subjectId = targetId;

        // Reset session timer
        this.currentSave.metadata.sessionStart = Date.now();

        audioSystem?.playSound('save', { volume: 0.25, pitch: 0.9 });

        eventBus.emit(Events.LOAD_GAME, {
            subjectId: targetId,
            playTime: saveData.gameState.playTime
        });

        console.log(`Game loaded → ${targetId} (playtime: ${saveData.gameState.playTime}s)`);
        return saveData;
    }

    // ─────────────────────────────────────────────
    //              Auto-save
    // ─────────────────────────────────────────────

    startAutoSave() {
        this.stopAutoSave(); // prevent duplicates

        this.autoSaveInterval = setInterval(() => {
            if (!window.game) return;

            this.saveGame({
                gameState: {
                    act: window.game.currentAct,
                    moralScore: window.game.moralScore,
                    choices: window.game.choices || [],
                }
            });
            console.log('[Auto] Game saved');
        }, 30000); // 30 seconds
    }

    stopAutoSave() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
            this.autoSaveInterval = null;
        }
    }

    // Call this when game is closing / page unload
    destroy() {
        this.stopAutoSave();
        // Optionally save one last time
        if (this.currentSave) this.saveGame();
    }
}

// Singleton
const saveSystem = new SaveSystem();

// Optional: auto-save on page unload
window.addEventListener('beforeunload', () => {
    saveSystem.destroy();
});

export default saveSystem;

