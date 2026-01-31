# CHANGELOG

## Unreleased
- (most recent significant changes go here)

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
