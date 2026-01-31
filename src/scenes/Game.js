import { Player } from '../entities/Player.js';
import { Monster } from '../entities/Monster.js';
import { GameUI } from '../ui/GameUI.js';
import { InventoryUI } from '../ui/InventoryUI.js';
import { MONSTERS } from '../data/monsters.js';
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

        // Keyboard listener for 'I' key
        this.input.keyboard.on('keydown-I', () => this.toggleInventory());

        // Combat state
        this.inCombat = true;
        this.monster = null;

        // Spawn first monster
        this.spawnMonster();

        // Initial UI update
        this.ui.update(this.player);
    }

    update(time, delta) {
        if (!this.inCombat) return;

        // Player auto-attack
        if (this.monster && this.player.canAttack(time)) {
            this.playerAttack();
            this.player.recordAttack(time);
        }

        // Monster auto-attack
        if (this.monster && this.monster.canAttack(time)) {
            this.monsterAttack();
            this.monster.recordAttack(time);
        }

        // Health regeneration
        if (this.player.canRegen(time)) {
            this.player.regenerate(time);
        }

        if (this.monster && this.monster.canRegen(time)) {
            this.monster.regenerate(time);
        }

        // Update UI
        this.ui.update(this.player);
    }

    toggleInventory() {
        this.inventoryUI.toggle();
    }

    spawnMonster() {
        // Pick random monster from array
        const data = MONSTERS[Math.floor(Math.random() * MONSTERS.length)];
        this.monster = new Monster(this, 900, 400, data);
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
        if (!this.monster || !this.inCombat) return;

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

        // Destroy monster
        this.monster.destroy();
        this.monster = null;

        // Spawn new monster after delay
        this.time.delayedCall(500, () => {
            if (this.inCombat) {
                this.spawnMonster();
            }
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
