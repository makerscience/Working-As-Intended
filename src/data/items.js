// Rarity tiers and colors
export const RARITY = {
    COMMON: 'common',
    UNCOMMON: 'uncommon',
    RARE: 'rare'
};

export const RARITY_COLORS = {
    [RARITY.COMMON]: 0x8b4513,    // Brown
    [RARITY.UNCOMMON]: 0x44aa44,  // Green
    [RARITY.RARE]: 0x4488ff       // Blue
};

// Number of items needed to combine into next tier
export const COMBINE_COST = 10;

export const ITEMS = [
    // Weapons - Wooden Sword (rarity variants)
    {
        id: 'wooden_sword_common',
        name: 'Wooden Sword',
        slot: 'weapon',
        stats: { atk: 2 },
        rarity: RARITY.COMMON,
        upgradesTo: 'wooden_sword_uncommon'
    },
    {
        id: 'wooden_sword_uncommon',
        name: 'Wooden Sword',
        slot: 'weapon',
        stats: { atk: 5 },
        rarity: RARITY.UNCOMMON,
        upgradesTo: 'wooden_sword_rare'
    },
    {
        id: 'wooden_sword_rare',
        name: 'Wooden Sword',
        slot: 'weapon',
        stats: { atk: 8 },
        rarity: RARITY.RARE,
        upgradesTo: null
    },

    // Armor - Leather Vest (rarity variants)
    {
        id: 'leather_vest_common',
        name: 'Leather Vest',
        slot: 'armor',
        stats: { def: 2, maxHp: 10 },
        rarity: RARITY.COMMON,
        upgradesTo: 'leather_vest_uncommon'
    },
    {
        id: 'leather_vest_uncommon',
        name: 'Leather Vest',
        slot: 'armor',
        stats: { def: 4, maxHp: 20 },
        rarity: RARITY.UNCOMMON,
        upgradesTo: 'leather_vest_rare'
    },
    {
        id: 'leather_vest_rare',
        name: 'Leather Vest',
        slot: 'armor',
        stats: { def: 7, maxHp: 35 },
        rarity: RARITY.RARE,
        upgradesTo: null
    },

    // Accessories (no rarity system)
    { id: 'health_ring', name: 'Health Ring', slot: 'accessory', stats: { maxHp: 25 }, color: 0x44aa44 },
    { id: 'power_amulet', name: 'Power Amulet', slot: 'accessory', stats: { atk: 3 }, color: 0xaa4444 },
    { id: 'regen_charm', name: 'Regen Charm', slot: 'accessory', stats: { hpRegen: 2 }, color: 0x44aaaa }
];

export function getItemById(id) {
    return ITEMS.find(item => item.id === id) || null;
}

// Returns the upgrade target item ID, or null if item cannot be upgraded
export function getUpgradeTarget(itemId) {
    const item = getItemById(itemId);
    return item?.upgradesTo || null;
}

// Get the display color for an item (rarity color or item-specific color)
export function getItemColor(item) {
    if (item.rarity) {
        return RARITY_COLORS[item.rarity];
    }
    return item.color || 0x888888;
}

// Get rarity display name (capitalized)
export function getRarityName(rarity) {
    if (!rarity) return null;
    return rarity.charAt(0).toUpperCase() + rarity.slice(1);
}
