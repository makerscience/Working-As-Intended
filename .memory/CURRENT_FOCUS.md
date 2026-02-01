# CURRENT_FOCUS

## One-liner
- MVP idle clicker RPG with shop, areas, custom art support is playable and ready for AI-generated assets.

## Active Objectives (max 3)
1. Generate and import custom image assets via ComfyUI
2. Implement save/load system for persistence
3. Playtest and balance area progression

## Next Actions
- [ ] Generate player sprite in ComfyUI (80x130, transparent background)
- [ ] Generate monster sprites (slime, goblin, orc, troll) with consistent style
- [ ] Drop PNGs into `assets/` folders and test loading
- [ ] Implement save/load using localStorage
- [ ] Add save button to UI or auto-save on key events

## Open Loops / Blockers
- None currently

## How to Resume in 30 Seconds
- **Open:** `index.html` in browser to test game
- **Next:** Use ComfyUI to generate sprites, drop into `assets/` folder
- **Asset guide:** See `assets/README.md` for sizes and tips

## Key Context
- Memory files: `.memory/CURRENT_FOCUS.md`, `.memory/DECISIONS.md`
- Main game scene: `src/scenes/Game.js`
- Player entity: `src/entities/Player.js`
- Monster entity: `src/entities/Monster.js`
- **Assets folder: `assets/` with `player/`, `monsters/`, `items/`, `ui/` subfolders**
- Area data: `src/data/areas.js`
- Area UI: `src/ui/AreaUI.js`
- Item/Shop data: `src/data/items.js`, `src/data/shop.js`
- UI: `src/ui/GameUI.js`, `src/ui/InventoryUI.js`, `src/ui/ShopUI.js`

---

## Last Session Summary (max ~8 bullets)
- Implemented area progression system (Forest → Dark Caves → Troll Mountains)
- Added mini-bosses: Giant Slime, Goblin Chief, Troll King
- Fixed duplicate monster spawn bug when changing areas
- Replaced placeholder rectangles/circles with procedural character art
- Player is now a little dude; each monster type has unique visual design
- Added custom asset loading system for ComfyUI-generated sprites
- Created `assets/` folder structure with README guidelines
- Game loads PNGs if present, falls back to procedural graphics

## Pinned References
- Governance rules: `CLAUDE.md`
- Asset guidelines: `assets/README.md`

Hard rule: If "Key Context" becomes a wall of text, move it into real docs and link here.
