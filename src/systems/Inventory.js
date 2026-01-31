import { getItemById } from '../data/items.js';

export class Inventory {
    constructor(maxSlots = 20) {
        this.maxSlots = maxSlots;
        this.items = []; // Array of item IDs
        this.equipped = {
            weapon: null,
            armor: null,
            accessory: null
        };
        this.onChangeCallback = null;
    }

    setOnChange(callback) {
        this.onChangeCallback = callback;
    }

    notifyChange() {
        if (this.onChangeCallback) {
            this.onChangeCallback();
        }
    }

    addItem(itemId) {
        if (this.items.length >= this.maxSlots) {
            return false;
        }
        this.items.push(itemId);
        this.notifyChange();
        return true;
    }

    removeItem(index) {
        if (index < 0 || index >= this.items.length) {
            return null;
        }
        const removed = this.items.splice(index, 1)[0];
        this.notifyChange();
        return removed;
    }

    equipItem(index) {
        if (index < 0 || index >= this.items.length) {
            return false;
        }

        const itemId = this.items[index];
        const item = getItemById(itemId);
        if (!item) return false;

        const slot = item.slot;

        // If something is already equipped in that slot, swap it
        if (this.equipped[slot]) {
            const previousItemId = this.equipped[slot];
            this.items[index] = previousItemId;
        } else {
            // Remove from inventory
            this.items.splice(index, 1);
        }

        // Equip the new item
        this.equipped[slot] = itemId;
        this.notifyChange();
        return true;
    }

    unequipItem(slot) {
        if (!this.equipped[slot]) {
            return false;
        }

        // Check if inventory has space
        if (this.items.length >= this.maxSlots) {
            return false;
        }

        // Move to inventory
        this.items.push(this.equipped[slot]);
        this.equipped[slot] = null;
        this.notifyChange();
        return true;
    }

    getEquipmentBonuses() {
        const bonuses = {
            atk: 0,
            def: 0,
            maxHp: 0,
            hpRegen: 0
        };

        for (const slot of ['weapon', 'armor', 'accessory']) {
            if (this.equipped[slot]) {
                const item = getItemById(this.equipped[slot]);
                if (item && item.stats) {
                    for (const [stat, value] of Object.entries(item.stats)) {
                        if (bonuses.hasOwnProperty(stat)) {
                            bonuses[stat] += value;
                        }
                    }
                }
            }
        }

        return bonuses;
    }

    isFull() {
        return this.items.length >= this.maxSlots;
    }
}
