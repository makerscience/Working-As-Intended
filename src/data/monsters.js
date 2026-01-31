export const MONSTERS = [
    {
        name: 'Slime',
        hp: 20,
        atk: 2,
        hpRegen: 0,
        xpReward: 10,
        goldReward: 5,
        color: 0x44aa44,  // green
        drops: [
            { itemId: 'wooden_sword', chance: 0.10 },
            { itemId: 'leather_vest', chance: 0.10 }
        ]
    },
    {
        name: 'Goblin',
        hp: 35,
        atk: 4,
        hpRegen: 1,
        xpReward: 20,
        goldReward: 10,
        color: 0x88aa44,  // yellow-green
        drops: [
            { itemId: 'wooden_sword', chance: 0.08 },
            { itemId: 'iron_sword', chance: 0.05 },
            { itemId: 'health_ring', chance: 0.08 }
        ]
    },
    {
        name: 'Orc',
        hp: 60,
        atk: 7,
        hpRegen: 2,
        xpReward: 40,
        goldReward: 20,
        color: 0xaa6644,  // brown
        drops: [
            { itemId: 'iron_sword', chance: 0.10 },
            { itemId: 'chainmail', chance: 0.08 },
            { itemId: 'power_amulet', chance: 0.06 }
        ]
    },
    {
        name: 'Troll',
        hp: 50,
        atk: 6,
        hpRegen: 3,
        xpReward: 80,
        goldReward: 50,
        color: 0x666688,  // gray-blue
        drops: [
            { itemId: 'steel_blade', chance: 0.10 },
            { itemId: 'plate_armor', chance: 0.08 },
            { itemId: 'regen_charm', chance: 0.10 }
        ]
    }
];
