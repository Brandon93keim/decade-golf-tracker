// Strokes Gained Benchmarks based on PGA Tour averages
// These are used to calculate SG for each shot type

// Tee Shot Starting Benchmarks (expected strokes to hole out from tee)
export const TEE_SHOT_PAR4_BENCHMARKS: Record<number, number> = {
  300: 3.75,
  326: 3.82,
  351: 3.89,
  376: 3.96,
  401: 4.03,
  426: 4.10,
  451: 4.17,
  476: 4.24,
  500: 4.31,
};

export const TEE_SHOT_PAR5_BENCHMARKS: Record<number, number> = {
  450: 4.6,
  476: 4.7,
  501: 4.8,
  526: 4.9,
  551: 5.0,
  576: 5.1,
  600: 5.2,
};

// Ending Position Benchmarks (expected strokes from position after tee shot)
export const POSITION_BENCHMARKS: Record<number, Record<string, number>> = {
  0:   { F: 2.35, R: 2.45, HR: 2.60, T: 2.80, B: 2.55, P: 4.0 },
  51:  { F: 2.50, R: 2.60, HR: 2.75, T: 2.95, B: 2.70, P: 4.0 },
  76:  { F: 2.65, R: 2.75, HR: 2.90, T: 3.10, B: 2.85, P: 4.0 },
  101: { F: 2.80, R: 2.90, HR: 3.05, T: 3.25, B: 3.00, P: 4.0 },
  126: { F: 2.91, R: 3.01, HR: 3.16, T: 3.36, B: 3.11, P: 4.0 },
  151: { F: 2.98, R: 3.08, HR: 3.23, T: 3.43, B: 3.18, P: 4.0 },
  176: { F: 3.16, R: 3.26, HR: 3.41, T: 3.61, B: 3.36, P: 4.0 },
  201: { F: 3.40, R: 3.50, HR: 3.65, T: 3.85, B: 3.60, P: 4.0 },
  226: { F: 3.65, R: 3.75, HR: 3.90, T: 4.10, B: 3.85, P: 4.0 },
  251: { F: 3.90, R: 4.00, HR: 4.15, T: 4.35, B: 4.10, P: 4.0 },
  276: { F: 4.10, R: 4.20, HR: 4.35, T: 4.55, B: 4.30, P: 4.0 },
  300: { F: 4.30, R: 4.40, HR: 4.55, T: 4.75, B: 4.50, P: 4.0 },
};

// Approach Shot Benchmarks (expected strokes from fairway)
export const APPROACH_FAIRWAY_BENCHMARKS: Record<number, number> = {
  50: 2.40,
  60: 2.50,
  70: 2.55,
  80: 2.60,
  90: 2.65,
  100: 2.70,
  110: 2.73,
  120: 2.77,
  130: 2.80,
  140: 2.84,
  150: 2.91,
  160: 2.95,
  170: 2.98,
  180: 3.04,
  190: 3.10,
  200: 3.16,
  210: 3.23,
  220: 3.30,
  230: 3.37,
  240: 3.45,
  250: 3.53,
};

// Lie adjustments for approach shots
export const APPROACH_LIE_ADJUSTMENTS: Record<string, number> = {
  F: 0,      // Fairway
  R: 0.10,   // Rough
  HR: 0.20,  // Heavy Rough
  T: 0.40,   // Trees/Trouble
  FB: 0.25,  // Fairway Bunker
};

// Short Game Benchmarks by lie type
export const SHORT_GAME_BENCHMARKS: Record<string, Record<number, number>> = {
  GF: { // Green Fringe
    0: 1.85, 1: 1.90, 2: 1.95, 3: 2.00, 4: 2.05, 5: 2.08,
  },
  FR: { // Fairway/First Cut
    0: 2.10, 6: 2.20, 11: 2.25, 16: 2.30, 21: 2.35, 26: 2.40,
    31: 2.45, 36: 2.50, 41: 2.55, 46: 2.60,
  },
  R: { // Rough
    0: 2.20, 6: 2.30, 11: 2.35, 16: 2.40, 21: 2.45, 26: 2.50,
    31: 2.55, 36: 2.60, 41: 2.65, 46: 2.70,
  },
  HR: { // Heavy Rough
    0: 2.35, 6: 2.45, 11: 2.50, 20: 2.55, 21: 2.60, 26: 2.65,
    31: 2.70, 36: 2.75, 41: 2.80, 46: 2.85,
  },
  GBS: { // Greenside Bunker
    0: 2.40, 6: 2.47, 11: 2.52, 16: 2.57, 21: 2.61, 26: 2.66,
    31: 2.70, 36: 2.75, 41: 2.80, 46: 2.85,
  },
  FBS: { // Fairway Bunker (close to green)
    0: 2.50, 6: 2.57, 11: 2.62, 16: 2.67, 21: 2.71, 26: 2.76,
    31: 2.80, 36: 2.85, 41: 2.90, 46: 2.95,
  },
};

