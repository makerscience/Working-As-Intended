export class GameUI {
    constructor(scene) {
        this.scene = scene;

        // Top bar - dark rectangle across top
        this.topBar = scene.add.rectangle(640, 30, 1280, 60, 0x222233);

        // Stats text (left side)
        this.statsText = scene.add.text(20, 20, '', {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#ffffff'
        });

        // Gold text (right side, yellow)
        this.goldText = scene.add.text(1100, 20, '', {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#ffdd44'
        });

        // XP bar background
        this.xpBarBg = scene.add.rectangle(640, 680, 400, 20, 0x333333);

        // XP bar (blue)
        this.xpBar = scene.add.rectangle(440, 680, 0, 20, 0x4488ff);
        this.xpBar.setOrigin(0, 0.5);

        // XP text
        this.xpText = scene.add.text(640, 680, '', {
            fontSize: '14px',
            fontFamily: 'Arial',
            color: '#ffffff'
        }).setOrigin(0.5);
    }

    update(player) {
        // Update stats text
        const hpDisplay = Math.floor(player.hp);
        const regenDisplay = player.hpRegen % 1 === 0 ? player.hpRegen : player.hpRegen.toFixed(1);
        this.statsText.setText(
            `Lv.${player.level}  HP: ${hpDisplay}/${player.maxHp}  ATK: ${player.atk}  DEF: ${player.def}  REGEN: ${regenDisplay}/s`
        );

        // Update gold text
        this.goldText.setText(`Gold: ${player.gold}`);

        // Update XP bar
        const xpRatio = player.xp / player.xpToLevel;
        this.xpBar.width = 400 * xpRatio;

        // Update XP text
        this.xpText.setText(`XP: ${player.xp}/${player.xpToLevel}`);
    }

    showDamageNumber(x, y, amount, isPlayerDamage) {
        const color = isPlayerDamage ? '#ff4444' : '#ffffff';
        const text = this.scene.add.text(x, y, `-${amount}`, {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: color,
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Animate rising and fading
        this.scene.tweens.add({
            targets: text,
            y: y - 50,
            alpha: 0,
            duration: 800,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
    }

    showLevelUp(x, y) {
        const text = this.scene.add.text(x, y, 'LEVEL UP!', {
            fontSize: '32px',
            fontFamily: 'Arial',
            color: '#ffff00',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Animate rising and fading
        this.scene.tweens.add({
            targets: text,
            y: y - 80,
            alpha: 0,
            duration: 1500,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
    }

    showDefeated() {
        this.defeatedText = this.scene.add.text(640, 360, 'DEFEATED!', {
            fontSize: '64px',
            fontFamily: 'Arial',
            color: '#ff4444',
            fontStyle: 'bold'
        }).setOrigin(0.5);
    }

    hideDefeated() {
        if (this.defeatedText) {
            this.defeatedText.destroy();
            this.defeatedText = null;
        }
    }
}
