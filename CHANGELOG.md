# CHANGELOG

## Unreleased
- Added support for custom image assets (ComfyUI/AI-generated)
  - Assets folder structure: `assets/player/`, `assets/monsters/`, etc.
  - Game loads PNGs if present, falls back to procedural graphics
  - See `assets/README.md` for image guidelines and sizes
- Replaced placeholder art with custom character graphics
  - Player is now a little dude with hair, face, shirt, pants, and shoes
  - Slime: blobby shape with big eyes and cute smile
  - Goblin: small creature with pointy ears, angry eyes, and fangs
  - Orc: bulky brute with tusks, red eyes, and big fists
  - Troll: large hunched beast with messy hair and long arms
- Fixed duplicate monster spawn when changing areas
- Added area progression system with mini-bosses
  - 3 areas: Forest (Slimes, Goblins), Dark Caves (+Orcs), Troll Mountains (+Trolls)
  - Toggle Areas panel with 'A' key or [A] Areas button
  - Each area has a mini-boss (Giant Slime, Goblin Chief, Troll King)
  - Defeating boss unlocks next area; can return to previous areas to farm
  - Bosses have larger sprites, gold "BOSS:" prefix, and enhanced stats/rewards
- Added shop system
  - Toggle with 'S' key or [S] Shop button
  - Sells 5 common items: Wooden Sword (25g), Leather Vest (25g), Health Ring (50g), Power Amulet (50g), Regen Charm (50g)
  - Buy buttons gray out when can't afford
  - Floating text confirms purchase, "Inventory Full!" if no space
- Added rarity & item combining system
  - Items now have rarity tiers: Common (brown), Uncommon (green), Rare (blue)
  - Drag-and-drop to manually merge same items; 10 items auto-upgrade to next rarity
  - Items don't auto-stack - each drop goes to its own slot until manually combined
  - Removed tiered items (Iron Sword, Steel Blade, Chainmail, Plate Armor)
  - Kept Wooden Sword and Leather Vest with 3 rarity variants each
  - Stats scale with rarity: Common→Uncommon→Rare matches old tier progression
  - Click on stacked items equips 1 and leaves the rest
  - Floating text notification on upgrade ("+Uncommon Wooden Sword!")

---

## 2026-01-31
- Fixed inventory UI display issues
  - Inventory overlay now renders above game objects (monsters, player)
  - Equipment slot labels no longer obscured by slot boxes
  - Adjusted layout to fit properly within game window
- Balanced Troll monster (HP: 100→50, ATK: 12→6)
- Added equipment-only inventory system with monster drops
  - 9 items: 3 weapons (ATK), 3 armor (DEF + maxHp), 3 accessories (varied)
  - 20-slot inventory with 3 equipment slots (weapon, armor, accessory)
  - Toggle overlay UI with 'I' key or button click
  - Click to equip/unequip items, auto-swap when slot is occupied
  - Equipment bonuses affect player stats in real-time
- Added drop tables to monsters (5-10% chance per item)
  - Floating "+Item Name" text on item drop
  - "Inventory Full!" warning when inventory is full
- Implemented MVP idle clicker RPG combat system
  - Player entity with stats (HP, ATK, DEF), leveling, and auto-attack
  - Monster entity with 4 types (Slime, Goblin, Orc, Troll)
  - Hybrid combat: auto-attack every 1.5s + click for 50% bonus damage
  - GameUI with stats bar, gold display, XP bar, and floating damage numbers
  - Death/respawn cycle with 3s respawn timer
- Initialized governance-only memory system (CLAUDE.md + .memory files).