// Putting Benchmarks
export const PUTTING_BENCHMARKS: Record<number, { avgPutts: number; makePercent: number }> = {
  1: { avgPutts: 1.00, makePercent: 1.00 },
  2: { avgPutts: 1.01, makePercent: 0.96 },
  3: { avgPutts: 1.04, makePercent: 0.88 },
  4: { avgPutts: 1.07, makePercent: 0.77 },
  5: { avgPutts: 1.15, makePercent: 0.66 },
  6: { avgPutts: 1.20, makePercent: 0.58 },
  7: { avgPutts: 1.26, makePercent: 0.51 },
  8: { avgPutts: 1.32, makePercent: 0.45 },
  9: { avgPutts: 1.39, makePercent: 0.40 },
  10: { avgPutts: 1.46, makePercent: 0.36 },
  11: { avgPutts: 1.52, makePercent: 0.32 },
  12: { avgPutts: 1.58, makePercent: 0.29 },
  13: { avgPutts: 1.64, makePercent: 0.27 },
  14: { avgPutts: 1.69, makePercent: 0.25 },
  15: { avgPutts: 1.74, makePercent: 0.23 },
  16: { avgPutts: 1.78, makePercent: 0.21 },
  17: { avgPutts: 1.81, makePercent: 0.20 },
  18: { avgPutts: 1.84, makePercent: 0.19 },
  19: { avgPutts: 1.87, makePercent: 0.18 },
  20: { avgPutts: 1.89, makePercent: 0.17 },
  21: { avgPutts: 1.91, makePercent: 0.16 },
  22: { avgPutts: 1.93, makePercent: 0.16 },
  23: { avgPutts: 1.95, makePercent: 0.15 },
  24: { avgPutts: 1.96, makePercent: 0.15 },
  25: { avgPutts: 1.98, makePercent: 0.14 },
  27: { avgPutts: 1.99, makePercent: 0.14 },
  29: { avgPutts: 2.01, makePercent: 0.13 },
  31: { avgPutts: 2.03, makePercent: 0.13 },
  33: { avgPutts: 2.05, makePercent: 0.12 },
  35: { avgPutts: 2.06, makePercent: 0.12 },
  38: { avgPutts: 2.08, makePercent: 0.11 },
  41: { avgPutts: 2.10, makePercent: 0.11 },
  45: { avgPutts: 2.12, makePercent: 0.10 },
  50: { avgPutts: 2.15, makePercent: 0.09 },
  60: { avgPutts: 2.20, makePercent: 0.08 },
  70: { avgPutts: 2.25, makePercent: 0.06 },
  80: { avgPutts: 2.28, makePercent: 0.05 },
  90: { avgPutts: 2.31, makePercent: 0.04 },
  100: { avgPutts: 2.34, makePercent: 0.03 },
};

// Proximity to expected putts (for approach/short game ending benchmarks)
export const PROXIMITY_TO_PUTTS: Record<number, number> = {
  0: 0,
  1: 1.00,
  2: 1.01,
  3: 1.04,
  4: 1.07,
  5: 1.15,
  6: 1.20,
  8: 1.32,
  10: 1.46,
  12: 1.58,
  15: 1.74,
  18: 1.84,
  20: 1.89,
  21: 1.91,
  24: 1.96,
  25: 1.98,
  30: 2.03,
  33: 2.05,
  40: 2.10,
  45: 2.12,
  48: 2.15,
  51: 2.15,
  60: 2.20,
  65: 2.22,
  70: 2.25,
  75: 2.27,
  80: 2.28,
  90: 2.31,
  100: 2.34,
  120: 3.25, // Miss green - chip situation
};

// Lie codes and their display names
export const LIE_CODES = {
  teeShot: {
    F: 'Fairway',
    RL: 'Rough Left',
    RR: 'Rough Right',
    HRL: 'Heavy Rough Left',
    HRR: 'Heavy Rough Right',
    TL: 'Trees Left',
    TR: 'Trees Right',
    BL: 'Bunker Left',
    BR: 'Bunker Right',
    LR: 'Light Rough',
    P: 'Penalty',
  },
  approach: {
    F: 'Fairway',
    R: 'Rough',
    HR: 'Heavy Rough',
    T: 'Trees/Trouble',
    FB: 'Fairway Bunker',
  },
  shortGame: {
    GF: 'Green Fringe',
    FR: 'Fairway/First Cut',
    R: 'Rough',
    HR: 'Heavy Rough',
    GBS: 'Greenside Bunker',
    FBS: 'Fairway Bunker',
  },
  putt: {
    RL: 'Right to Left',
    LR: 'Left to Right',
    S: 'Straight',
  },
  slope: {
    U: 'Uphill',
    D: 'Downhill',
    F: 'Flat',
  },
};

// Club options
export const CLUBS = [
  'Dr', '3W', '5W', '7W',
  '2i', '3i', '4i', '5i', '6i', '7i', '8i', '9i',
  'PW', 'GW', '50', '52', '54', '56', '58', '60', 'LW',
  'Putter'
];
