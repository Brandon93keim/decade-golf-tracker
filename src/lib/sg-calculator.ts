import {
  TEE_SHOT_PAR4_BENCHMARKS,
  TEE_SHOT_PAR5_BENCHMARKS,
  POSITION_BENCHMARKS,
  APPROACH_FAIRWAY_BENCHMARKS,
  APPROACH_LIE_ADJUSTMENTS,
  SHORT_GAME_BENCHMARKS,
  PUTTING_BENCHMARKS,
  PROXIMITY_TO_PUTTS,
} from '@/data/benchmarks';

// Helper to interpolate between benchmark values
function interpolate(value: number, benchmarks: Record<number, number>): number {
  const keys = Object.keys(benchmarks).map(Number).sort((a, b) => a - b);
  
  if (value <= keys[0]) return benchmarks[keys[0]];
  if (value >= keys[keys.length - 1]) return benchmarks[keys[keys.length - 1]];
  
  for (let i = 0; i < keys.length - 1; i++) {
    if (value >= keys[i] && value <= keys[i + 1]) {
      const ratio = (value - keys[i]) / (keys[i + 1] - keys[i]);
      return benchmarks[keys[i]] + ratio * (benchmarks[keys[i + 1]] - benchmarks[keys[i]]);
    }
  }
  
  return benchmarks[keys[keys.length - 1]];
}

// Get starting benchmark for tee shot based on hole distance and par
export function getTeeStartingBenchmark(holeDistance: number, par: number): number {
  if (par === 3) return 3.0; // Par 3s don't have tee shot SG typically
  
  const benchmarks = par === 5 ? TEE_SHOT_PAR5_BENCHMARKS : TEE_SHOT_PAR4_BENCHMARKS;
  return interpolate(holeDistance, benchmarks);
}

// Get ending benchmark after tee shot based on distance remaining and lie
export function getTeeEndingBenchmark(distanceRemaining: number, lie: string, isPenalty: boolean): number {
  if (isPenalty) return 4.0;
  
  // Map lie codes to benchmark categories
  const lieMap: Record<string, string> = {
    F: 'F',
    RL: 'R', RR: 'R', LR: 'R',
    HRL: 'HR', HRR: 'HR',
    TL: 'T', TR: 'T',
    BL: 'B', BR: 'B',
    P: 'P',
  };
  
  const lieCategory = lieMap[lie] || 'R';
  const keys = Object.keys(POSITION_BENCHMARKS).map(Number).sort((a, b) => a - b);
  
  // Find the appropriate distance bracket
  let bracketKey = keys[0];
  for (const key of keys) {
    if (distanceRemaining >= key) bracketKey = key;
    else break;
  }
  
  return POSITION_BENCHMARKS[bracketKey][lieCategory] || POSITION_BENCHMARKS[bracketKey]['R'];
}

// Calculate SG for a tee shot
export function calculateTeeShotSG(
  holeDistance: number,
  par: number,
  distanceRemaining: number,
  lie: string,
  isPenalty: boolean
): { startBenchmark: number; endBenchmark: number; sg: number } {
  const startBenchmark = getTeeStartingBenchmark(holeDistance, par);
  const endBenchmark = getTeeEndingBenchmark(distanceRemaining, lie, isPenalty);
  const sg = startBenchmark - endBenchmark - 1; // -1 for the stroke taken
  
  return { startBenchmark, endBenchmark, sg: Math.round(sg * 100) / 100 };
}

// Get approach starting benchmark
export function getApproachStartingBenchmark(distance: number, lie: string): number {
  const baseBenchmark = interpolate(distance, APPROACH_FAIRWAY_BENCHMARKS);
  const adjustment = APPROACH_LIE_ADJUSTMENTS[lie] || 0;
  return Math.round((baseBenchmark + adjustment) * 100) / 100;
}

// Get ending benchmark based on proximity (in feet)
export function getProximityBenchmark(proximityFeet: number, onGreen: boolean): number {
  if (!onGreen && proximityFeet > 100) {
    return 3.25; // Chip situation
  }
  
  const keys = Object.keys(PROXIMITY_TO_PUTTS).map(Number).sort((a, b) => a - b);
  
  // Find closest key
  let closestKey = keys[0];
  let minDiff = Math.abs(proximityFeet - keys[0]);
  
  for (const key of keys) {
    const diff = Math.abs(proximityFeet - key);
    if (diff < minDiff) {
      minDiff = diff;
      closestKey = key;
    }
  }
  
  return PROXIMITY_TO_PUTTS[closestKey];
}

