import { getItemById, getItemColor, getRarityName } from '../data/items.js';

export class InventoryUI {
    constructor(scene, player) {
        this.scene = scene;
        this.player = player;
        this.visible = false;
        this.elements = [];

        // Drag state
        this.draggedIndex = -1;
        this.dragGhost = null;
        this.dragStartX = 0;
        this.dragStartY = 0;

        // Create all UI elements but keep hidden
        this.createUI();
        this.hide();

        // Listen for upgrade events to show floating text
        this.player.inventory.setOnUpgrade((newItemId) => {
            this.showUpgradeText(newItemId);
        });
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

        // Create drag ghost (hidden by default)
        this.dragGhost = this.scene.add.container(0, 0);
        this.dragGhostBg = this.scene.add.rectangle(0, 0, 50, 50, 0x444466, 0.8);
        this.dragGhostText = this.scene.add.text(0, 0, '', {
            fontSize: '9px',
            fontFamily: 'Arial',
            color: '#ffffff',
            align: 'center',
            wordWrap: { width: 45 }
        }).setOrigin(0.5);
        this.dragGhost.add([this.dragGhostBg, this.dragGhostText]);
        this.dragGhost.setVisible(false);
        this.dragGhost.setDepth(200);
    }

    createEquipmentSlots(startX, startY) {
        const slotNames = ['Weapon', 'Armor', 'Accessory'];
        const slotKeys = ['weapon', 'armor', 'accessory'];

        this.equipmentSlots = [];
        this.equipmentTexts = [];
        this.equipmentBorders = [];

        for (let i = 0; i < 3; i++) {
            const y = startY + i * 80;

            // Slot label (above the box)
            const label = this.scene.add.text(startX, y - 38, slotNames[i], {
                fontSize: '14px',
                fontFamily: 'Arial',
                color: '#aaaaaa'
            }).setOrigin(0.5);
            this.elements.push(label);

            // Rarity border (behind slot)
            const border = this.scene.add.rectangle(startX, y, 156, 56, 0x333344);
            border.setStrokeStyle(3, 0x333344);
            this.elements.push(border);
            this.equipmentBorders.push(border);

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
        this.inventoryBorders = [];

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const index = row * cols + col;
                const x = startX + col * (cellSize + gap);
                const y = startY + row * (cellSize + gap);

                // Rarity border (behind slot)
                const border = this.scene.add.rectangle(x, y, cellSize + 4, cellSize + 4, 0x222233);
                border.setStrokeStyle(3, 0x222233);
                this.elements.push(border);
                this.inventoryBorders.push(border);

                // Slot background
                const slot = this.scene.add.rectangle(x, y, cellSize, cellSize, 0x333344);
                slot.setInteractive({ useHandCursor: true, draggable: false });
                slot.slotIndex = index;
                slot.x_pos = x;
                slot.y_pos = y;

                // Drag and click events
                slot.on('pointerdown', (pointer) => this.onSlotPointerDown(index, pointer));
                slot.on('pointerup', (pointer) => this.onSlotPointerUp(index, pointer));
                slot.on('pointerover', () => this.onSlotPointerOver(index, slot));
                slot.on('pointerout', () => this.onSlotPointerOut(index, slot));

                this.elements.push(slot);
                this.inventorySlots.push(slot);

                // Item indicator (small colored square)
                const indicator = this.scene.add.rectangle(x, y, cellSize - 10, cellSize - 10, 0x000000);
                indicator.setVisible(false);
                this.elements.push(indicator);

                // Item name text
                const text = this.scene.add.text(x, y, '', {
                    fontSize: '9px',
                    fontFamily: 'Arial',
                    color: '#ffffff',
                    align: 'center',
                    wordWrap: { width: 50 }
                }).setOrigin(0.5);
                this.elements.push(text);

                this.inventoryTexts.push({ indicator, text });
            }
        }

