class EventBus {
    constructor() {
        this.listeners = {};
        this.eventHistory = [];
    }

    subscribe(event, callback) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(callback);
    }

    emit(event, data = null) {
        this.eventHistory.push({ event, data, timestamp: Date.now() });
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => callback(data));
        }
    }

    getHistory() {
        return this.eventHistory;
    }
}

const eventBus = new EventBus();
const Events = {
    GAME_START: 'game_start',
    CHOICE_MADE: 'choice_made',
    ACT_CHANGE: 'act_change',
    SAVE_GAME: 'save_game'
};