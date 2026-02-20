class AchievementsUI {
    constructor() {
        this.panel = null;
        this.isVisible = false;
        this.createPanel();
    }

    createPanel() {
        // Create main panel
        this.panel = document.createElement('div');
        this.panel.id = 'achievements-panel';
        this.panel.className = 'achievements-panel';
        this.panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 800px;
            max-width: 90vw;
            max-height: 80vh;
            background: rgba(10, 10, 26, 0.95);
            border: 2px solid gold;
            border-radius: 10px;
            padding: 30px;
            z-index: 10002;
            display: none;
            color: white;
            font-family: 'Raleway', sans-serif;
            backdrop-filter: blur(5px);
            overflow-y: auto;
        `;

        // Header
        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            border-bottom: 1px solid gold;
            padding-bottom: 15px;
        `;

        const title = document.createElement('h2');
        title.textContent = '🏆 ACHIEVEMENTS';
        title.style.cssText = `
            color: gold;
            margin: 0;
            font-size: 2rem;
        `;

        const stats = document.createElement('div');
        stats.id = 'achievement-stats';
        stats.style.cssText = `
            color: #8888cc;
            font-size: 1rem;
        `;

        header.appendChild(title);
        header.appendChild(stats);
        this.panel.appendChild(header);

        // Filter bar
        const filterBar = document.createElement('div');
        filterBar.style.cssText = `
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
            flex-wrap: wrap;
        `;

        const filters = ['all', 'story', 'moral', 'gameplay', 'twist', 'ending', 'secret'];
        filters.forEach(filter => {
            const btn = document.createElement('button');
            btn.textContent = filter.toUpperCase();
            btn.className = 'achievement-filter-btn';
            btn.dataset.filter = filter;
            btn.style.cssText = `
                padding: 5px 15px;
                background: ${filter === 'all' ? 'rgba(255, 215, 0, 0.3)' : 'rgba(100, 100, 100, 0.3)'};
                border: 1px solid ${filter === 'all' ? 'gold' : '#666'};
                color: ${filter === 'all' ? 'gold' : '#888'};
                border-radius: 20px;
                cursor: pointer;
                transition: all 0.3s;
                font-size: 0.8rem;
            `;
            btn.onclick = () => this.filterAchievements(filter);
            filterBar.appendChild(btn);
        });

        this.panel.appendChild(filterBar);

        // Achievements grid
        this.grid = document.createElement('div');
        this.grid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
        `;
        this.panel.appendChild(this.grid);

        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'CLOSE';
        closeBtn.className = 'btn-primary';
        closeBtn.style.cssText = `
            width: 100%;
            margin-top: 20px;
        `;
        closeBtn.onclick = () => this.hide();
        this.panel.appendChild(closeBtn);

        document.body.appendChild(this.panel);

        

        

    }

    show() {
        this.updateDisplay();
        this.panel.style.display = 'block';
        this.isVisible = true;

        // Add backdrop
        this.backdrop = document.createElement('div');
        this.backdrop.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 10001;
        `;
        this.backdrop.onclick = () => this.hide();
        document.body.appendChild(this.backdrop);
    }

    hide() {
        this.panel.style.display = 'none';
        this.isVisible = false;
        if (this.backdrop) {
            this.backdrop.remove();
        }
    }

    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }

    updateDisplay() {
        const progress = achievements.getProgress();
        document.getElementById('achievement-stats').innerHTML = `
            ${progress.unlocked}/${progress.total} (${progress.percentage}%)<br>
            <span style="color: gold;">${progress.points} points</span>
        `;

        this.renderAchievements('all');
    }

    renderAchievements(filter = 'all') {
        const allAchievements = achievements.getAllAchievements();
        
        this.grid.innerHTML = '';
        
        allAchievements
            .filter(a => filter === 'all' || a.category === filter)
            .forEach(achievement => {
                this.grid.appendChild(this.createAchievementCard(achievement));
            });
    }

    createAchievementCard(achievement) {
        const card = document.createElement('div');
        card.className = `achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`;
        
        let cardStyle = `
            background: ${achievement.unlocked ? 'rgba(255, 215, 0, 0.1)' : 'rgba(50, 50, 70, 0.3)'};
            border: 1px solid ${achievement.unlocked ? 'gold' : '#444'};
            border-radius: 8px;
            padding: 15px;
            display: flex;
            gap: 15px;
            transition: all 0.3s;
            cursor: help;
        `;

        if (achievement.hidden && !achievement.unlocked) {
            // Hidden achievement - show ??? for locked hidden achievements
            card.innerHTML = `
                <div style="font-size: 2rem; width: 50px; text-align: center;">❓</div>
                <div style="flex: 1;">
                    <div style="font-weight: bold; color: #888;">Hidden Achievement</div>
                    <div style="font-size: 0.8rem; color: #666;">Keep playing to discover...</div>
                </div>
            `;
        } else {
            card.innerHTML = `
                <div style="font-size: 2rem; width: 50px; text-align: center;">${achievement.icon}</div>
                <div style="flex: 1;">
                    <div style="font-weight: bold; color: ${achievement.unlocked ? 'gold' : '#888'};">${achievement.name}</div>
                    <div style="font-size: 0.8rem; color: #8888cc; margin: 5px 0;">${achievement.description}</div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: #00aaff; font-size: 0.7rem;">+${achievement.points} pts</span>
                        ${achievement.unlocked ? 
                            '<span style="color: gold; font-size: 0.7rem;">✓ UNLOCKED</span>' : 
                            '<span style="color: #666; font-size: 0.7rem;">🔒 LOCKED</span>'}
                    </div>
                </div>
            `;
        }

        card.style.cssText = cardStyle;

        // Add hover effect
        card.onmouseenter = () => {
            card.style.transform = 'translateY(-2px)';
            card.style.boxShadow = achievement.unlocked ? 
                '0 5px 15px rgba(255, 215, 0, 0.3)' : 
                '0 5px 15px rgba(0, 0, 0, 0.3)';
        };

        card.onmouseleave = () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = 'none';
        };

        return card;
    }

    filterAchievements(filter) {
        // Update filter buttons
        document.querySelectorAll('.achievement-filter-btn').forEach(btn => {
            if (btn.dataset.filter === filter) {
                btn.style.background = 'rgba(255, 215, 0, 0.3)';
                btn.style.borderColor = 'gold';
                btn.style.color = 'gold';
            } else {
                btn.style.background = 'rgba(100, 100, 100, 0.3)';
                btn.style.borderColor = '#666';
                btn.style.color = '#888';
            }
        });

        this.renderAchievements(filter);
    }
}

const achievementsUI = new AchievementsUI();