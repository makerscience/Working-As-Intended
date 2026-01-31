export class Monster {
    constructor(scene, x, y, data) {
        this.scene = scene;

        // Stats from data
        this.name = data.name;
        this.maxHp = data.hp;
        this.hp = data.hp;
        this.atk = data.atk;
        this.def = 0; // Monsters have no defense
        this.hpRegen = data.hpRegen || 0;

        // Rewards
        this.xpReward = data.xpReward;
        this.goldReward = data.goldReward;

        // Drops
        this.drops = data.drops || [];

        // Combat timing
        this.attackSpeed = 2000; // ms
        this.lastAttackTime = 0;

        // Regen timing
        this.regenInterval = 1000; // ms
        this.lastRegenTime = 0;

        // Visual - colored circle radius 50, interactive
        this.sprite = scene.add.circle(x, y, 50, data.color);
        this.sprite.setInteractive({ useHandCursor: true });
        this.sprite.on('pointerdown', () => {
            scene.onMonsterClicked();
        });

        // Name text above monster
        this.nameText = scene.add.text(x, y - 80, this.name, {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Health bar background
        this.healthBarBg = scene.add.rectangle(x, y - 60, 80, 10, 0x333333);

        // Health bar (red for monsters)
        this.healthBar = scene.add.rectangle(x, y - 60, 80, 10, 0xaa4444);

        this.updateHealthBar();
    }

    takeDamage(amount) {
        const damage = Math.max(1, amount - this.def);
        this.hp = Math.max(0, this.hp - damage);
        this.updateHealthBar();
        return this.hp <= 0; // Return true if dead
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
        if (this.hpRegen > 0 && this.hp < this.maxHp) {
            this.hp = Math.min(this.maxHp, this.hp + this.hpRegen);
            this.updateHealthBar();
        }
        this.lastRegenTime = time;
    }

    destroy() {
        this.sprite.destroy();
        this.healthBar.destroy();
        this.healthBarBg.destroy();
        this.nameText.destroy();
    }
}
