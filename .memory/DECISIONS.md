# DECISIONS

Format:
- Date:
- Tags: (workflow, architecture, tooling, convention, failure-mode)
- Decision:
- Rationale:
- Alternatives considered:
- Consequences / Follow-ups:

---

## 2026-01-31
- Tags: architecture, workflow
- Decision: Governance-only memory (no MCP server) using CLAUDE.md + .memory files.
- Rationale: Minimum complexity while maintaining continuity across sessions.
- Alternatives considered: Full MCP project-memory server with ChromaDB.
- Consequences / Follow-ups: If memory friction grows, revisit adding MCP later.

---

## 2026-01-31
- Tags: architecture
- Decision: Replace tiered items with rarity-based combining (10→1 upgrade)
- Rationale: Reduces item count while adding meaningful progression mechanic. Players earn items through farming, then combine for upgrades.
- Alternatives considered: Keep tiered drops with different monsters; rarity-based drop rates instead of combining.
- Consequences / Follow-ups: Monsters now only drop common items; higher rarities earned through effort.

Tip: Search with `rg "Tags:.*workflow" .memory/DECISIONS.md`
