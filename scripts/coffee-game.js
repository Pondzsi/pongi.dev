// Coffee Clicker Game
const coffeeGame = {
    coffee: 0,
    totalCoffee: 0,
    clickPower: 1,
    coffeePerSecond: 0,
    goldenCoffeesClicked: 0,
    goldenCoffeeActive: false,
    upgrades: [
        {
            id: 'cursor',
            name: 'Extra Strong Brew',
            icon: '💪☕',
            desc: '+1 coffee per click',
            baseCost: 10,
            costMultiplier: 1.15,
            owned: 0,
            effect: () => coffeeGame.clickPower += 1
        },
        {
            id: 'autobrewer',
            name: 'Auto Brewer',
            icon: '🤖',
            desc: '+1 coffee/sec',
            baseCost: 50,
            costMultiplier: 1.2,
            owned: 0,
            effect: () => coffeeGame.coffeePerSecond += 1
        },
        {
            id: 'espresso',
            name: 'Espresso Machine',
            icon: '☕✨',
            desc: '+5 coffee/sec',
            baseCost: 200,
            costMultiplier: 1.25,
            owned: 0,
            effect: () => coffeeGame.coffeePerSecond += 5
        },
        {
            id: 'plantation',
            name: 'Coffee Plantation',
            icon: '🌱',
            desc: '+25 coffee/sec',
            baseCost: 1000,
            costMultiplier: 1.3,
            owned: 0,
            effect: () => coffeeGame.coffeePerSecond += 25
        },
        {
            id: 'factory',
            name: 'Coffee Factory',
            icon: '🏭',
            desc: '+100 coffee/sec',
            baseCost: 5000,
            costMultiplier: 1.35,
            owned: 0,
            effect: () => coffeeGame.coffeePerSecond += 100
        }
    ],
    empireLevels: [
        { level: 0, icon: '🛒', name: 'Coffee Cart', threshold: 0 },
        { level: 1, icon: '☕', name: 'Coffee Stand', threshold: 50 },
        { level: 2, icon: '🏪', name: 'Coffee Shop', threshold: 200 },
        { level: 3, icon: '🏢', name: 'Coffee Chain', threshold: 1000 },
        { level: 4, icon: '🏭', name: 'Coffee Empire', threshold: 5000 }
    ],
    achievements: [
        { id: 'first', name: 'First Brew', desc: 'Brew your first coffee', icon: '☕', requirement: () => coffeeGame.totalCoffee >= 1, unlocked: false },
        { id: 'ten', name: 'Caffeine Kick', desc: 'Brew 10 coffees', icon: '⚡', requirement: () => coffeeGame.totalCoffee >= 10, unlocked: false },
        { id: 'hundred', name: 'Coffee Addict', desc: 'Brew 100 coffees', icon: '🔥', requirement: () => coffeeGame.totalCoffee >= 100, unlocked: false },
        { id: 'thousand', name: 'Barista Master', desc: 'Brew 1,000 coffees', icon: '👨‍🍳', requirement: () => coffeeGame.totalCoffee >= 1000, unlocked: false },
        { id: 'tenthousand', name: 'Coffee Empire', desc: 'Brew 10,000 coffees', icon: '🏆', requirement: () => coffeeGame.totalCoffee >= 10000, unlocked: false },
        { id: 'golden1', name: 'Golden Hunter', desc: 'Click a golden coffee', icon: '✨', requirement: () => coffeeGame.goldenCoffeesClicked >= 1, unlocked: false },
        { id: 'golden10', name: 'Golden Master', desc: 'Click 10 golden coffees', icon: '🌟', requirement: () => coffeeGame.goldenCoffeesClicked >= 10, unlocked: false },
        { id: 'upgrade5', name: 'Coffee Tycoon', desc: 'Purchase 5 upgrades', icon: '💰', requirement: () => coffeeGame.getTotalUpgrades() >= 5, unlocked: false },
        { id: 'upgrade20', name: 'Coffee Magnate', desc: 'Purchase 20 upgrades', icon: '💎', requirement: () => coffeeGame.getTotalUpgrades() >= 20, unlocked: false },
        { id: 'cps100', name: 'Automation Expert', desc: 'Reach 100 coffee/sec', icon: '🤖', requirement: () => coffeeGame.coffeePerSecond >= 100, unlocked: false }
    ],
    
    getTotalUpgrades() {
        return this.upgrades.reduce((sum, upgrade) => sum + upgrade.owned, 0);
    },
    
    getUpgradeCost(upgrade) {
        return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.owned));
    },
    
    buyUpgrade(upgradeId) {
        const upgrade = this.upgrades.find(u => u.id === upgradeId);
        if (!upgrade) return false;
        
        const cost = this.getUpgradeCost(upgrade);
        if (this.coffee >= cost) {
            this.coffee -= cost;
            upgrade.owned++;
            upgrade.effect();
            this.save();
            this.updateUI();
            return true;
        }
        return false;
    },
    
    addCoffee(amount) {
        this.coffee += amount;
        this.totalCoffee += amount;
        this.checkAchievements();
        this.updateUI();
    },
    
    spawnGoldenCoffee() {
        if (this.goldenCoffeeActive) return;
        
        this.goldenCoffeeActive = true;
        const goldenCoffee = document.createElement('div');
        goldenCoffee.className = 'golden-coffee';
        goldenCoffee.innerHTML = '☕';
        
        // Random position on screen (avoid edges)
        const x = Math.random() * (window.innerWidth - 100) + 50;
        const y = Math.random() * (window.innerHeight - 100) + 50;
        
        goldenCoffee.style.left = x + 'px';
        goldenCoffee.style.top = y + 'px';
        
        // Click handler
        goldenCoffee.addEventListener('click', () => {
            this.goldenCoffeesClicked++;
            // Golden coffee gives 10x your click power!
            const bonusAmount = this.clickPower * 10;
            this.addCoffee(bonusAmount);
            this.checkAchievements();
            this.save();
            
            // Show bonus notification
            const bonus = document.createElement('div');
            bonus.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y - 30}px;
                color: #FFD700;
                font-weight: 700;
                font-size: 2rem;
                z-index: 10001;
                pointer-events: none;
                animation: popUp 0.8s ease forwards;
                text-shadow: 0 0 10px #FFD700;
            `;
            bonus.textContent = `+${bonusAmount} ☕`;
            document.body.appendChild(bonus);
            setTimeout(() => bonus.remove(), 800);
            
            goldenCoffee.remove();
            this.goldenCoffeeActive = false;
        });
        
        document.body.appendChild(goldenCoffee);
        
        // Remove after 5 seconds if not clicked
        setTimeout(() => {
            if (goldenCoffee.parentElement) {
                goldenCoffee.remove();
                this.goldenCoffeeActive = false;
            }
        }, 5000);
    },
    
    checkAchievements() {
        let newAchievements = false;
        this.achievements.forEach(achievement => {
            if (!achievement.unlocked && achievement.requirement()) {
                achievement.unlocked = true;
                newAchievements = true;
                this.showAchievementNotification(achievement);
            }
        });
        if (newAchievements) {
            this.renderAchievements();
        }
    },
    
    showAchievementNotification(achievement) {
        // Create a temporary notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--copper);
            color: var(--bg-dark);
            padding: 1rem 1.5rem;
            border-radius: 12px;
            font-weight: 700;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            box-shadow: 0 4px 20px rgba(184, 115, 51, 0.5);
        `;
        notification.innerHTML = `
            <div style="font-size: 1.2rem; margin-bottom: 0.25rem;">${achievement.icon} Achievement Unlocked!</div>
            <div style="font-size: 0.9rem; opacity: 0.9;">${achievement.name}</div>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    },
    
    getCurrentEmpireLevel() {
        let currentLevel = this.empireLevels[0];
        for (let i = this.empireLevels.length - 1; i >= 0; i--) {
            if (this.totalCoffee >= this.empireLevels[i].threshold) {
                currentLevel = this.empireLevels[i];
                break;
            }
        }
        return currentLevel;
    },
    
    getNextEmpireLevel() {
        const current = this.getCurrentEmpireLevel();
        const nextIndex = current.level + 1;
        return nextIndex < this.empireLevels.length ? this.empireLevels[nextIndex] : null;
    },
    
    updateEmpireDisplay() {
        const current = this.getCurrentEmpireLevel();
        const next = this.getNextEmpireLevel();
        
        document.getElementById('empireIcon').textContent = current.icon;
        document.getElementById('empireTitle').textContent = current.name;
        
        if (next) {
            const progress = ((this.totalCoffee - current.threshold) / (next.threshold - current.threshold)) * 100;
            document.getElementById('empireProgress').style.width = Math.min(progress, 100) + '%';
            document.getElementById('empireNext').textContent = `Next: ${next.icon} ${next.name} (${next.threshold.toLocaleString()} coffees)`;
        } else {
            document.getElementById('empireProgress').style.width = '100%';
            document.getElementById('empireNext').textContent = 'Maximum Empire Level! 🎉';
        }
    },
    
    updateOwnedUpgrades() {
        const container = document.getElementById('coffeeOwnedItems');
        const ownedUpgrades = this.upgrades.filter(u => u.owned > 0);
        
        if (ownedUpgrades.length === 0) {
            container.innerHTML = '<div class="coffee-owned-empty">Start buying upgrades to build your empire!</div>';
        } else {
            container.innerHTML = ownedUpgrades.map(upgrade => `
                <div class="coffee-owned-item">
                    <div class="coffee-owned-item-icon">${upgrade.icon}</div>
                    <div class="coffee-owned-item-info">
                        <div class="coffee-owned-item-name">${upgrade.name}</div>
                        <div class="coffee-owned-item-count">x${upgrade.owned}</div>
                    </div>
                </div>
            `).join('');
        }
    },
    
    updateUI() {
        // Update coffee count and liquid level
        document.getElementById('coffeeCount').textContent = Math.floor(this.coffee).toLocaleString();
        const percentage = Math.min((this.coffee / 100) * 100, 100);
        document.getElementById('coffeeLiquid').style.height = percentage + '%';
        
        // Update status
        const status = document.getElementById('coffeeStatus');
        if (this.coffee === 0) {
            status.textContent = 'Ready to brew! ☕';
        } else if (this.coffee < 50) {
            status.textContent = 'Getting caffeinated... ☕';
        } else if (this.coffee < 200) {
            status.textContent = 'Fully charged! ⚡';
        } else if (this.coffee < 1000) {
            status.textContent = 'Coffee master! 🔥';
        } else {
            status.textContent = 'Coffee OVERLOAD! 💥';
        }
        
        // Update stats
        document.getElementById('perClick').textContent = this.clickPower;
        document.getElementById('perSecond').textContent = this.coffeePerSecond.toFixed(1);
        
        // Update golden coffees stat if element exists
        const goldenStat = document.getElementById('goldenCoffeesDisplay');
        if (goldenStat) {
            goldenStat.textContent = this.goldenCoffeesClicked;
        }
        
        // Update empire display
        this.updateEmpireDisplay();
        
        // Update owned upgrades
        this.updateOwnedUpgrades();
        
        // Render upgrades
        this.renderUpgrades();
    },
    
    renderUpgrades() {
        const container = document.getElementById('coffeeUpgrades');
        container.innerHTML = this.upgrades.map(upgrade => {
            const cost = this.getUpgradeCost(upgrade);
            const canAfford = this.coffee >= cost;
            return `
                <div class="coffee-upgrade-item ${!canAfford ? 'disabled' : ''}" data-upgrade="${upgrade.id}">
                    <div class="coffee-upgrade-header">
                        <span class="coffee-upgrade-name">${upgrade.icon} ${upgrade.name}</span>
                        <span class="coffee-upgrade-cost">☕ ${cost.toLocaleString()}</span>
                    </div>
                    <div class="coffee-upgrade-desc">${upgrade.desc}</div>
                    ${upgrade.owned > 0 ? `<div class="coffee-upgrade-owned">Owned: ${upgrade.owned}</div>` : ''}
                </div>
            `;
        }).join('');
    },
    
    renderAchievements() {
        const container = document.getElementById('coffeeAchievements');
        container.innerHTML = this.achievements.map(achievement => `
            <div class="coffee-achievement-item ${achievement.unlocked ? 'unlocked' : ''}">
                <div class="coffee-achievement-icon">${achievement.icon}</div>
                <div class="coffee-achievement-info">
                    <div class="coffee-achievement-name">${achievement.name}</div>
                    <div class="coffee-achievement-desc">${achievement.desc}</div>
                </div>
            </div>
        `).join('');
    },
    
    save() {
        const saveData = {
            coffee: this.coffee,
            totalCoffee: this.totalCoffee,
            clickPower: this.clickPower,
            coffeePerSecond: this.coffeePerSecond,
            goldenCoffeesClicked: this.goldenCoffeesClicked,
            upgrades: this.upgrades.map(u => ({ id: u.id, owned: u.owned })),
            achievements: this.achievements.map(a => ({ id: a.id, unlocked: a.unlocked }))
        };
        localStorage.setItem('coffeeClickerSave', JSON.stringify(saveData));
    },
    
    load() {
        const saveData = localStorage.getItem('coffeeClickerSave');
        if (saveData) {
            try {
                const data = JSON.parse(saveData);
                this.coffee = data.coffee || 0;
                this.totalCoffee = data.totalCoffee || 0;
                this.goldenCoffeesClicked = data.goldenCoffeesClicked || 0;
                
                // Reset to base values
                this.clickPower = 1;
                this.coffeePerSecond = 0;
                
                if (data.upgrades) {
                    data.upgrades.forEach(savedUpgrade => {
                        const upgrade = this.upgrades.find(u => u.id === savedUpgrade.id);
                        if (upgrade) {
                            upgrade.owned = savedUpgrade.owned;
                            // Re-apply upgrade effects based on owned count
                            for (let i = 0; i < upgrade.owned; i++) {
                                upgrade.effect();
                            }
                        }
                    });
                }
                
                if (data.achievements) {
                    data.achievements.forEach(savedAchievement => {
                        const achievement = this.achievements.find(a => a.id === savedAchievement.id);
                        if (achievement) {
                            achievement.unlocked = savedAchievement.unlocked;
                        }
                    });
                }
            } catch (e) {
                console.error('Failed to load save data:', e);
            }
        }
    },
    
    init() {
        this.load();
        this.updateUI();
        this.renderAchievements();
        
        // Auto-generate coffee per second
        setInterval(() => {
            if (this.coffeePerSecond > 0) {
                this.coffee += this.coffeePerSecond / 10;
                this.totalCoffee += this.coffeePerSecond / 10;
                this.checkAchievements();
                this.updateUI();
                this.save();
            }
        }, 100);
        
        // Auto-save every 5 seconds
        setInterval(() => this.save(), 5000);
    }
};

function createCoffeeParticles(e) {
    const cup = e.currentTarget;
    const rect = cup.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.className = 'coffee-particle';
        particle.style.left = clickX + 'px';
        particle.style.top = clickY + 'px';
        
        const angle = (Math.PI * 2 * i) / 5;
        const distance = 30 + Math.random() * 20;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        
        particle.style.setProperty('--tx', tx + 'px');
        particle.style.setProperty('--ty', ty + 'px');
        
        cup.appendChild(particle);
        
        setTimeout(() => particle.remove(), 800);
    }
}

function initCoffeeGame() {
    const coffeeCup = document.getElementById('coffeeCup');
    const coffeeMeter = document.getElementById('coffeeMeter');
    const coffeeToggle = document.getElementById('coffeeToggle');
    
    // Initialize game
    coffeeGame.init();
    
    // Click handler for coffee cup
    coffeeCup.addEventListener('click', (e) => {
        e.stopPropagation();
        
        coffeeGame.addCoffee(coffeeGame.clickPower);
        
        // Shake animation
        coffeeMeter.classList.add('shake');
        setTimeout(() => coffeeMeter.classList.remove('shake'), 300);
        
        // Create particles
        createCoffeeParticles(e);
        
        coffeeGame.save();
    });
    
    // Only spawn golden coffees on desktop (not mobile)
    if (window.innerWidth > 767) {
        // Spawn first golden coffee after 10-20 seconds
        setTimeout(() => {
            coffeeGame.spawnGoldenCoffee();
        }, Math.random() * 10000 + 10000);
        
        // Then spawn golden coffee every 20-30 seconds
        setInterval(() => {
            coffeeGame.spawnGoldenCoffee();
        }, Math.random() * 10000 + 20000);
    }
    
    // Toggle minimize/maximize
    coffeeToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        coffeeMeter.classList.toggle('minimized');
    });
    
    coffeeMeter.addEventListener('click', (e) => {
        if (coffeeMeter.classList.contains('minimized')) {
            coffeeMeter.classList.remove('minimized');
        }
    });
    
    // Tab switching
    document.querySelectorAll('.coffee-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            
            document.querySelectorAll('.coffee-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.coffee-tab-content').forEach(c => c.classList.remove('active'));
            
            tab.classList.add('active');
            document.getElementById(`${tabName}-content`).classList.add('active');
        });
    });
    
    // Upgrade click handler
    document.getElementById('coffeeUpgrades').addEventListener('click', (e) => {
        const upgradeItem = e.target.closest('.coffee-upgrade-item');
        if (upgradeItem && !upgradeItem.classList.contains('disabled')) {
            const upgradeId = upgradeItem.dataset.upgrade;
            if (coffeeGame.buyUpgrade(upgradeId)) {
                // Success animation
                upgradeItem.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    upgradeItem.style.transform = '';
                }, 100);
            }
        }
    });
    
    // Reset button handler
    document.getElementById('coffeeReset').addEventListener('click', () => {
        if (confirm('Are you sure you want to reset your coffee game? This will delete all your progress, upgrades, and achievements!')) {
            // Clear localStorage
            localStorage.removeItem('coffeeClickerSave');
            
            // Reset all game variables
            coffeeGame.coffee = 0;
            coffeeGame.totalCoffee = 0;
            coffeeGame.clickPower = 1;
            coffeeGame.coffeePerSecond = 0;
            coffeeGame.goldenCoffeesClicked = 0;
            
            // Reset upgrades
            coffeeGame.upgrades.forEach(upgrade => {
                upgrade.owned = 0;
            });
            
            // Reset achievements
            coffeeGame.achievements.forEach(achievement => {
                achievement.unlocked = false;
            });
            
            // Update UI
            coffeeGame.updateUI();
            coffeeGame.renderAchievements();
            
            // Show notification
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--copper);
                color: var(--bg-dark);
                padding: 1rem 1.5rem;
                border-radius: 12px;
                font-weight: 700;
                z-index: 10000;
                box-shadow: 0 4px 20px rgba(184, 115, 51, 0.5);
            `;
            notification.innerHTML = '<div style="font-size: 1.2rem;">🔄 Game Reset!</div><div style="font-size: 0.9rem; opacity: 0.9;">Starting fresh...</div>';
            document.body.appendChild(notification);
            
            setTimeout(() => notification.remove(), 2000);
        }
    });
}
