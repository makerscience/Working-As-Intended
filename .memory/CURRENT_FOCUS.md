# CURRENT_FOCUS

## One-liner
- MVP idle clicker RPG with hybrid combat loop and equipment system is now playable.

## Active Objectives (max 3)
1. Test and verify the inventory/equipment system works correctly
2. Consider next post-MVP features (shop, boss monsters, save/load)

## Next Actions
- [ ] Test game in browser - verify item drops, inventory UI, equipping items
- [ ] Add shop functionality
- [ ] Add boss monsters
- [ ] Add save/load system

## Open Loops / Blockers
- None currently

## How to Resume in 30 Seconds
- **Open:** `index.html` in browser to test game
- **Next:** Verify inventory system, then pick next post-MVP feature
- **If unclear:** Check plan for post-MVP features list

## Key Context
- Memory files: `.memory/CURRENT_FOCUS.md`, `.memory/DECISIONS.md`
- Main game scene: `src/scenes/Game.js`
- Player entity: `src/entities/Player.js`
- Monster entity: `src/entities/Monster.js`
- Monster data: `src/data/monsters.js`
- Item data: `src/data/items.js`
- Inventory system: `src/systems/Inventory.js`
- UI: `src/ui/GameUI.js`, `src/ui/InventoryUI.js`

---

## Last Session Summary (max ~8 bullets)
- Created item definitions with 9 items (3 weapons, 3 armor, 3 accessories)
- Implemented Inventory system with 20 slots and 3 equipment slots
- Added drop tables to all 4 monster types (5-10% drop chances)
- Updated Player class with base stats and equipment bonuses
- Created InventoryUI overlay with equipment slots and 5x4 inventory grid
- Added 'I' key and button to toggle inventory UI
- Integrated drop rolling on monster death with floating "+Item Name" text
- Added "Inventory Full!" warning message

## Pinned References
- Governance rules: `CLAUDE.md`
- Implementation plan: (completed)

Hard rule: If "Key Context" becomes a wall of text, move it into real docs and link here.