// Calculate SG for approach shot
export function calculateApproachSG(
  distance: number,
  lie: string,
  proximityFeet: number,
  onGreen: boolean
): { startBenchmark: number; endBenchmark: number; sg: number } {
  const startBenchmark = getApproachStartingBenchmark(distance, lie);
  const endBenchmark = getProximityBenchmark(proximityFeet, onGreen);
  const sg = startBenchmark - endBenchmark - 1;
  
  return { startBenchmark, endBenchmark, sg: Math.round(sg * 100) / 100 };
}

// Get short game starting benchmark
export function getShortGameStartingBenchmark(distance: number, lie: string): number {
  const lieBenchmarks = SHORT_GAME_BENCHMARKS[lie] || SHORT_GAME_BENCHMARKS['FR'];
  const keys = Object.keys(lieBenchmarks).map(Number).sort((a, b) => a - b);
  
  // Find the appropriate distance bracket
  let bracketKey = keys[0];
  for (const key of keys) {
    if (distance >= key) bracketKey = key;
    else break;
  }
  
  return lieBenchmarks[bracketKey];
}

// Calculate SG for short game shot
export function calculateShortGameSG(
  distance: number,
  lie: string,
  proximityFeet: number
): { startBenchmark: number; endBenchmark: number; sg: number } {
  const startBenchmark = getShortGameStartingBenchmark(distance, lie);
  const endBenchmark = proximityFeet === 0 ? 0 : getProximityBenchmark(proximityFeet, true);
  const sg = startBenchmark - endBenchmark - 1;
  
  return { startBenchmark, endBenchmark, sg: Math.round(sg * 100) / 100 };
}

// Get putting benchmark
export function getPuttingBenchmark(distanceFeet: number): number {
  if (distanceFeet <= 1) return 1.0;
  
  const keys = Object.keys(PUTTING_BENCHMARKS).map(Number).sort((a, b) => a - b);
  
  // Find the appropriate bracket
  for (let i = 0; i < keys.length - 1; i++) {
    if (distanceFeet >= keys[i] && distanceFeet < keys[i + 1]) {
      // Interpolate
      const ratio = (distanceFeet - keys[i]) / (keys[i + 1] - keys[i]);
      const start = PUTTING_BENCHMARKS[keys[i]].avgPutts;
      const end = PUTTING_BENCHMARKS[keys[i + 1]].avgPutts;
      return Math.round((start + ratio * (end - start)) * 100) / 100;
    }
  }
  
  return PUTTING_BENCHMARKS[keys[keys.length - 1]].avgPutts;
}

// Calculate SG for putt
export function calculatePuttSG(
  distanceFeet: number,
  made: boolean,
  remainingDistanceFeet?: number
): { startBenchmark: number; endBenchmark: number; sg: number } {
  const startBenchmark = getPuttingBenchmark(distanceFeet);
  const endBenchmark = made ? 0 : getPuttingBenchmark(remainingDistanceFeet || 2);
  const sg = startBenchmark - endBenchmark - 1;
  
  return { startBenchmark, endBenchmark, sg: Math.round(sg * 100) / 100 };
}

// Calculate total SG for a round
export interface RoundSGSummary {
  sgTotal: number;
  sgOTT: number;  // Off the tee
  sgAPP: number;  // Approach
  sgARG: number;  // Around the green
  sgPUTT: number; // Putting
}

export function calculateRoundSG(
  teeShots: { sg: number }[],
  approaches: { sg: number }[],
  shortGame: { sg: number }[],
  putts: { sg: number }[]
): RoundSGSummary {
  const sgOTT = teeShots.reduce((sum, shot) => sum + shot.sg, 0);
  const sgAPP = approaches.reduce((sum, shot) => sum + shot.sg, 0);
  const sgARG = shortGame.reduce((sum, shot) => sum + shot.sg, 0);
  const sgPUTT = putts.reduce((sum, shot) => sum + shot.sg, 0);
  
  return {
    sgTotal: Math.round((sgOTT + sgAPP + sgARG + sgPUTT) * 100) / 100,
    sgOTT: Math.round(sgOTT * 100) / 100,
    sgAPP: Math.round(sgAPP * 100) / 100,
    sgARG: Math.round(sgARG * 100) / 100,
    sgPUTT: Math.round(sgPUTT * 100) / 100,
  };
}
