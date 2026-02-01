import { SHOP_ITEMS } from '../data/shop.js';
import { getItemById, getItemColor } from '../data/items.js';

export class ShopUI {
    constructor(scene, player) {
        this.scene = scene;
        this.player = player;
        this.visible = false;
        this.elements = [];
        this.buyButtons = [];

        this.createUI();
        this.hide();
    }

    createUI() {
        const centerX = 640;
        const centerY = 360;

        // Semi-transparent overlay background
        this.overlay = this.scene.add.rectangle(centerX, centerY, 500, 420, 0x000000, 0.85);
        this.elements.push(this.overlay);

        // Title
        this.title = this.scene.add.text(centerX, centerY - 180, 'SHOP', {
            fontSize: '28px',
            fontFamily: 'Arial',
            color: '#ffdd44',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.elements.push(this.title);

        // Close button (X)
        this.closeBtn = this.scene.add.text(centerX + 220, centerY - 180, 'X', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#ff4444',
            fontStyle: 'bold'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        this.closeBtn.on('pointerdown', () => this.hide());
        this.closeBtn.on('pointerover', () => this.closeBtn.setColor('#ff8888'));
        this.closeBtn.on('pointerout', () => this.closeBtn.setColor('#ff4444'));
        this.elements.push(this.closeBtn);

        // Create item rows
        this.createItemRows(centerX, centerY - 110);

        // Gold display at bottom
        this.goldText = this.scene.add.text(centerX, centerY + 170, 'Your Gold: 0', {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#ffdd44',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.elements.push(this.goldText);
    }

    createItemRows(centerX, startY) {
        const rowHeight = 60;

        for (let i = 0; i < SHOP_ITEMS.length; i++) {
            const shopItem = SHOP_ITEMS[i];
            const item = getItemById(shopItem.itemId);
            if (!item) continue;

            const y = startY + i * rowHeight;

            // Item color indicator
            const colorBox = this.scene.add.rectangle(centerX - 200, y, 30, 30, getItemColor(item));
            colorBox.setStrokeStyle(2, 0xffffff);
            this.elements.push(colorBox);

            // Item name
            const nameText = this.scene.add.text(centerX - 170, y - 10, item.name, {
                fontSize: '16px',
                fontFamily: 'Arial',
                color: '#ffffff',
                fontStyle: 'bold'
            }).setOrigin(0, 0.5);
            this.elements.push(nameText);

            // Item stats
            const statsStr = this.formatStats(item.stats);
            const statsText = this.scene.add.text(centerX - 170, y + 10, statsStr, {
                fontSize: '12px',
                fontFamily: 'Arial',
                color: '#aaaaaa'
            }).setOrigin(0, 0.5);
            this.elements.push(statsText);

            // Price
            const priceText = this.scene.add.text(centerX + 80, y, `${shopItem.price}g`, {
                fontSize: '16px',
                fontFamily: 'Arial',
                color: '#ffdd44'
            }).setOrigin(0.5);
            this.elements.push(priceText);

            // Buy button
            const buyBtn = this.scene.add.text(centerX + 160, y, '[Buy]', {
                fontSize: '16px',
                fontFamily: 'Arial',
                color: '#44ff44',
                backgroundColor: '#335533',
                padding: { x: 10, y: 5 }
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });

            buyBtn.shopItemIndex = i;
            buyBtn.on('pointerdown', () => this.buyItem(i));
            buyBtn.on('pointerover', () => {
                if (buyBtn.canAfford) {
                    buyBtn.setBackgroundColor('#447744');
                }
            });
            buyBtn.on('pointerout', () => {
                if (buyBtn.canAfford) {
                    buyBtn.setBackgroundColor('#335533');
                }
            });

            this.elements.push(buyBtn);
            this.buyButtons.push(buyBtn);
        }
    }

    formatStats(stats) {
        const parts = [];
        if (stats.atk) parts.push(`ATK +${stats.atk}`);
        if (stats.def) parts.push(`DEF +${stats.def}`);
        if (stats.maxHp) parts.push(`HP +${stats.maxHp}`);
        if (stats.hpRegen) parts.push(`REGEN +${stats.hpRegen}`);
        return parts.join(', ');
    }

    buyItem(index) {
        const shopItem = SHOP_ITEMS[index];
        const item = getItemById(shopItem.itemId);
        if (!item) return;

        // Check if can afford
        if (this.player.gold < shopItem.price) {
            return;
        }

        // Check if inventory has space
        if (this.player.inventory.isFull()) {
            this.showMessage('Inventory Full!', '#ff4444');
            return;
        }

        // Deduct gold and add item
        this.player.gold -= shopItem.price;
        this.player.inventory.addItem(shopItem.itemId);

        // Show purchase confirmation
        this.showMessage(`+${item.name}!`, '#44ff44');

        // Refresh display
        this.refresh();
    }

    showMessage(text, color) {
        const centerX = 640;
        const centerY = 360;

        const msgText = this.scene.add.text(centerX, centerY, text, {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: color,
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5).setDepth(150);

        this.scene.tweens.add({
            targets: msgText,
            y: centerY - 80,
            alpha: 0,
            duration: 1500,
            ease: 'Power2',
            onComplete: () => msgText.destroy()
        });
    }

    refresh() {
        // Update gold display
        this.goldText.setText(`Your Gold: ${this.player.gold}`);

        // Update buy button states
        for (let i = 0; i < this.buyButtons.length; i++) {
            const btn = this.buyButtons[i];
            const shopItem = SHOP_ITEMS[i];
            const canAfford = this.player.gold >= shopItem.price;

            btn.canAfford = canAfford;

            if (canAfford) {
                btn.setColor('#44ff44');
                btn.setBackgroundColor('#335533');
                btn.setInteractive({ useHandCursor: true });
            } else {
                btn.setColor('#666666');
                btn.setBackgroundColor('#333333');
                btn.disableInteractive();
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
