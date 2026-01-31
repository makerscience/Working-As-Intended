import { getItemById } from '../data/items.js';

export class InventoryUI {
    constructor(scene, player) {
        this.scene = scene;
        this.player = player;
        this.visible = false;
        this.elements = [];

        // Create all UI elements but keep hidden
        this.createUI();
        this.hide();
    }

    createUI() {
        const centerX = 640;
        const centerY = 360;

        // Semi-transparent overlay background
        this.overlay = this.scene.add.rectangle(centerX, centerY, 650, 500, 0x000000, 0.85);
        this.elements.push(this.overlay);

        // Title
        this.title = this.scene.add.text(centerX, centerY - 220, 'INVENTORY', {
            fontSize: '28px',
            fontFamily: 'Arial',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.elements.push(this.title);

        // Close button (X)
        this.closeBtn = this.scene.add.text(centerX + 300, centerY - 220, 'X', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#ff4444',
            fontStyle: 'bold'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        this.closeBtn.on('pointerdown', () => this.hide());
        this.closeBtn.on('pointerover', () => this.closeBtn.setColor('#ff8888'));
        this.closeBtn.on('pointerout', () => this.closeBtn.setColor('#ff4444'));
        this.elements.push(this.closeBtn);

        // Equipment section (left side)
        this.createEquipmentSlots(centerX - 220, centerY - 100);

        // Inventory grid (right side)
        this.createInventoryGrid(centerX + 50, centerY - 100);

        // Stats display at bottom
        this.statsText = this.scene.add.text(centerX, centerY + 200, '', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#88ff88'
        }).setOrigin(0.5);
        this.elements.push(this.statsText);
    }

    createEquipmentSlots(startX, startY) {
        const slotNames = ['Weapon', 'Armor', 'Accessory'];
        const slotKeys = ['weapon', 'armor', 'accessory'];

        this.equipmentSlots = [];
        this.equipmentTexts = [];

        for (let i = 0; i < 3; i++) {
            const y = startY + i * 80;

            // Slot label (above the box)
            const label = this.scene.add.text(startX, y - 38, slotNames[i], {
                fontSize: '14px',
                fontFamily: 'Arial',
                color: '#aaaaaa'
            }).setOrigin(0.5);
            this.elements.push(label);

            // Slot background
            const slot = this.scene.add.rectangle(startX, y, 150, 50, 0x333344);
            slot.setInteractive({ useHandCursor: true });
            slot.slotKey = slotKeys[i];
            slot.on('pointerdown', () => this.onEquipmentSlotClick(slotKeys[i]));
            slot.on('pointerover', () => slot.setFillStyle(0x444455));
            slot.on('pointerout', () => slot.setFillStyle(0x333344));
            this.elements.push(slot);
            this.equipmentSlots.push(slot);

            // Item name text
            const text = this.scene.add.text(startX, y, '(empty)', {
                fontSize: '14px',
                fontFamily: 'Arial',
                color: '#666666'
            }).setOrigin(0.5);
            this.elements.push(text);
            this.equipmentTexts.push(text);
        }
    }

    createInventoryGrid(startX, startY) {
        const cols = 5;
        const rows = 4;
        const cellSize = 55;
        const gap = 5;

        this.inventorySlots = [];
        this.inventoryTexts = [];

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const index = row * cols + col;
                const x = startX + col * (cellSize + gap);
                const y = startY + row * (cellSize + gap);

                // Slot background
                const slot = this.scene.add.rectangle(x, y, cellSize, cellSize, 0x333344);
                slot.setInteractive({ useHandCursor: true });
                slot.slotIndex = index;
                slot.on('pointerdown', () => this.onInventorySlotClick(index));
                slot.on('pointerover', () => {
                    if (index < this.player.inventory.items.length) {
                        slot.setFillStyle(0x444455);
                    }
                });
                slot.on('pointerout', () => slot.setFillStyle(0x333344));
                this.elements.push(slot);
                this.inventorySlots.push(slot);

                // Item indicator (small colored square)
                const indicator = this.scene.add.rectangle(x, y, cellSize - 10, cellSize - 10, 0x000000);
                indicator.setVisible(false);
                this.elements.push(indicator);

                // Short name text
                const text = this.scene.add.text(x, y + 15, '', {
                    fontSize: '10px',
                    fontFamily: 'Arial',
                    color: '#ffffff'
                }).setOrigin(0.5);
                this.elements.push(text);

                this.inventoryTexts.push({ indicator, text });
            }
        }
    }

    onEquipmentSlotClick(slotKey) {
        if (this.player.inventory.unequipItem(slotKey)) {
            this.refresh();
        }
    }

    onInventorySlotClick(index) {
        if (index < this.player.inventory.items.length) {
            if (this.player.inventory.equipItem(index)) {
                this.refresh();
            }
        }
    }

    refresh() {
        const inventory = this.player.inventory;

        // Update equipment slots
        const slotKeys = ['weapon', 'armor', 'accessory'];
        for (let i = 0; i < 3; i++) {
            const itemId = inventory.equipped[slotKeys[i]];
            if (itemId) {
                const item = getItemById(itemId);
                this.equipmentTexts[i].setText(item ? item.name : '???');
                this.equipmentTexts[i].setColor('#ffffff');
            } else {
                this.equipmentTexts[i].setText('(empty)');
                this.equipmentTexts[i].setColor('#666666');
            }
        }

        // Update inventory grid
        for (let i = 0; i < 20; i++) {
            const { indicator, text } = this.inventoryTexts[i];
            if (i < inventory.items.length) {
                const itemId = inventory.items[i];
                const item = getItemById(itemId);
                if (item) {
                    indicator.setFillStyle(item.color);
                    indicator.setVisible(true);
                    // Show abbreviated name
                    const shortName = item.name.split(' ').map(w => w[0]).join('');
                    text.setText(shortName);
                } else {
                    indicator.setVisible(false);
                    text.setText('');
                }
            } else {
                indicator.setVisible(false);
                text.setText('');
            }
        }

        // Update stats display
        const bonuses = inventory.getEquipmentBonuses();
        const parts = [];
        if (bonuses.atk > 0) parts.push(`ATK +${bonuses.atk}`);
        if (bonuses.def > 0) parts.push(`DEF +${bonuses.def}`);
        if (bonuses.maxHp > 0) parts.push(`HP +${bonuses.maxHp}`);
        if (bonuses.hpRegen > 0) parts.push(`REGEN +${bonuses.hpRegen}/s`);

        this.statsText.setText(parts.length > 0 ? `Equipment Bonuses: ${parts.join('  ')}` : 'No equipment bonuses');
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
