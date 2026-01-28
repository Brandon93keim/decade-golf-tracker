// Course data types
export interface HoleInfo {
  number: number;
  par: number;
  yardage: number;
}

export interface TeeBox {
  name: string;        // e.g., "Blue", "White", "Gold"
  rating: number;      // Course rating (e.g., 72.4)
  slope: number;       // Slope rating (e.g., 131)
  totalYardage: number;
  holes: HoleInfo[];
}

export interface Course {
  id: string;
  name: string;
  city?: string;
  state?: string;
  teeBoxes: TeeBox[];
  createdAt: string;
  updatedAt: string;
}

// Round data types
export interface Round {
  id: string;
  date: string;
  courseId: string;
  courseName: string;
  teeBoxName: string;
  courseRating: number;
  courseSlope: number;
  score: number;
  manualScore?: number;
  par: number;
  sgTotal: number;
  sgOTT: number;
  sgAPP: number;
  sgARG: number;
  sgPUTT: number;
  fir: number;
  firPct: number;
  gir: number;
  girPct: number;
  totalPutts: number;
  penalties: number;
  scrambling: string;
  notes: string;
  holes: HoleData[];
  isNineHole: boolean;
  nineHoleType?: 'front' | 'back';
  createdAt: string;
}

export interface HoleData {
  holeNumber: number;
  par: number;
  distance: number;
  score: number;
  teeShot?: TeeShotData;
  approaches: ApproachData[];
  shortGameShots: ShortGameData[];
  putts: PuttData[];
}

export interface TeeShotData {
  club: string;
  driveDistance: number;
  distanceRemaining: number;
  lie: string;
  isPenalty: boolean;
  startBenchmark: number;
  endBenchmark: number;
  sg: number;
  notes?: string;
}

export interface ApproachData {
  startingDistance: number;
  startingLie: string;
  club: string;
  onGreen: boolean;
  proximityFeet: number;
  startBenchmark: number;
  endBenchmark: number;
  sg: number;
  notes?: string;
}

export interface ShortGameData {
  startingDistance: number;
  startingLie: string;
  shotType: 'Chip' | 'Pitch' | 'Flop' | 'Bunker';
  club: string;
  proximityFeet: number;
  startBenchmark: number;
  endBenchmark: number;
  sg: number;
  notes?: string;
}

export interface PuttData {
  puttNumber: number;
  distanceFeet: number;
  made: boolean;
  remainingDistanceFeet?: number;
  break: string;
  slope: string;
  greenSpeed?: number;
  startBenchmark: number;
  endBenchmark: number;
  sg: number;
  notes?: string;
}

export interface ActiveRound {
  id: string;
  date: string;
  courseId: string;
  courseName: string;
  teeBoxName: string;
  courseRating: number;
  courseSlope: number;
  currentHole: number;
  holes: HoleData[];
  isNineHole: boolean;
  nineHoleType?: 'front' | 'back';
}

export interface DashboardStats {
  roundsPlayed: number;
  avgScore: number;
  avgSgTotal: number;
  avgSgOTT: number;
  avgSgAPP: number;
  avgSgARG: number;
  avgSgPUTT: number;
  avgFIR: number;
  avgGIR: number;
  avgPutts: number;
  lowRound: number;
  bestSg: number;
}
