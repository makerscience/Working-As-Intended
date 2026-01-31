export const ITEMS = [
    // Weapons (ATK)
    { id: 'wooden_sword', name: 'Wooden Sword', slot: 'weapon', stats: { atk: 2 }, color: 0x8b4513 },
    { id: 'iron_sword', name: 'Iron Sword', slot: 'weapon', stats: { atk: 5 }, color: 0xaaaaaa },
    { id: 'steel_blade', name: 'Steel Blade', slot: 'weapon', stats: { atk: 8 }, color: 0x6688aa },

    // Armor (DEF, maxHp)
    { id: 'leather_vest', name: 'Leather Vest', slot: 'armor', stats: { def: 2, maxHp: 10 }, color: 0x8b4513 },
    { id: 'chainmail', name: 'Chainmail', slot: 'armor', stats: { def: 4, maxHp: 20 }, color: 0x888888 },
    { id: 'plate_armor', name: 'Plate Armor', slot: 'armor', stats: { def: 7, maxHp: 35 }, color: 0x666699 },

    // Accessories (varied)
    { id: 'health_ring', name: 'Health Ring', slot: 'accessory', stats: { maxHp: 25 }, color: 0x44aa44 },
    { id: 'power_amulet', name: 'Power Amulet', slot: 'accessory', stats: { atk: 3 }, color: 0xaa4444 },
    { id: 'regen_charm', name: 'Regen Charm', slot: 'accessory', stats: { hpRegen: 2 }, color: 0x44aaaa }
];

export function getItemById(id) {
    return ITEMS.find(item => item.id === id) || null;
}
