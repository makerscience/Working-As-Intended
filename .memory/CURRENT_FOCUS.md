# CURRENT_FOCUS

## One-liner
- MVP idle clicker RPG with shop and rarity-based item combining system is playable.

## Active Objectives (max 3)
1. Test shop functionality (buy items, gold deduction, inventory full handling)
2. Consider next post-MVP features (boss monsters, save/load, more items)

## Next Actions
- [ ] Test shop in browser - verify buying items deducts gold
- [ ] Verify shop buttons gray out when can't afford
- [ ] Verify "Inventory Full!" appears when inventory is full
- [ ] Test that shop and inventory can be open independently
- [ ] Add save/load system

## Open Loops / Blockers
- None currently

## How to Resume in 30 Seconds
- **Open:** `index.html` in browser to test game
- **Next:** Test shop, then pick next post-MVP feature (save/load recommended)
- **If unclear:** Check plan for post-MVP features list

## Key Context
- Memory files: `.memory/CURRENT_FOCUS.md`, `.memory/DECISIONS.md`
- Main game scene: `src/scenes/Game.js`
- Player entity: `src/entities/Player.js`
- Monster entity: `src/entities/Monster.js`
- Monster data: `src/data/monsters.js`
- Item data: `src/data/items.js` (rarity system)
- Shop data: `src/data/shop.js` (shop inventory & prices)
- Inventory system: `src/systems/Inventory.js` (stacking/merging)
- UI: `src/ui/GameUI.js`, `src/ui/InventoryUI.js`, `src/ui/ShopUI.js`

---

## Last Session Summary (max ~8 bullets)
- Created `src/data/shop.js` with SHOP_ITEMS array (5 common items with prices)
- Created `src/ui/ShopUI.js` following InventoryUI pattern
- Added shop button [S] Shop at (1180, 50) in Game.js
- Added keyboard listener for 'S' key to toggle shop
- Shop shows item name, stats, price, and Buy button for each item
- Buy buttons disable (gray) when player can't afford item
- Floating text shows purchase confirmation or "Inventory Full!" warning

## Pinned References
- Governance rules: `CLAUDE.md`
- Implementation plan: (completed)

Hard rule: If "Key Context" becomes a wall of text, move it into real docs and link here.
