export class Monster {
    constructor(scene, x, y, data) {
        this.scene = scene;

        // Boss flag and area tracking
        this.isBoss = data.isBoss || false;
        this.areaId = data.areaId || null;

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

        // Visual - custom graphics for each monster type
        this.sizeMultiplier = data.sizeMultiplier || 1;
        this.baseMonster = data.baseMonster || this.name;
        this.monsterColor = data.color;
        this.createMonsterSprite(scene, x, y);

        // Name text above monster - bosses get special styling
        const displayName = this.isBoss ? `BOSS: ${this.name}` : this.name;
        const nameColor = this.isBoss ? '#ffdd44' : '#ffffff';
        const fontSize = this.isBoss ? '26px' : '20px';
        const yOffset = this.isBoss ? -90 * this.sizeMultiplier : -70;

        this.nameText = scene.add.text(x, y + yOffset, displayName, {
            fontSize: fontSize,
            fontFamily: 'Arial',
            color: nameColor,
            fontStyle: this.isBoss ? 'bold' : 'normal'
        }).setOrigin(0.5);

        // Health bar background - larger for bosses
        const barWidth = this.isBoss ? 120 : 80;
        const barYOffset = this.isBoss ? -60 * this.sizeMultiplier : -50;
        this.healthBarBg = scene.add.rectangle(x, y + barYOffset, barWidth, 10, 0x333333);

        // Health bar (red for monsters)
        this.healthBar = scene.add.rectangle(x, y + barYOffset, barWidth, 10, 0xaa4444);
        this.barWidth = barWidth;

        this.updateHealthBar();
    }

    createMonsterSprite(scene, x, y) {
        const g = scene.add.graphics();
        const s = this.sizeMultiplier;
        const color = this.monsterColor;

        // Determine which monster to draw based on base type
        const monsterType = this.baseMonster || this.name;

        switch (monsterType) {
            case 'Slime':
                this.drawSlime(g, s, color);
                break;
            case 'Goblin':
                this.drawGoblin(g, s, color);
                break;
            case 'Orc':
                this.drawOrc(g, s, color);
                break;
            case 'Troll':
                this.drawTroll(g, s, color);
                break;
            default:
                this.drawSlime(g, s, color);
        }

        g.setPosition(x, y);
        this.sprite = g;
        this.sprite.x = x;
        this.sprite.y = y;

        // Create invisible hit area for clicking
        const hitRadius = 50 * s;
        this.hitArea = scene.add.circle(x, y, hitRadius, 0x000000, 0);
        this.hitArea.setInteractive({ useHandCursor: true });
        this.hitArea.on('pointerdown', () => {
            scene.onMonsterClicked();
        });
    }

    drawSlime(g, s, color) {
        // Main body - blobby shape
        g.fillStyle(color);
        g.fillEllipse(0, 10 * s, 70 * s, 50 * s);

        // Highlight/shine
        const lighterColor = this.lightenColor(color, 40);
        g.fillStyle(lighterColor);
        g.fillEllipse(-15 * s, -5 * s, 20 * s, 15 * s);

        // Eyes
        g.fillStyle(0xffffff);
        g.fillCircle(-12 * s, 0, 10 * s);
        g.fillCircle(12 * s, 0, 10 * s);

        // Pupils
        g.fillStyle(0x111111);
        g.fillCircle(-10 * s, 2 * s, 5 * s);
        g.fillCircle(14 * s, 2 * s, 5 * s);

        // Cute mouth
        g.lineStyle(2 * s, 0x226622);
        g.beginPath();
        g.arc(0, 15 * s, 8 * s, 0.3, Math.PI - 0.3);
        g.strokePath();
    }

