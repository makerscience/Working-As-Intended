import { Inventory } from '../systems/Inventory.js';

export class Player {
    constructor(scene, x, y) {
        this.scene = scene;

        // Base combat stats (without equipment)
        this.level = 1;
        this.baseMaxHp = 50;
        this.baseAtk = 5;
        this.baseDef = 2;
        this.baseHpRegen = 1;

        // Computed stats (base + level bonuses + equipment)
        this.maxHp = 50;
        this.hp = 50;
        this.atk = 5;
        this.def = 2;
        this.hpRegen = 1;

        // Progression
        this.xp = 0;
        this.xpToLevel = 50;
        this.gold = 0;

        // Inventory system
        this.inventory = new Inventory(20);
        this.inventory.setOnChange(() => this.onEquipmentChange());

        // Area progression
        this.currentArea = 'forest';
        this.unlockedAreas = ['forest'];
        this.defeatedBosses = [];

        // Combat timing
        this.attackSpeed = 1500; // ms
        this.lastAttackTime = 0;

        // Regen timing
        this.regenInterval = 1000; // ms
        this.lastRegenTime = 0;

        // Visual - little character made of shapes
        this.createCharacterSprite(scene, x, y);

        // Health bar background
        this.healthBarBg = scene.add.rectangle(x, y - 70, 80, 10, 0x333333);

        // Health bar (green)
        this.healthBar = scene.add.rectangle(x, y - 70, 80, 10, 0x44aa44);

        this.updateHealthBar();
    }

    createCharacterSprite(scene, x, y) {
        // Create a graphics object for the character
        const g = scene.add.graphics();

        // Colors
        const skinColor = 0xffcc99;
        const hairColor = 0x553311;
        const shirtColor = 0x4466aa;
        const pantsColor = 0x445566;
        const shoeColor = 0x332222;

        // Draw relative to center point
        // Head (circle)
        g.fillStyle(skinColor);
        g.fillCircle(0, -35, 18);

        // Hair (arc on top of head)
        g.fillStyle(hairColor);
        g.fillRect(-14, -52, 28, 10);
        g.fillCircle(-10, -45, 6);
        g.fillCircle(10, -45, 6);

        // Eyes
        g.fillStyle(0x333333);
        g.fillCircle(-6, -38, 3);
        g.fillCircle(6, -38, 3);

        // Smile
        g.lineStyle(2, 0x333333);
        g.beginPath();
        g.arc(0, -32, 6, 0.2, Math.PI - 0.2);
        g.strokePath();

        // Body (torso)
        g.fillStyle(shirtColor);
        g.fillRoundedRect(-18, -15, 36, 40, 4);

        // Arms
        g.fillStyle(skinColor);
        g.fillRoundedRect(-28, -12, 12, 30, 4);  // Left arm
        g.fillRoundedRect(16, -12, 12, 30, 4);   // Right arm

        // Hands
        g.fillCircle(-22, 20, 6);  // Left hand
        g.fillCircle(22, 20, 6);   // Right hand

        // Legs
        g.fillStyle(pantsColor);
        g.fillRoundedRect(-15, 25, 13, 35, 3);  // Left leg
        g.fillRoundedRect(2, 25, 13, 35, 3);    // Right leg

        // Shoes
        g.fillStyle(shoeColor);
        g.fillRoundedRect(-17, 55, 15, 8, 2);   // Left shoe
        g.fillRoundedRect(2, 55, 15, 8, 2);     // Right shoe

        // Position the graphics
        g.setPosition(x, y);

        // Store reference (we use a fake sprite object with x, y for compatibility)
        this.sprite = g;
        this.sprite.x = x;
        this.sprite.y = y;
    }

    recalculateStats() {
        const previousMaxHp = this.maxHp;

        // Level bonuses: +10 maxHp, +2 atk, +1 def, +0.5 regen per level above 1
        const levelBonus = this.level - 1;

        // Equipment bonuses
        const equipment = this.inventory.getEquipmentBonuses();

        // Calculate final stats
        this.maxHp = this.baseMaxHp + (levelBonus * 10) + equipment.maxHp;
        this.atk = this.baseAtk + (levelBonus * 2) + equipment.atk;
        this.def = this.baseDef + (levelBonus * 1) + equipment.def;
        this.hpRegen = this.baseHpRegen + (levelBonus * 0.5) + equipment.hpRegen;

        // Adjust current HP proportionally if max HP changed
        if (previousMaxHp > 0 && this.maxHp !== previousMaxHp) {
            const hpRatio = this.hp / previousMaxHp;
            this.hp = Math.min(this.maxHp, Math.floor(hpRatio * this.maxHp));
        }

        // Ensure HP doesn't exceed max
        this.hp = Math.min(this.hp, this.maxHp);

        this.updateHealthBar();
    }

    onEquipmentChange() {
        this.recalculateStats();
    }

    takeDamage(amount) {
        const damage = Math.max(1, amount - this.def);
        this.hp = Math.max(0, this.hp - damage);
        this.updateHealthBar();
        return damage;
    }

    gainXP(amount) {
        this.xp += amount;
        // Check for level up
        while (this.xp >= this.xpToLevel) {
            this.levelUp();
        }
    }

    gainGold(amount) {
        this.gold += amount;
    }

    levelUp() {
        this.xp -= this.xpToLevel;
        this.level++;

        // Increase XP requirement
        this.xpToLevel = Math.floor(this.xpToLevel * 1.5);

        // Recalculate stats with new level
        this.recalculateStats();

        // Heal to full
        this.hp = this.maxHp;
        this.updateHealthBar();

        // Notify scene
        if (this.scene.onPlayerLevelUp) {
            this.scene.onPlayerLevelUp();
        }
    }

    respawn() {
        this.hp = this.maxHp;
        this.updateHealthBar();
    }

    updateHealthBar() {
        const ratio = this.hp / this.maxHp;
        this.healthBar.width = 80 * ratio;
        // Adjust position to keep bar left-aligned
        this.healthBar.x = this.sprite.x - (80 - this.healthBar.width) / 2;
    }

    canAttack(time) {
        return time - this.lastAttackTime >= this.attackSpeed;
    }

    recordAttack(time) {
        this.lastAttackTime = time;
    }

    canRegen(time) {
        return time - this.lastRegenTime >= this.regenInterval;
    }

    regenerate(time) {
        if (this.hp < this.maxHp) {
            this.hp = Math.min(this.maxHp, this.hp + this.hpRegen);
            this.updateHealthBar();
        }
        this.lastRegenTime = time;
    }

    // Area progression methods
    setArea(areaId) {
        if (this.isAreaUnlocked(areaId)) {
            this.currentArea = areaId;
            return true;
        }
        return false;
    }

    unlockArea(areaId) {
        if (!this.unlockedAreas.includes(areaId)) {
            this.unlockedAreas.push(areaId);
        }
    }

    markBossDefeated(areaId) {
        if (!this.defeatedBosses.includes(areaId)) {
            this.defeatedBosses.push(areaId);
        }
    }

    isBossDefeated(areaId) {
        return this.defeatedBosses.includes(areaId);
    }

    isAreaUnlocked(areaId) {
        return this.unlockedAreas.includes(areaId);
    }
}
