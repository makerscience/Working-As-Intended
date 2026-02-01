# CURRENT_FOCUS

## One-liner
- MVP idle clicker RPG with shop, item combining, and area progression system is playable.

## Active Objectives (max 3)
1. Test area progression system in browser
2. Consider save/load system for next feature

## Next Actions
- [ ] Test Areas panel opens with 'A' key and button
- [ ] Verify only Slimes and Goblins spawn in Forest
- [ ] Test Giant Slime boss fight (click [Fight Giant Slime])
- [ ] Verify Dark Caves unlocks after boss defeat
- [ ] Test switching areas with [GO] button
- [ ] Verify boss defeated status persists in UI

## Open Loops / Blockers
- None currently

## How to Resume in 30 Seconds
- **Open:** `index.html` in browser to test game
- **Next:** Test area progression, then save/load system
- **If unclear:** Check plan for post-MVP features list

## Key Context
- Memory files: `.memory/CURRENT_FOCUS.md`, `.memory/DECISIONS.md`
- Main game scene: `src/scenes/Game.js`
- Player entity: `src/entities/Player.js`
- Monster entity: `src/entities/Monster.js`
- Monster data: `src/data/monsters.js`
- **Area data: `src/data/areas.js`** (new - area definitions with bosses)
- **Area UI: `src/ui/AreaUI.js`** (new - area selection panel)
- Item data: `src/data/items.js` (rarity system)
- Shop data: `src/data/shop.js` (shop inventory & prices)
- Inventory system: `src/systems/Inventory.js` (stacking/merging)
- UI: `src/ui/GameUI.js`, `src/ui/InventoryUI.js`, `src/ui/ShopUI.js`

---

## Last Session Summary (max ~8 bullets)
- Created `src/data/areas.js` with 3 areas: Forest, Dark Caves, Troll Mountains
- Each area has monster pool and mini-boss with multiplied stats
- Added area tracking to Player: currentArea, unlockedAreas, defeatedBosses
- Updated Monster.js to support boss visuals (larger size, gold name prefix)
- Created `src/ui/AreaUI.js` with area list, [GO]/[CURRENT]/[LOCKED] states
- Added [A] Areas button and keyboard shortcut in Game.js
- Area-filtered monster spawning based on current area
- Boss death unlocks next area with notification

## Pinned References
- Governance rules: `CLAUDE.md`
- Implementation plan: (completed)

Hard rule: If "Key Context" becomes a wall of text, move it into real docs and link here.
