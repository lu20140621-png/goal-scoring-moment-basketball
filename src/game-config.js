export const CARD_SPEC = Object.freeze({
  TWO: 14,
  THREE: 10,
  FT: 4,
  BLOCK: 4,
  CONTEST: 4,
  STEAL: 4,
  FOUL: 4,
  PUMP: 4,
});

export const CARD_NAMES = Object.freeze({
  TWO: '2-POINT SHOT',
  THREE: '3-POINTER',
  FT: 'FREE THROW',
  BLOCK: 'BLOCK',
  CONTEST: 'CONTEST',
  STEAL: 'STEAL',
  FOUL: 'FOUL',
  PUMP: 'PUMP FAKE',
});

export const CARD_ART = Object.freeze({
  TWO: 'images/two-point-shot.webp',
  THREE: 'images/three-pointer.webp',
  FT: 'images/free-throw.webp',
  BLOCK: 'images/block.webp',
  CONTEST: 'images/contest.webp',
  STEAL: 'images/steal.webp',
  FOUL: 'images/foul.webp',
  PUMP: 'images/pump-fake.webp',
});

export const GAME_MODES = Object.freeze({
  '2v2': { rolesPerTeam: 2, cardsPerRole: 12 },
  '3v3': { rolesPerTeam: 3, cardsPerRole: 8 },
  '4v4': { rolesPerTeam: 4, cardsPerRole: 6 },
});

export const GAME_RULES = Object.freeze({
  deckSize: 48,
  basketballCount: 1,
  winsNeeded: 3,
  normalPossessionUsesFixedRotation: true,
  passIsFreeAction: true,
  stealOnlyOnPass: true,
  noTeamShotTransfersPossession: true,
  pumpFake: Object.freeze({
    triggersOn: Object.freeze({ TWO: 'BLOCK', THREE: 'CONTEST' }),
    consumesOriginalShot: true,
    consumesDefense: true,
    consumesPumpFake: true,
    convertsTo: '2-POINT DRIVE',
    drivePoints: 2,
    driveCanOnlyBeStoppedBy: 'FOUL',
    directFoulCannotBePumpFaked: true,
  }),
});

// Architecture placeholder only. Do not enable role skills in gameplay until the
// role system has been playtested and explicitly approved.
export const ROLE_CANDIDATES = Object.freeze([
  { id: 'SHARPSHOOTER', timing: 'active', effect: 'Once per round: own 3-POINTER is guaranteed; CONTEST and FOUL fail.' },
  { id: 'PERIMETER_LOCK', timing: 'active', effect: 'Once per round: make one opposing 3-POINTER miss.' },
  { id: 'FINISHER', timing: 'active', effect: 'Once per round: own 2-POINT SHOT is guaranteed; BLOCK and FOUL fail.' },
  { id: 'AND_ONE', timing: 'reaction', effect: 'Once per round when fouled on a shot: shot counts and FREE THROW may follow.' },
  { id: 'ANKLE_BREAKER', timing: 'reaction', effect: 'Once per round after BLOCK/CONTEST: defense fails and the shot scores.' },
  { id: 'CLUTCH_SHOOTER', timing: 'passive', effect: 'At round end while trailing by 1-3: reveal and add a buzzer-beater 3.' },
  { id: 'MID_RANGE_SPECIALIST', timing: 'active', effect: 'Once per round: play one FREE THROW as a 2-POINT SHOT.' },
]);
