import { getItemById, getUpgradeTarget, COMBINE_COST } from '../data/items.js';

export class Inventory {
    constructor(maxSlots = 20) {
        this.maxSlots = maxSlots;
        this.items = []; // Array of { id, quantity } objects
        this.equipped = {
            weapon: null,
            armor: null,
            accessory: null
        };
        this.onChangeCallback = null;
        this.onUpgradeCallback = null; // Called when item upgrades: (newItemId) => void
    }

    setOnChange(callback) {
        this.onChangeCallback = callback;
    }

    setOnUpgrade(callback) {
        this.onUpgradeCallback = callback;
    }

    notifyChange() {
        if (this.onChangeCallback) {
            this.onChangeCallback();
        }
    }

    notifyUpgrade(newItemId) {
        if (this.onUpgradeCallback) {
            this.onUpgradeCallback(newItemId);
        }
    }

    // Find slot index containing item with given ID, or -1 if not found
    findItemSlot(itemId) {
        return this.items.findIndex(slot => slot.id === itemId);
    }

    // Add item to inventory. Each item goes into its own slot.
    // Returns true if successful, false if inventory full.
    addItem(itemId) {
        if (this.items.length >= this.maxSlots) {
            return false;
        }

        this.items.push({ id: itemId, quantity: 1 });
        this.notifyChange();
        return true;
    }

    // Remove entire stack at index
    removeItem(index) {
        if (index < 0 || index >= this.items.length) {
            return null;
        }
        const removed = this.items.splice(index, 1)[0];
        this.notifyChange();
        return removed;
    }

    // Get item data at slot
    getItemAt(index) {
        if (index < 0 || index >= this.items.length) {
            return null;
        }
        return this.items[index];
    }

    // Check if item at index should upgrade, and perform upgrade if so
    checkUpgrade(index) {
        const slot = this.items[index];
        if (!slot || slot.quantity < COMBINE_COST) return false;

        const upgradeTarget = getUpgradeTarget(slot.id);
        if (!upgradeTarget) return false;

        // Perform upgrade: consume 10 items, create 1 upgraded item
        slot.quantity -= COMBINE_COST;

        // If stack is empty after consumption, replace with upgraded item
        if (slot.quantity === 0) {
            slot.id = upgradeTarget;
            slot.quantity = 1;
        } else {
            // Stack still has items, need to add upgraded item separately
            const existingUpgradeSlot = this.findItemSlot(upgradeTarget);
            if (existingUpgradeSlot >= 0) {
                this.items[existingUpgradeSlot].quantity++;
                // Check if the upgraded item can upgrade further
                this.checkUpgrade(existingUpgradeSlot);
            } else if (this.items.length < this.maxSlots) {
                this.items.push({ id: upgradeTarget, quantity: 1 });
            }
            // If inventory is full and can't stack, upgraded item is lost
            // (edge case - shouldn't happen often)
        }

        this.notifyUpgrade(upgradeTarget);
        return true;
    }

    // Merge items from source slot into target slot
    // Returns true if merge happened, false if invalid
    mergeItems(sourceIndex, targetIndex) {
        if (sourceIndex === targetIndex) return false;
        if (sourceIndex < 0 || sourceIndex >= this.items.length) return false;
        if (targetIndex < 0 || targetIndex >= this.items.length) return false;

        const source = this.items[sourceIndex];
        const target = this.items[targetIndex];

        // Can only merge same item type
        if (source.id !== target.id) return false;

        // Merge quantities
        target.quantity += source.quantity;

        // Remove source slot
        this.items.splice(sourceIndex, 1);

        // Adjust target index if it shifted due to removal
        let adjustedTargetIndex = targetIndex;
        if (sourceIndex < targetIndex) {
            adjustedTargetIndex--;
        }

        // Check for upgrade
        this.checkUpgrade(adjustedTargetIndex);

        this.notifyChange();
        return true;
    }

    // Equip item from inventory slot
    // If quantity > 1, splits stack (takes 1, leaves rest)
    equipItem(index) {
        if (index < 0 || index >= this.items.length) {
            return false;
        }

        const slot = this.items[index];
        const itemToEquip = getItemById(slot.id);
        if (!itemToEquip) return false;

        const equipSlot = itemToEquip.slot;
        const previouslyEquipped = this.equipped[equipSlot];

        if (slot.quantity > 1) {
            // Stack has multiple items - take one off
            slot.quantity--;

            // If something was equipped, it needs to go back to inventory
            if (previouslyEquipped) {
                const existingSlot = this.findItemSlot(previouslyEquipped);
                if (existingSlot >= 0) {
                    this.items[existingSlot].quantity++;
                } else if (this.items.length < this.maxSlots) {
                    this.items.push({ id: previouslyEquipped, quantity: 1 });
                }
            }
        } else {
            // Single item in slot
            if (previouslyEquipped) {
                // Swap: replace slot with previously equipped item
                slot.id = previouslyEquipped;
                slot.quantity = 1;
            } else {
                // Just remove the slot
                this.items.splice(index, 1);
            }
        }

        // Equip the new item
        this.equipped[equipSlot] = itemToEquip.id;
        this.notifyChange();
        return true;
    }

    unequipItem(slot) {
        if (!this.equipped[slot]) {
            return false;
        }

        // Need a new slot
        if (this.items.length >= this.maxSlots) {
            return false;
        }

        this.items.push({ id: this.equipped[slot], quantity: 1 });
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