    drawGoblin(g, s, color) {
        // Body
        g.fillStyle(color);
        g.fillRoundedRect(-20 * s, -5 * s, 40 * s, 45 * s, 8 * s);

        // Head
        g.fillEllipse(0, -25 * s, 45 * s, 35 * s);

        // Pointy ears
        g.fillTriangle(
            -28 * s, -35 * s,
            -18 * s, -20 * s,
            -22 * s, -50 * s
        );
        g.fillTriangle(
            28 * s, -35 * s,
            18 * s, -20 * s,
            22 * s, -50 * s
        );

        // Eyes (angry)
        g.fillStyle(0xffff00);
        g.fillCircle(-10 * s, -28 * s, 7 * s);
        g.fillCircle(10 * s, -28 * s, 7 * s);

        // Pupils
        g.fillStyle(0x111111);
        g.fillCircle(-8 * s, -27 * s, 3 * s);
        g.fillCircle(12 * s, -27 * s, 3 * s);

        // Angry eyebrows
        g.lineStyle(3 * s, 0x333300);
        g.lineBetween(-18 * s, -38 * s, -5 * s, -35 * s);
        g.lineBetween(18 * s, -38 * s, 5 * s, -35 * s);

        // Mouth with teeth
        g.fillStyle(0x330000);
        g.fillRect(-10 * s, -12 * s, 20 * s, 8 * s);
        g.fillStyle(0xffffff);
        g.fillTriangle(-6 * s, -12 * s, -2 * s, -12 * s, -4 * s, -6 * s);
        g.fillTriangle(2 * s, -12 * s, 6 * s, -12 * s, 4 * s, -6 * s);

        // Arms
        const darkerColor = this.darkenColor(color, 30);
        g.fillStyle(darkerColor);
        g.fillRoundedRect(-32 * s, 0, 14 * s, 30 * s, 4 * s);
        g.fillRoundedRect(18 * s, 0, 14 * s, 30 * s, 4 * s);

        // Legs
        g.fillRoundedRect(-15 * s, 38 * s, 12 * s, 20 * s, 3 * s);
        g.fillRoundedRect(3 * s, 38 * s, 12 * s, 20 * s, 3 * s);
    }

    drawOrc(g, s, color) {
        // Bulky body
        g.fillStyle(color);
        g.fillRoundedRect(-30 * s, -10 * s, 60 * s, 55 * s, 10 * s);

        // Head
        g.fillEllipse(0, -35 * s, 50 * s, 40 * s);

        // Small ears
        g.fillEllipse(-28 * s, -35 * s, 12 * s, 18 * s);
        g.fillEllipse(28 * s, -35 * s, 12 * s, 18 * s);

        // Brow ridge
        const darkerColor = this.darkenColor(color, 40);
        g.fillStyle(darkerColor);
        g.fillRect(-20 * s, -45 * s, 40 * s, 10 * s);

        // Eyes (small, angry)
        g.fillStyle(0xff3300);
        g.fillCircle(-10 * s, -35 * s, 6 * s);
        g.fillCircle(10 * s, -35 * s, 6 * s);
        g.fillStyle(0x111111);
        g.fillCircle(-9 * s, -34 * s, 3 * s);
        g.fillCircle(11 * s, -34 * s, 3 * s);

        // Tusks
        g.fillStyle(0xffffee);
        g.fillTriangle(-15 * s, -18 * s, -10 * s, -18 * s, -12 * s, -5 * s);
        g.fillTriangle(15 * s, -18 * s, 10 * s, -18 * s, 12 * s, -5 * s);

        // Mouth
        g.fillStyle(0x220000);
        g.fillRect(-12 * s, -20 * s, 24 * s, 8 * s);

        // Muscular arms
        g.fillStyle(color);
        g.fillRoundedRect(-45 * s, -5 * s, 18 * s, 40 * s, 6 * s);
        g.fillRoundedRect(27 * s, -5 * s, 18 * s, 40 * s, 6 * s);

        // Fists
        g.fillStyle(darkerColor);
        g.fillCircle(-36 * s, 38 * s, 10 * s);
        g.fillCircle(36 * s, 38 * s, 10 * s);

        // Legs
        g.fillStyle(0x443322);
        g.fillRoundedRect(-22 * s, 42 * s, 18 * s, 25 * s, 5 * s);
        g.fillRoundedRect(4 * s, 42 * s, 18 * s, 25 * s, 5 * s);
    }

