class Leaderboard {
    constructor() {
        this.panel = null;
        this.createPanel();
    }

    createPanel() {
        this.panel = document.createElement('div');
        this.panel.id = 'leaderboard-panel';
        this.panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 500px;
            background: rgba(10, 10, 26, 0.95);
            border: 2px solid gold;
            border-radius: 10px;
            padding: 30px;
            z-index: 10003;
            display: none;
            color: white;
            font-family: 'Raleway', sans-serif;
        `;

        this.panel.innerHTML = `
            <h2 style="color: gold; text-align: center; margin-bottom: 20px;">
                🏆 ACHIEVEMENT LEADERBOARD
            </h2>
            <div id="leaderboard-content"></div>
            <button id="close-leaderboard" class="btn-primary" style="width: 100%; margin-top: 20px;">
                CLOSE
            </button>
        `;

        document.getElementById('close-leaderboard').onclick = () => this.hide();
        document.body.appendChild(this.panel);
    }

    show() {
        this.update();
        this.panel.style.display = 'block';
        
        this.backdrop = document.createElement('div');
        this.backdrop.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 10002;
        `;
        this.backdrop.onclick = () => this.hide();
        document.body.appendChild(this.backdrop);
    }

    hide() {
        this.panel.style.display = 'none';
        if (this.backdrop) {
            this.backdrop.remove();
        }
    }

    update() {
        const stats = statistics.getLeaderboardStats();
        const achievementProgress = achievements.getProgress();
        
        const content = document.getElementById('leaderboard-content');
        content.innerHTML = `
            <div style="background: rgba(0,0,0,0.5); padding: 20px; border-radius: 5px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px; 
                            border-bottom: 1px solid #333; padding-bottom: 5px;">
                    <span>Total Play Time:</span>
                    <span style="color: #00aaff;">${stats.totalPlayTime}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span>Choices Made:</span>
                    <span style="color: #00aaff;">${stats.totalChoices}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span>Moral Score:</span>
                    <span style="color: ${stats.moralScore > 0 ? '#00ff00' : '#ff6666'};">
                        ${stats.moralScore}
                    </span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span>Achievement Points:</span>
                    <span style="color: gold;">${stats.achievementPoints}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span>Achievements Unlocked:</span>
                    <span style="color: gold;">${stats.achievementsUnlocked}/${achievementProgress.total}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span>Completion:</span>
                    <span style="color: gold;">${achievementProgress.percentage}%</span>
                </div>
                <div style="margin-top: 20px; padding-top: 10px; border-top: 1px solid #333;">
                    <div style="color: #888; text-align: center; font-size: 0.9rem;">
                        Subject ID: ${saveSystem.subjectId}
                    </div>
                </div>
            </div>
        `;
    }
}

const leaderboard = new Leaderboard();