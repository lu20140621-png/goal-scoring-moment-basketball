# Goal-Scoring Moment — Basketball Edition

## Current playtest rules

### Core deck
- Functional deck: 48 cards, all dealt at the start of a round.
- BASKETBALL: exactly 1 separate possession marker; it is not part of the 48-card functional deck and is never dealt.
- 2-POINT SHOT ×14
- 3-POINTER ×10
- FREE THROW ×4
- BLOCK ×4
- CONTEST ×4
- STEAL ×4
- FOUL ×4
- PUMP FAKE ×4

### Player modes
- 2v2: 2 roles per team, 12 cards per role.
- 3v3: 3 roles per team, 8 cards per role.
- 4v4: 4 roles per team, 6 cards per role.

### Possession
- Opening possession: rock-paper-scissors.
- Normal possession changes use a fixed internal team rotation.
- PASS is a free action; there is no PASS card.
- STEAL can only be played against a PASS. The player using STEAL immediately takes the Basketball and can act.
- If the current ballholder has no shot, they may PASS to a teammate.
- If the entire team has no 2-POINT SHOT or 3-POINTER, possession transfers directly to the other team; this is not a PASS and cannot be stolen.
- If neither team has a shot card left, the round ends.

### Shooting and defense
- 2-POINT SHOT: +2 if successful; BLOCK is its primary defense.
- 3-POINTER: +3 if successful; CONTEST is its primary defense.
- FOUL can stop a shot and may lead to FREE THROW.
- FREE THROW: +1 when available after FOUL.

### PUMP FAKE — current locked playtest version
PUMP FAKE is not a shot-recovery card anymore.

1. 2-POINT SHOT → BLOCK → PUMP FAKE, or 3-POINTER → CONTEST → PUMP FAKE.
2. The original shot card is consumed.
3. BLOCK/CONTEST is consumed.
4. PUMP FAKE is consumed.
5. The play immediately converts into a new 2-POINT DRIVE.
6. The 2-POINT DRIVE cannot be BLOCKed or CONTESTed; only FOUL may stop it.
7. If there is no FOUL, the drive scores +2.
8. If FOUL is used, the drive is stopped and the normal FREE THROW process applies.
9. If the original shot is directly stopped by FOUL, PUMP FAKE cannot be used.

### Match
- Higher score wins the round.
- First team to win 3 rounds wins the match.
- Tie handling is still under playtest and should not be redesigned without approval.

## Role-card direction
Role cards are separate from the 48-card deck, hidden, usable once per round, reveal when activated, and are reshuffled/redealt next round. The code architecture may prepare for roles, but gameplay should not enable them until the role list and conflict rules are explicitly approved.