        // Global pointer move and up for drag
        this.scene.input.on('pointermove', (pointer) => this.onPointerMove(pointer));
        this.scene.input.on('pointerup', (pointer) => this.onPointerUp(pointer));
    }

    onSlotPointerDown(index, pointer) {
        const inventory = this.player.inventory;
        if (index >= inventory.items.length) return;

        // Start potential drag
        this.draggedIndex = index;
        this.dragStartX = pointer.x;
        this.dragStartY = pointer.y;
    }

    onSlotPointerUp(index, pointer) {
        const inventory = this.player.inventory;

        // Check if this was a drag-and-drop onto a different slot
        if (this.draggedIndex >= 0 && this.draggedIndex !== index) {
            // Attempt merge
            if (index < inventory.items.length) {
                inventory.mergeItems(this.draggedIndex, index);
            }
        } else if (this.draggedIndex === index && !this.isDragging()) {
            // It was a click (not a drag) - equip the item
            if (index < inventory.items.length) {
                inventory.equipItem(index);
            }
        }

        this.endDrag();
        this.refresh();
    }

    onSlotPointerOver(index, slot) {
        const inventory = this.player.inventory;

        if (this.draggedIndex >= 0 && this.draggedIndex !== index) {
            // Dragging over a potential drop target
            if (index < inventory.items.length) {
                const draggedItem = inventory.getItemAt(this.draggedIndex);
                const targetItem = inventory.getItemAt(index);
                if (draggedItem && targetItem && draggedItem.id === targetItem.id) {
                    // Valid merge target - highlight green
                    slot.setFillStyle(0x44aa44);
                    return;
                }
            }
        }

        // Default hover
        if (index < inventory.items.length) {
            slot.setFillStyle(0x444455);
        }
    }

    onSlotPointerOut(index, slot) {
        slot.setFillStyle(0x333344);
    }

    onPointerMove(pointer) {
        if (this.draggedIndex < 0) return;
        if (!this.visible) return;

        // Check if moved enough to start drag
        const dx = pointer.x - this.dragStartX;
        const dy = pointer.y - this.dragStartY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 5) {
            // Show drag ghost
            const inventory = this.player.inventory;
            const slot = inventory.getItemAt(this.draggedIndex);
            if (slot) {
                const item = getItemById(slot.id);
                if (item) {
                    this.dragGhost.setPosition(pointer.x, pointer.y);
                    this.dragGhost.setVisible(true);
                    this.dragGhostBg.setFillStyle(getItemColor(item));
                    const displayName = slot.quantity > 1 ? `${item.name} (${slot.quantity})` : item.name;
                    this.dragGhostText.setText(displayName);
                }
            }
        }
    }

    onPointerUp(pointer) {
        if (this.draggedIndex >= 0) {
            this.endDrag();
        }
    }

    isDragging() {
        return this.dragGhost && this.dragGhost.visible;
    }

    endDrag() {
        this.draggedIndex = -1;
        if (this.dragGhost) {
            this.dragGhost.setVisible(false);
        }
        // Reset all slot colors
        for (const slot of this.inventorySlots) {
            slot.setFillStyle(0x333344);
        }
    }

    onEquipmentSlotClick(slotKey) {
        if (this.player.inventory.unequipItem(slotKey)) {
            this.refresh();
        }
    }

    showUpgradeText(newItemId) {
        const item = getItemById(newItemId);
        if (!item) return;

        const rarityName = getRarityName(item.rarity);
        const displayText = rarityName ? `+${rarityName} ${item.name}!` : `+${item.name}!`;
        const color = item.rarity ? getItemColor(item) : 0xffffff;

        // Create floating text at center of inventory
        const centerX = 640;
        const centerY = 360;

        const floatText = this.scene.add.text(centerX, centerY, displayText, {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#' + color.toString(16).padStart(6, '0'),
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5).setDepth(150);

        // Animate: float up and fade out
        this.scene.tweens.add({
            targets: floatText,
            y: centerY - 80,
            alpha: 0,
            duration: 1500,
            ease: 'Power2',
            onComplete: () => floatText.destroy()
        });
    }

    refresh() {
        const inventory = this.player.inventory;

        // Update equipment slots
        const slotKeys = ['weapon', 'armor', 'accessory'];
        for (let i = 0; i < 3; i++) {
            const itemId = inventory.equipped[slotKeys[i]];
            if (itemId) {
                const item = getItemById(itemId);
                if (item) {
                    // Show rarity in name for equipment
                    const rarityName = getRarityName(item.rarity);
                    const displayName = rarityName ? `${rarityName} ${item.name}` : item.name;
                    this.equipmentTexts[i].setText(displayName);
                    this.equipmentTexts[i].setColor('#ffffff');
                    // Set border color based on rarity
                    const borderColor = getItemColor(item);
                    this.equipmentBorders[i].setStrokeStyle(3, borderColor);
                } else {
                    this.equipmentTexts[i].setText('???');
                    this.equipmentTexts[i].setColor('#ffffff');
                    this.equipmentBorders[i].setStrokeStyle(3, 0x333344);
                }
            } else {
                this.equipmentTexts[i].setText('(empty)');
                this.equipmentTexts[i].setColor('#666666');
                this.equipmentBorders[i].setStrokeStyle(3, 0x333344);
            }
        }

        // Update inventory grid
        for (let i = 0; i < 20; i++) {
            const { indicator, text } = this.inventoryTexts[i];
            const border = this.inventoryBorders[i];

            if (i < inventory.items.length) {
                const slot = inventory.items[i];
                const item = getItemById(slot.id);
                if (item) {
                    const itemColor = getItemColor(item);
                    indicator.setFillStyle(itemColor);
                    indicator.setVisible(true);

                    // Show quantity if > 1
                    const displayName = slot.quantity > 1 ? `${item.name} (${slot.quantity})` : item.name;
                    text.setText(displayName);

                    // Set rarity border color
                    border.setStrokeStyle(3, itemColor);
                } else {
                    indicator.setVisible(false);
                    text.setText('');
                    border.setStrokeStyle(3, 0x222233);
                }
            } else {
                indicator.setVisible(false);
                text.setText('');
                border.setStrokeStyle(3, 0x222233);
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
        this.endDrag();
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
