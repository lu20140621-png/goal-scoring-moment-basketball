# Goal-Scoring Moment — Basketball Edition

Browser playtest for the basketball strategy card game.

## Live playtest
https://lu20140621-png.github.io/goal-scoring-moment-basketball/

## Current engineering work
The prototype is being refactored without changing approved gameplay. Current rules and the implementation plan are now stored separately so future AI, role cards, UI animation and balance changes do not silently alter the game.

- `docs/GAME-RULES.md` — current approved playtest rules
- `docs/DEVELOPMENT-PLAN.md` — refactor and development roadmap
- `src/game-config.js` — centralized deck counts, card names, art paths and gameplay constants

## Current functional deck
48 cards total: 2-POINT SHOT ×14, 3-POINTER ×10, FREE THROW ×4, BLOCK ×4, CONTEST ×4, STEAL ×4, FOUL ×4, PUMP FAKE ×4.

BASKETBALL ×1 is separate from the 48 functional cards.
