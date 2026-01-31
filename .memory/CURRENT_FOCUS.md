# CURRENT_FOCUS

## One-liner
- MVP idle clicker RPG with rarity-based item combining system is playable.

## Active Objectives (max 3)
1. Test and verify the rarity & combining system works correctly
2. Consider next post-MVP features (shop, boss monsters, save/load)

## Next Actions
- [ ] Test game in browser - verify item drops, stacking, merging, and upgrades
- [ ] Verify drag-and-drop merging works correctly
- [ ] Verify 10 common items upgrade to 1 uncommon
- [ ] Test equipping from stacks (click takes 1, leaves rest)
- [ ] Add shop functionality
- [ ] Add save/load system

## Open Loops / Blockers
- None currently

## How to Resume in 30 Seconds
- **Open:** `index.html` in browser to test game
- **Next:** Verify rarity system, then pick next post-MVP feature
- **If unclear:** Check plan for post-MVP features list

## Key Context
- Memory files: `.memory/CURRENT_FOCUS.md`, `.memory/DECISIONS.md`
- Main game scene: `src/scenes/Game.js`
- Player entity: `src/entities/Player.js`
- Monster entity: `src/entities/Monster.js`
- Monster data: `src/data/monsters.js`
- Item data: `src/data/items.js` (now with rarity system)
- Inventory system: `src/systems/Inventory.js` (now with stacking/merging)
- UI: `src/ui/GameUI.js`, `src/ui/InventoryUI.js` (now with drag-and-drop)

---

## Last Session Summary (max ~8 bullets)
- Replaced tiered items with rarity variants (Common/Uncommon/Rare)
- Added COMBINE_COST=10, getUpgradeTarget(), getItemColor(), getRarityName() helpers
- Updated monster drop tables to only drop common variants
- Changed inventory to store {id, quantity} objects for stacking
- Added mergeItems() method and auto-upgrade on reaching 10
- Implemented drag-and-drop in InventoryUI for combining items
- Added rarity border colors (brown/green/blue) to inventory slots
- Added floating upgrade notification text

## Pinned References
- Governance rules: `CLAUDE.md`
- Implementation plan: (completed)

Hard rule: If "Key Context" becomes a wall of text, move it into real docs and link here.