    drawTroll(g, s, color) {
        // Large hunched body
        g.fillStyle(color);
        g.fillEllipse(0, 10 * s, 80 * s, 60 * s);

        // Head (smaller relative to body)
        g.fillEllipse(0, -40 * s, 40 * s, 35 * s);

        // Messy hair/moss
        const darkerColor = this.darkenColor(color, 50);
        g.fillStyle(darkerColor);
        g.fillCircle(-12 * s, -58 * s, 8 * s);
        g.fillCircle(0, -62 * s, 10 * s);
        g.fillCircle(12 * s, -58 * s, 8 * s);
        g.fillCircle(-8 * s, -55 * s, 6 * s);
        g.fillCircle(8 * s, -55 * s, 6 * s);

        // Big nose
        g.fillStyle(color);
        g.fillEllipse(0, -35 * s, 18 * s, 15 * s);

        // Small eyes
        g.fillStyle(0xffcc00);
        g.fillCircle(-12 * s, -45 * s, 5 * s);
        g.fillCircle(12 * s, -45 * s, 5 * s);
        g.fillStyle(0x111111);
        g.fillCircle(-11 * s, -44 * s, 2 * s);
        g.fillCircle(13 * s, -44 * s, 2 * s);

        // Wide mouth
        g.fillStyle(0x331111);
        g.fillRect(-15 * s, -28 * s, 30 * s, 10 * s);

        // Crooked teeth
        g.fillStyle(0xddddaa);
        g.fillRect(-12 * s, -28 * s, 6 * s, 5 * s);
        g.fillRect(2 * s, -28 * s, 5 * s, 6 * s);
        g.fillRect(10 * s, -28 * s, 4 * s, 4 * s);

        // Long arms
        g.fillStyle(color);
        g.fillRoundedRect(-55 * s, -15 * s, 20 * s, 55 * s, 8 * s);
        g.fillRoundedRect(35 * s, -15 * s, 20 * s, 55 * s, 8 * s);

        // Big hands
        g.fillStyle(darkerColor);
        g.fillCircle(-45 * s, 45 * s, 14 * s);
        g.fillCircle(45 * s, 45 * s, 14 * s);

        // Short legs
        g.fillStyle(color);
        g.fillRoundedRect(-25 * s, 45 * s, 20 * s, 25 * s, 6 * s);
        g.fillRoundedRect(5 * s, 45 * s, 20 * s, 25 * s, 6 * s);

        // Feet
        g.fillStyle(darkerColor);
        g.fillEllipse(-15 * s, 72 * s, 22 * s, 10 * s);
        g.fillEllipse(15 * s, 72 * s, 22 * s, 10 * s);
    }

    lightenColor(color, amount) {
        const r = Math.min(255, ((color >> 16) & 0xff) + amount);
        const g = Math.min(255, ((color >> 8) & 0xff) + amount);
        const b = Math.min(255, (color & 0xff) + amount);
        return (r << 16) | (g << 8) | b;
    }

    darkenColor(color, amount) {
        const r = Math.max(0, ((color >> 16) & 0xff) - amount);
        const g = Math.max(0, ((color >> 8) & 0xff) - amount);
        const b = Math.max(0, (color & 0xff) - amount);
        return (r << 16) | (g << 8) | b;
    }

    takeDamage(amount) {
        const damage = Math.max(1, amount - this.def);
        this.hp = Math.max(0, this.hp - damage);
        this.updateHealthBar();
        return this.hp <= 0; // Return true if dead
    }

    updateHealthBar() {
        const ratio = this.hp / this.maxHp;
        this.healthBar.width = this.barWidth * ratio;
        // Adjust position to keep bar left-aligned
        this.healthBar.x = this.sprite.x - (this.barWidth - this.healthBar.width) / 2;
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
        this.hitArea.destroy();
        this.healthBar.destroy();
        this.healthBarBg.destroy();
        this.nameText.destroy();
    }
}
