import { Player } from '../entities/Player.js';
import { Monster } from '../entities/Monster.js';
import { GameUI } from '../ui/GameUI.js';
import { InventoryUI } from '../ui/InventoryUI.js';
import { ShopUI } from '../ui/ShopUI.js';
import { AreaUI } from '../ui/AreaUI.js';
import { MONSTERS } from '../data/monsters.js';
import { AREAS, getAreaById, getNextArea } from '../data/areas.js';
import { getItemById } from '../data/items.js';

export class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    create() {
        // Dark background
        this.add.rectangle(640, 360, 1280, 720, 0x1a1a2e);

        // Create player at left side
        this.player = new Player(this, 300, 400);

        // Create UI
        this.ui = new GameUI(this);

        // Create inventory UI (hidden by default)
        this.inventoryUI = new InventoryUI(this, this.player);

        // Create shop UI (hidden by default)
        this.shopUI = new ShopUI(this, this.player);

        // Create area UI (hidden by default)
        this.areaUI = new AreaUI(this, this.player);

        // Boss fight state
        this.fightingBoss = false;

        // Inventory button
        this.inventoryBtn = this.add.text(1180, 20, '[I] Inventory', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#aaaaff',
            backgroundColor: '#333355',
            padding: { x: 8, y: 4 }
        }).setInteractive({ useHandCursor: true });

        this.inventoryBtn.on('pointerdown', () => this.toggleInventory());
        this.inventoryBtn.on('pointerover', () => this.inventoryBtn.setColor('#ffffff'));
        this.inventoryBtn.on('pointerout', () => this.inventoryBtn.setColor('#aaaaff'));

        // Shop button
        this.shopBtn = this.add.text(1180, 50, '[S] Shop', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#ffdd88',
            backgroundColor: '#554433',
            padding: { x: 8, y: 4 }
        }).setInteractive({ useHandCursor: true });

        this.shopBtn.on('pointerdown', () => this.toggleShop());
        this.shopBtn.on('pointerover', () => this.shopBtn.setColor('#ffffff'));
        this.shopBtn.on('pointerout', () => this.shopBtn.setColor('#ffdd88'));

        // Areas button
        this.areasBtn = this.add.text(1180, 80, '[A] Areas', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#88ddff',
            backgroundColor: '#335555',
            padding: { x: 8, y: 4 }
        }).setInteractive({ useHandCursor: true });

        this.areasBtn.on('pointerdown', () => this.toggleAreas());
        this.areasBtn.on('pointerover', () => this.areasBtn.setColor('#ffffff'));
        this.areasBtn.on('pointerout', () => this.areasBtn.setColor('#88ddff'));

        // Keyboard listener for 'I' key
        this.input.keyboard.on('keydown-I', () => this.toggleInventory());

        // Keyboard listener for 'S' key
        this.input.keyboard.on('keydown-S', () => this.toggleShop());

        // Keyboard listener for 'A' key
        this.input.keyboard.on('keydown-A', () => this.toggleAreas());

        // Game speed control
        this.gameSpeed = 1;
        this.gameTime = 0;
        this.createSpeedControls();

        // Combat state
        this.inCombat = true;
        this.monster = null;

        // Spawn first monster
        this.spawnMonster();

        // Initial UI update
        this.ui.update(this.player);
    }

    createSpeedControls() {
        const startX = 20;
        const y = 680;

        // Speed control label
        this.speedLabel = this.add.text(startX, y, 'Speed:', {
            fontSize: '14px',
            fontFamily: 'Arial',
            color: '#aaaaaa'
        });

        // Speed buttons
        this.speedButtons = [];
        const speeds = [
            { label: '||', value: 0 },
            { label: '1x', value: 1 },
            { label: '2x', value: 2 },
            { label: '4x', value: 4 }
        ];

        let btnX = startX + 60;
        for (const speed of speeds) {
            const btn = this.add.text(btnX, y, speed.label, {
                fontSize: '14px',
                fontFamily: 'Arial',
                color: speed.value === 1 ? '#ffffff' : '#888888',
                backgroundColor: speed.value === 1 ? '#4444aa' : '#333344',
                padding: { x: 8, y: 4 }
            }).setInteractive({ useHandCursor: true });

            btn.speedValue = speed.value;
            btn.on('pointerdown', () => this.setGameSpeed(speed.value));
            btn.on('pointerover', () => {
                if (this.gameSpeed !== speed.value) {
                    btn.setBackgroundColor('#444466');
                }
            });
            btn.on('pointerout', () => {
                if (this.gameSpeed !== speed.value) {
                    btn.setBackgroundColor('#333344');
                }
            });

            this.speedButtons.push(btn);
            btnX += btn.width + 8;
        }

        // Keyboard shortcuts for speed
        this.input.keyboard.on('keydown-SPACE', () => {
            // Toggle pause
            if (this.gameSpeed === 0) {
                this.setGameSpeed(1);
            } else {
                this.setGameSpeed(0);
            }
        });
    }

    setGameSpeed(speed) {
        this.gameSpeed = speed;
        this.time.timeScale = speed; // Affects delayedCall timers

        // Update button visuals
        for (const btn of this.speedButtons) {
            if (btn.speedValue === speed) {
                btn.setColor('#ffffff');
                btn.setBackgroundColor('#4444aa');
            } else {
                btn.setColor('#888888');
                btn.setBackgroundColor('#333344');
            }
        }

        // Show/hide paused indicator
        if (speed === 0) {
            if (!this.pausedText) {
                this.pausedText = this.add.text(640, 360, 'PAUSED', {
                    fontSize: '48px',
                    fontFamily: 'Arial',
                    color: '#ffffff',
                    fontStyle: 'bold',
                    stroke: '#000000',
                    strokeThickness: 4
                }).setOrigin(0.5).setDepth(50);
            }
            this.pausedText.setVisible(true);
        } else if (this.pausedText) {
            this.pausedText.setVisible(false);
        }
    }

    update(time, delta) {
        // Advance game time based on speed (paused = 0, normal = 1, fast = 2 or 4)
        this.gameTime += delta * this.gameSpeed;

        if (!this.inCombat) return;
        if (this.gameSpeed === 0) return; // Paused

        // Player auto-attack
        if (this.monster && this.player.canAttack(this.gameTime)) {
            this.playerAttack();
            this.player.recordAttack(this.gameTime);
        }

        // Monster auto-attack
        if (this.monster && this.monster.canAttack(this.gameTime)) {
            this.monsterAttack();
            this.monster.recordAttack(this.gameTime);
        }

        // Health regeneration
        if (this.player.canRegen(this.gameTime)) {
            this.player.regenerate(this.gameTime);
        }

        if (this.monster && this.monster.canRegen(this.gameTime)) {
            this.monster.regenerate(this.gameTime);
        }

        // Update UI
        this.ui.update(this.player);
    }

    toggleInventory() {
        this.inventoryUI.toggle();
    }

    toggleShop() {
        this.shopUI.toggle();
    }

    toggleAreas() {
        this.areaUI.toggle();
    }

    spawnMonster() {
        // Don't spawn if monster already exists
        if (this.monster) return;
        // Don't spawn regular monsters during boss fight
        if (this.fightingBoss) return;

        // Get current area's monster pool
        const currentArea = getAreaById(this.player.currentArea);
        const monsterPool = currentArea ? currentArea.monsterPool : ['Slime', 'Goblin'];

        // Filter monsters to only those in current area
        const availableMonsters = MONSTERS.filter(m => monsterPool.includes(m.name));

        // Pick random monster from available pool
        const data = availableMonsters[Math.floor(Math.random() * availableMonsters.length)];
        this.monster = new Monster(this, 900, 400, data);
    }

    spawnBoss(areaId) {
        // Destroy current monster if any
        if (this.monster) {
            this.monster.destroy();
            this.monster = null;
        }

        const area = getAreaById(areaId);
        if (!area || !area.miniBoss) return;

        // Find base monster stats
        const baseMonster = MONSTERS.find(m => m.name === area.miniBoss.baseMonster);
        if (!baseMonster) return;

        this.fightingBoss = true;

        // Create boss data with multiplied stats
        const bossData = {
            name: area.miniBoss.name,
            baseMonster: area.miniBoss.baseMonster,
            hp: Math.floor(baseMonster.hp * area.miniBoss.hpMultiplier),
            atk: Math.floor(baseMonster.atk * area.miniBoss.atkMultiplier),
            hpRegen: baseMonster.hpRegen,
            xpReward: Math.floor(baseMonster.xpReward * area.miniBoss.xpMultiplier),
            goldReward: Math.floor(baseMonster.goldReward * area.miniBoss.goldMultiplier),
            color: area.miniBoss.color,
            drops: area.miniBoss.drops,
            isBoss: true,
            sizeMultiplier: area.miniBoss.sizeMultiplier,
            areaId: areaId
        };

        this.monster = new Monster(this, 900, 400, bossData);
    }

    onAreaChanged(areaId) {
        // Destroy current monster and spawn new one for new area
        if (this.monster) {
            this.monster.destroy();
            this.monster = null;
        }
        this.fightingBoss = false;
        this.spawnMonster();
    }

    playerAttack() {
        if (!this.monster) return;

        const damage = Math.max(1, this.player.atk - this.monster.def);
        const isDead = this.monster.takeDamage(this.player.atk);

        // Show damage number (white for monster damage)
        this.ui.showDamageNumber(this.monster.sprite.x, this.monster.sprite.y - 30, damage, false);

        if (isDead) {
            this.onMonsterDeath();
        }
    }

    monsterAttack() {
        if (!this.monster) return;

        const damage = this.player.takeDamage(this.monster.atk);

        // Show damage number (red for player damage)
        this.ui.showDamageNumber(this.player.sprite.x, this.player.sprite.y - 30, damage, true);

        if (this.player.hp <= 0) {
            this.onPlayerDeath();
        }
    }

    onMonsterClicked() {
        if (!this.monster || !this.inCombat || this.gameSpeed === 0) return;

        // Deal 50% ATK bonus damage
        const bonusDamage = Math.max(1, Math.floor(this.player.atk * 0.5));
        const isDead = this.monster.takeDamage(bonusDamage);

        // Show damage number
        this.ui.showDamageNumber(this.monster.sprite.x + 20, this.monster.sprite.y - 50, bonusDamage, false);

        if (isDead) {
            this.onMonsterDeath();
        }
    }

    rollDrops(monster) {
        const droppedItems = [];

        for (const drop of monster.drops) {
            if (Math.random() < drop.chance) {
                droppedItems.push(drop.itemId);
            }
        }

        return droppedItems;
    }

    showItemDrop(item, offsetIndex) {
        const x = this.monster ? this.monster.sprite.x : 900;
        const y = 300 - (offsetIndex * 30);

        const text = this.add.text(x, y, `+${item.name}`, {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#ffff44',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Animate rising and fading
        this.tweens.add({
            targets: text,
            y: y - 60,
            alpha: 0,
            duration: 1500,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
    }

    showInventoryFull() {
        const text = this.add.text(640, 300, 'Inventory Full!', {
            fontSize: '28px',
            fontFamily: 'Arial',
            color: '#ff4444',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Animate fading
        this.tweens.add({
            targets: text,
            alpha: 0,
            duration: 1500,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
    }

    onMonsterDeath() {
        // Grant rewards
        this.player.gainXP(this.monster.xpReward);
        this.player.gainGold(this.monster.goldReward);

        // Roll for drops
        const droppedItems = this.rollDrops(this.monster);
        let dropOffset = 0;
        let inventoryWasFull = false;

        for (const itemId of droppedItems) {
            const item = getItemById(itemId);
            if (item) {
                if (this.player.inventory.addItem(itemId)) {
                    this.showItemDrop(item, dropOffset);
                    dropOffset++;
                } else {
                    inventoryWasFull = true;
                }
            }
        }

        if (inventoryWasFull) {
            this.showInventoryFull();
        }

        // Check if this was a boss kill
        const wasBoss = this.monster.isBoss;
        const bossAreaId = this.monster.areaId;

        // Destroy monster
        this.monster.destroy();
        this.monster = null;

        // Handle boss defeat
        if (wasBoss && bossAreaId) {
            this.fightingBoss = false;
            this.player.markBossDefeated(bossAreaId);

            // Unlock next area
            const nextArea = getNextArea(bossAreaId);
            if (nextArea) {
                this.player.unlockArea(nextArea.id);
                this.showAreaUnlocked(nextArea.name);
            } else {
                // Final boss defeated
                this.showNotification('All areas conquered!', '#ffdd44');
            }
        }

        // Spawn new monster after delay
        this.time.delayedCall(500, () => {
            if (this.inCombat) {
                this.spawnMonster();
            }
        });
    }

    showAreaUnlocked(areaName) {
        const text = this.add.text(640, 250, `${areaName} Unlocked!`, {
            fontSize: '36px',
            fontFamily: 'Arial',
            color: '#88ddff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5).setDepth(50);

        this.tweens.add({
            targets: text,
            y: 180,
            alpha: 0,
            duration: 2500,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
    }

    showNotification(message, color) {
        const text = this.add.text(640, 250, message, {
            fontSize: '32px',
            fontFamily: 'Arial',
            color: color,
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5).setDepth(50);

        this.tweens.add({
            targets: text,
            y: 180,
            alpha: 0,
            duration: 2500,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
    }

    onPlayerDeath() {
        this.inCombat = false;
        this.ui.showDefeated();

        // Respawn after 3 seconds
        this.time.delayedCall(3000, () => {
            this.ui.hideDefeated();
            this.player.respawn();
            this.inCombat = true;

            // Spawn new monster if none exists
            if (!this.monster) {
                this.spawnMonster();
            }
        });
    }

    onPlayerLevelUp() {
        this.ui.showLevelUp(this.player.sprite.x, this.player.sprite.y - 100);
    }
}
