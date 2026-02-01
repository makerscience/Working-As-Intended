import { AREAS } from '../data/areas.js';

export class AreaUI {
    constructor(scene, player) {
        this.scene = scene;
        this.player = player;
        this.visible = false;
        this.elements = [];
        this.areaButtons = [];
        this.bossButtons = [];
        this.monsterTexts = [];

        this.createUI();
        this.hide();
    }

    createUI() {
        const centerX = 640;
        const centerY = 360;

        // Semi-transparent overlay background
        this.overlay = this.scene.add.rectangle(centerX, centerY, 450, 380, 0x000000, 0.85);
        this.elements.push(this.overlay);

        // Title
        this.title = this.scene.add.text(centerX, centerY - 160, 'AREAS', {
            fontSize: '28px',
            fontFamily: 'Arial',
            color: '#88ddff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.elements.push(this.title);

        // Close button (X)
        this.closeBtn = this.scene.add.text(centerX + 195, centerY - 160, 'X', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#ff4444',
            fontStyle: 'bold'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        this.closeBtn.on('pointerdown', () => this.hide());
        this.closeBtn.on('pointerover', () => this.closeBtn.setColor('#ff8888'));
        this.closeBtn.on('pointerout', () => this.closeBtn.setColor('#ff4444'));
        this.elements.push(this.closeBtn);

        // Create area rows
        this.createAreaRows(centerX, centerY - 100);
    }

    createAreaRows(centerX, startY) {
        const rowHeight = 100;

        for (let i = 0; i < AREAS.length; i++) {
            const area = AREAS[i];
            const y = startY + i * rowHeight;

            // Area number and name
            const areaLabel = this.scene.add.text(centerX - 180, y - 20, `[${i + 1}] ${area.name}`, {
                fontSize: '20px',
                fontFamily: 'Arial',
                color: '#ffffff',
                fontStyle: 'bold'
            }).setOrigin(0, 0.5);
            this.elements.push(areaLabel);

            // Monster list (hidden for locked areas)
            const monstersText = this.scene.add.text(centerX - 180, y + 5, '', {
                fontSize: '14px',
                fontFamily: 'Arial',
                color: '#aaaaaa'
            }).setOrigin(0, 0.5);
            this.elements.push(monstersText);
            this.monsterTexts.push(monstersText);

            // Status/Go button
            const statusBtn = this.scene.add.text(centerX + 120, y - 15, '', {
                fontSize: '14px',
                fontFamily: 'Arial',
                color: '#44ff44',
                backgroundColor: '#335533',
                padding: { x: 10, y: 5 }
            }).setOrigin(0.5);
            statusBtn.areaIndex = i;
            statusBtn.on('pointerdown', () => this.onAreaClick(i));
            statusBtn.on('pointerover', () => {
                if (statusBtn.isClickable) {
                    statusBtn.setBackgroundColor('#447744');
                }
            });
            statusBtn.on('pointerout', () => {
                if (statusBtn.isClickable) {
                    statusBtn.setBackgroundColor('#335533');
                }
            });
            this.elements.push(statusBtn);
            this.areaButtons.push(statusBtn);

            // Fight Boss button
            const bossBtn = this.scene.add.text(centerX - 50, y + 30, '', {
                fontSize: '14px',
                fontFamily: 'Arial',
                color: '#ffdd44',
                backgroundColor: '#554422',
                padding: { x: 8, y: 4 }
            }).setOrigin(0, 0.5);
            bossBtn.areaIndex = i;
            bossBtn.on('pointerdown', () => this.onBossClick(i));
            bossBtn.on('pointerover', () => {
                if (bossBtn.isClickable) {
                    bossBtn.setBackgroundColor('#665533');
                }
            });
            bossBtn.on('pointerout', () => {
                if (bossBtn.isClickable) {
                    bossBtn.setBackgroundColor('#554422');
                }
            });
            this.elements.push(bossBtn);
            this.bossButtons.push(bossBtn);

            // Boss defeated indicator
            const bossDefeated = this.scene.add.text(centerX - 50, y + 30, '', {
                fontSize: '14px',
                fontFamily: 'Arial',
                color: '#44aa44'
            }).setOrigin(0, 0.5);
            bossDefeated.areaIndex = i;
            this.elements.push(bossDefeated);
            bossBtn.defeatedText = bossDefeated;
        }
    }

    onAreaClick(index) {
        const area = AREAS[index];
        if (!this.player.isAreaUnlocked(area.id)) return;
        if (this.player.currentArea === area.id) return;

        this.player.setArea(area.id);
        this.scene.onAreaChanged(area.id);
        this.refresh();
    }

    onBossClick(index) {
        const area = AREAS[index];
        // Can only fight boss in current area
        if (this.player.currentArea !== area.id) return;
        // Can't fight if already defeated
        if (this.player.isBossDefeated(area.id)) return;

        this.hide();
        this.scene.spawnBoss(area.id);
    }

    refresh() {
        for (let i = 0; i < AREAS.length; i++) {
            const area = AREAS[i];
            const isUnlocked = this.player.isAreaUnlocked(area.id);
            const isCurrent = this.player.currentArea === area.id;
            const isBossDefeated = this.player.isBossDefeated(area.id);

            // Update monsters text
            const monstersText = this.monsterTexts[i];
            if (monstersText) {
                if (isUnlocked) {
                    // Show which monsters are new in this area
                    const prevArea = i > 0 ? AREAS[i - 1] : null;
                    const newMonsters = prevArea
                        ? area.monsterPool.filter(m => !prevArea.monsterPool.includes(m))
                        : area.monsterPool;

                    if (newMonsters.length < area.monsterPool.length) {
                        monstersText.setText(`+ ${newMonsters.join(', ')}`);
                    } else {
                        monstersText.setText(area.monsterPool.join(', '));
                    }
                } else {
                    monstersText.setText('???');
                }
            }

            // Update status button
            const statusBtn = this.areaButtons[i];
            if (isCurrent) {
                statusBtn.setText('[CURRENT]');
                statusBtn.setColor('#88ffff');
                statusBtn.setBackgroundColor('#225555');
                statusBtn.disableInteractive();
                statusBtn.isClickable = false;
            } else if (isUnlocked) {
                statusBtn.setText('[GO]');
                statusBtn.setColor('#44ff44');
                statusBtn.setBackgroundColor('#335533');
                statusBtn.setInteractive({ useHandCursor: true });
                statusBtn.isClickable = true;
            } else {
                statusBtn.setText('[LOCKED]');
                statusBtn.setColor('#666666');
                statusBtn.setBackgroundColor('#333333');
                statusBtn.disableInteractive();
                statusBtn.isClickable = false;
            }

            // Update boss button
            const bossBtn = this.bossButtons[i];
            const defeatedText = bossBtn.defeatedText;

            if (isBossDefeated) {
                bossBtn.setVisible(false);
                defeatedText.setText('✓ Boss Defeated');
                defeatedText.setVisible(true);
            } else if (isCurrent && isUnlocked) {
                bossBtn.setText(`[Fight ${area.miniBoss.name}]`);
                bossBtn.setVisible(true);
                bossBtn.setInteractive({ useHandCursor: true });
                bossBtn.isClickable = true;
                defeatedText.setVisible(false);
            } else if (isUnlocked) {
                bossBtn.setText(`[Fight ${area.miniBoss.name}]`);
                bossBtn.setVisible(true);
                bossBtn.setColor('#666666');
                bossBtn.setBackgroundColor('#333333');
                bossBtn.disableInteractive();
                bossBtn.isClickable = false;
                defeatedText.setVisible(false);
            } else {
                bossBtn.setVisible(false);
                defeatedText.setVisible(false);
            }
        }
    }

    show() {
        this.visible = true;
        for (const el of this.elements) {
            el.setVisible(true);
            el.setDepth(100);
        }
        this.refresh();
    }

    hide() {
        this.visible = false;
        for (const el of this.elements) {
            el.setVisible(false);
        }
    }

    toggle() {
        if (this.visible) {
            this.hide();
        } else {
            this.show();
        }
    }

    isVisible() {
        return this.visible;
    }
}
