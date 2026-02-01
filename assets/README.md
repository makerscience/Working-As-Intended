# Game Assets

Place your generated images here. The game will automatically use them if found, otherwise falls back to procedural graphics.

## Folder Structure

```
assets/
├── player/
│   └── player.png          # Player character (recommended: 80x130)
├── monsters/
│   ├── slime.png           # Slime monster (recommended: 100x100)
│   ├── goblin.png          # Goblin monster (recommended: 100x120)
│   ├── orc.png             # Orc monster (recommended: 120x140)
│   ├── troll.png           # Troll monster (recommended: 140x160)
│   ├── giant_slime.png     # Boss: Giant Slime (recommended: 150x150)
│   ├── goblin_chief.png    # Boss: Goblin Chief (recommended: 160x190)
│   └── troll_king.png      # Boss: Troll King (recommended: 250x290)
├── items/
│   └── (future: item icons)
└── ui/
    └── (future: UI elements)
```

## Image Guidelines

- **Format:** PNG with transparent background
- **Style:** Keep consistent across all assets
- **Size:** See recommendations above, but game will scale to fit

## ComfyUI Tips

- Use "game sprite", "2D character", "transparent background" in prompts
- Generate at 512x512 or 768x768, then resize down for crisp pixels
- Use the same seed/style for consistency across monsters
- Consider "idle pose", "front facing" for static sprites
