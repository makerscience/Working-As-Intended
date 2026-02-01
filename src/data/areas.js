export const AREAS = [
    {
        id: 'forest',
        name: 'Forest',
        monsterPool: ['Slime', 'Goblin'],
        miniBoss: {
            baseMonster: 'Slime',
            name: 'Giant Slime',
            hpMultiplier: 3,      // 60 HP
            atkMultiplier: 2,     // 4 ATK
            xpMultiplier: 5,      // 50 XP
            goldMultiplier: 10,   // 50 gold
            color: 0x22dd22,
            sizeMultiplier: 1.5,
            drops: [{ itemId: 'health_ring', chance: 0.50 }]
        }
    },
    {
        id: 'dark_caves',
        name: 'Dark Caves',
        monsterPool: ['Slime', 'Goblin', 'Orc'],
        miniBoss: {
            baseMonster: 'Goblin',
            name: 'Goblin Chief',
            hpMultiplier: 3,      // 105 HP
            atkMultiplier: 2.5,   // 10 ATK
            xpMultiplier: 5,      // 100 XP
            goldMultiplier: 10,   // 100 gold
            color: 0xddaa22,
            sizeMultiplier: 1.6,
            drops: [{ itemId: 'power_amulet', chance: 0.50 }]
        }
    },
    {
        id: 'troll_mountains',
        name: 'Troll Mountains',
        monsterPool: ['Slime', 'Goblin', 'Orc', 'Troll'],
        miniBoss: {
            baseMonster: 'Troll',
            name: 'Troll King',
            hpMultiplier: 4,      // 200 HP
            atkMultiplier: 3,     // 18 ATK
            xpMultiplier: 10,     // 800 XP
            goldMultiplier: 20,   // 1000 gold
            color: 0x9944dd,
            sizeMultiplier: 1.8,
            drops: [{ itemId: 'regen_charm', chance: 0.75 }]
        }
    }
];

export function getAreaById(areaId) {
    return AREAS.find(area => area.id === areaId);
}

export function getNextArea(currentAreaId) {
    const currentIndex = AREAS.findIndex(area => area.id === currentAreaId);
    if (currentIndex >= 0 && currentIndex < AREAS.length - 1) {
        return AREAS[currentIndex + 1];
    }
    return null;
}
