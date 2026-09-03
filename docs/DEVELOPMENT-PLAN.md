# Engineering plan

## Goal
Turn the current single-file prototype into a maintainable browser game without changing approved gameplay during the refactor.

## Phase 1 — safe refactor
1. Keep GitHub Pages playable at all times.
2. Split presentation, rules/config, game engine, AI, and UI rendering into separate modules.
3. Keep all 8 WebP card assets and use them from one central mapping.
4. Preserve 2v2 / 3v3 / 4v4 exactly.
5. Preserve fixed-rotation possession, PASS/STEAL, FOUL/FREE THROW and current PUMP FAKE behavior exactly.
6. Add lightweight invariant checks: 48-card deck, even dealing, no negative card counts, exactly one Basketball holder during live possession.

## Phase 2 — strategy/AI
1. Move HARD AI decisions into a dedicated AI module.
2. AI may count public/played cards and estimate hidden cards, but may not inspect hidden player hands.
3. Add decision tracing in debug mode so playtests can reveal why AI chose BLOCK, CONTEST, FOUL, PUMP FAKE, PASS or STEAL.

## Phase 3 — hidden roles
Prepare a role engine with: hidden identity, once-per-round use, reveal-on-use, passive triggers, next-round reshuffle, and deterministic conflict resolution. Do not enable the role set until approved.

## Phase 4 — UX
Use real card images in hands and response prompts, improve mobile layout, add clear possession/shot/defense animations, and keep card names readable without forcing players to inspect a log.

## Non-negotiable engineering constraint
A refactor must not silently change game rules. Rules changes and code cleanup must be separate commits whenever possible.
