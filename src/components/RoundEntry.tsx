'use client';

import { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  X, 
  Flag,
  Target,
  Circle,
  MoreVertical,
  Trash2,
  Save,
  Edit3
} from 'lucide-react';
import { ActiveRound, Round, HoleData, TeeShotData, ApproachData, ShortGameData, PuttData } from '@/lib/types';
import { calculateRoundSG } from '@/lib/sg-calculator';
import TeeShotEntry from './shots/TeeShotEntry';
import ApproachEntry from './shots/ApproachEntry';
import ShortGameEntry from './shots/ShortGameEntry';
import PuttEntry from './shots/PuttEntry';

interface RoundEntryProps {
  activeRound: ActiveRound;
  onUpdateRound: (round: ActiveRound) => void;
  onCompleteRound: (round: Round) => void;
  onDiscardRound: () => void;
}

type ShotMode = 'overview' | 'tee' | 'approach' | 'layup' | 'short' | 'putt';

export default function RoundEntry({ 
  activeRound, 
  onUpdateRound, 
  onCompleteRound,
  onDiscardRound 
}: RoundEntryProps) {
  const [currentHoleIndex, setCurrentHoleIndex] = useState(0);
  const [shotMode, setShotMode] = useState<ShotMode>('overview');
  const [showMenu, setShowMenu] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [manualScore, setManualScore] = useState<number | ''>('');
  const [useManualScore, setUseManualScore] = useState(false);

  const hole = activeRound.holes[currentHoleIndex];
  const totalHoles = activeRound.holes.length;
  const isNineHole = activeRound.isNineHole;

  useEffect(() => {
    onUpdateRound({ ...activeRound, currentHole: hole.holeNumber });
  }, [currentHoleIndex]);

  const updateHole = (updatedHole: HoleData) => {
    const newHoles = [...activeRound.holes];
    newHoles[currentHoleIndex] = updatedHole;
    onUpdateRound({ ...activeRound, holes: newHoles });
  };

  const handleAddTeeShot = (teeShot: TeeShotData) => {
    updateHole({ ...hole, teeShot });
    setShotMode('overview');
  };

  const handleAddApproach = (approach: ApproachData) => {
    updateHole({ ...hole, approaches: [...hole.approaches, approach] });
    setShotMode('overview');
  };

  const handleAddShortGame = (shortGame: ShortGameData) => {
    updateHole({ ...hole, shortGameShots: [...hole.shortGameShots, shortGame] });
    setShotMode('overview');
  };

  const handleAddPutt = (putt: PuttData) => {
    updateHole({ ...hole, putts: [...hole.putts, putt] });
    setShotMode('overview');
  };

  const goToPrevHole = () => { if (currentHoleIndex > 0) setCurrentHoleIndex(currentHoleIndex - 1); };
  const goToNextHole = () => { if (currentHoleIndex < totalHoles - 1) setCurrentHoleIndex(currentHoleIndex + 1); };

  const clearLastShot = () => {
    if (hole.putts.length > 0) {
      updateHole({ ...hole, putts: hole.putts.slice(0, -1) });
    } else if (hole.shortGameShots.length > 0) {
      updateHole({ ...hole, shortGameShots: hole.shortGameShots.slice(0, -1) });
    } else if (hole.approaches.length > 0) {
      updateHole({ ...hole, approaches: hole.approaches.slice(0, -1) });
    } else if (hole.teeShot) {
      updateHole({ ...hole, teeShot: undefined });
    }
  };

  const getHoleScore = (h: HoleData): number => {
    let shots = 0;
    if (h.teeShot) { shots++; if (h.teeShot.isPenalty) shots++; }
    shots += h.approaches.length;
    shots += h.shortGameShots.length;
    shots += h.putts.length;
    return shots;
  };

  const calculateRoundTotals = (): Round => {
    const allTeeShots = activeRound.holes.filter(h => h.teeShot).map(h => h.teeShot!);
    const allApproaches = activeRound.holes.flatMap(h => h.approaches);
    const allShortGame = activeRound.holes.flatMap(h => h.shortGameShots);
    const allPutts = activeRound.holes.flatMap(h => h.putts);

    const sgSummary = calculateRoundSG(allTeeShots, allApproaches, allShortGame, allPutts);

    let calculatedScore = 0;
    activeRound.holes.forEach(h => {
      const shots = getHoleScore(h);
      calculatedScore += shots || h.par;
    });

    const finalScore = useManualScore && manualScore ? Number(manualScore) : calculatedScore;
    const totalPar = activeRound.holes.reduce((sum, h) => sum + h.par, 0);
    const totalPutts = allPutts.length;
    
    const drivingHoles = activeRound.holes.filter(h => h.par >= 4);
    const firHits = drivingHoles.filter(h => h.teeShot?.lie === 'F').length;
    
    const girHits = activeRound.holes.filter(h => {
      const regStrokes = h.par - 2;
      let strokesUsed = h.teeShot ? 1 : 0;
      for (let i = 0; i < h.approaches.length; i++) {
        strokesUsed++;
        if (h.approaches[i].onGreen && strokesUsed <= regStrokes) return true;
      }
      return false;
    }).length;

    const penalties = allTeeShots.filter(t => t.isPenalty).length;

    return {
      id: activeRound.id,
      date: activeRound.date,
      courseId: activeRound.courseId,
      courseName: activeRound.courseName,
      teeBoxName: activeRound.teeBoxName,
      courseRating: activeRound.courseRating,
      courseSlope: activeRound.courseSlope,
      score: finalScore,
      manualScore: useManualScore && manualScore ? Number(manualScore) : undefined,
      par: totalPar,
      ...sgSummary,
      fir: firHits,
      firPct: drivingHoles.length > 0 ? Math.round(firHits / drivingHoles.length * 100) / 100 : 0,
      gir: girHits,
      girPct: Math.round(girHits / activeRound.holes.length * 100) / 100,
      totalPutts,
      penalties,
      scrambling: '',
      notes: '',
      holes: activeRound.holes,
      isNineHole: activeRound.isNineHole,
      nineHoleType: activeRound.nineHoleType,
      createdAt: new Date().toISOString(),
    };
  };

  const handleFinishRound = () => {
    const completedRound = calculateRoundTotals();
    onCompleteRound(completedRound);
  };

  const getHoleSG = () => {
    let sg = 0;
    if (hole.teeShot) sg += hole.teeShot.sg;
    sg += hole.approaches.reduce((s, a) => s + a.sg, 0);
    sg += hole.shortGameShots.reduce((s, a) => s + a.sg, 0);
    sg += hole.putts.reduce((s, p) => s + p.sg, 0);
    return Math.round(sg * 100) / 100;
  };

  const getRunningScore = () => {
    let score = 0;
    activeRound.holes.slice(0, currentHoleIndex).forEach(h => {
      score += getHoleScore(h) || 0;
    });
    return score;
  };

  const getRunningPar = () => activeRound.holes.slice(0, currentHoleIndex).reduce((sum, h) => sum + h.par, 0);

  const getCalculatedTotal = () => {
    let score = 0;
    activeRound.holes.forEach(h => {
      score += getHoleScore(h) || h.par;
    });
    return score;
  };

  if (shotMode === 'tee') {
    return <TeeShotEntry hole={hole} onSave={handleAddTeeShot} onCancel={() => setShotMode('overview')} />;
  }
  if (shotMode === 'approach') {
    return <ApproachEntry hole={hole} onSave={handleAddApproach} onCancel={() => setShotMode('overview')} />;
  }
  if (shotMode === 'layup') {
    return <ApproachEntry hole={hole} onSave={handleAddApproach} onCancel={() => setShotMode('overview')} isLayup />;
  }
  if (shotMode === 'short') {
    return <ShortGameEntry hole={hole} onSave={handleAddShortGame} onCancel={() => setShotMode('overview')} />;
  }
  if (shotMode === 'putt') {
    return <PuttEntry hole={hole} puttNumber={hole.putts.length + 1} onSave={handleAddPutt} onCancel={() => setShotMode('overview')} />;
  }

  const hasShots = hole.teeShot || hole.approaches.length > 0 || hole.shortGameShots.length > 0 || hole.putts.length > 0;
  const currentHoleScore = getHoleScore(hole);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="p-4 pb-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">{activeRound.courseName}</h1>
            <p className="text-white/60 text-sm">
              {activeRound.teeBoxName} • {isNineHole ? (activeRound.nineHoleType === 'front' ? 'Front 9' : 'Back 9') : '18 Holes'}
            </p>
          </div>
          <div className="relative">
            <button onClick={() => setShowMenu(!showMenu)} className="p-2 rounded-lg hover:bg-white/10">
              <MoreVertical size={24} />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-12 bg-gray-900 rounded-lg shadow-xl border border-white/20 overflow-hidden z-50 min-w-[160px]">
                <button onClick={() => { setShowFinishModal(true); setShowMenu(false); }} className="flex items-center gap-2 px-4 py-3 hover:bg-white/10 w-full text-left">
                  <Save size={18} /> Finish Round
                </button>
                <button onClick={() => { onDiscardRound(); setShowMenu(false); }} className="flex items-center gap-2 px-4 py-3 hover:bg-white/10 w-full text-left text-red-400">
                  <Trash2 size={18} /> Discard
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center gap-8 mt-4 text-center">
          <div>
            <div className="text-2xl font-bold">{getRunningScore()}</div>
            <div className="text-xs text-white/60">Thru {currentHoleIndex}</div>
          </div>
          <div>
            <div className={`text-2xl font-bold ${getRunningScore() - getRunningPar() > 0 ? 'text-red-400' : getRunningScore() - getRunningPar() < 0 ? 'text-green-400' : ''}`}>
              {getRunningScore() - getRunningPar() > 0 ? '+' : ''}{getRunningScore() - getRunningPar() || 'E'}
            </div>
            <div className="text-xs text-white/60">vs Par</div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-3">
        <button onClick={goToPrevHole} disabled={currentHoleIndex === 0} className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-30">
          <ChevronLeft size={28} />
        </button>
        
        <div className="text-center">
          <div className="text-3xl font-bold">Hole {hole.holeNumber}</div>
          <div className="flex items-center justify-center gap-3 mt-1 text-white/70">
            <span className="font-medium">Par {hole.par}</span>
            <span className="text-white/40">•</span>
            <span>{hole.distance} yds</span>
          </div>
          {currentHoleScore > 0 && (
            <div className={`text-sm mt-1 font-medium ${currentHoleScore < hole.par ? 'text-green-400' : currentHoleScore > hole.par ? 'text-red-400' : 'text-white/70'}`}>
              Score: {currentHoleScore} ({currentHoleScore - hole.par > 0 ? '+' : ''}{currentHoleScore - hole.par || 'E'})
            </div>
          )}
        </div>

        <button onClick={goToNextHole} disabled={currentHoleIndex === totalHoles - 1} className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-30">
          <ChevronRight size={28} />
        </button>
      </div>

      <div className="flex-1 px-4 overflow-auto">
        <div className="golf-card space-y-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Shot Log</h3>
            <div className={`text-sm font-medium ${getHoleSG() > 0 ? 'sg-positive' : getHoleSG() < 0 ? 'sg-negative' : 'sg-neutral'}`}>
              SG: {getHoleSG() > 0 ? '+' : ''}{getHoleSG().toFixed(2)}
            </div>
          </div>

          {hole.teeShot && (
            <ShotRow label="Tee Shot" icon={<Flag size={16} />} detail={`${hole.teeShot.club} → ${hole.teeShot.driveDistance}yds (${hole.teeShot.lie})`} sg={hole.teeShot.sg} />
          )}

          {hole.approaches.map((app, i) => (
            <ShotRow key={`app-${i}`} label={`Approach ${i + 1}`} icon={<Target size={16} />} detail={`${app.startingDistance}yds → ${app.proximityFeet}ft ${app.onGreen ? '✓' : ''}`} sg={app.sg} />
          ))}

          {hole.shortGameShots.map((sg, i) => (
            <ShotRow key={`sg-${i}`} label={sg.shotType} icon={<Circle size={16} />} detail={`${sg.startingDistance}yds → ${sg.proximityFeet}ft`} sg={sg.sg} />
          ))}

          {hole.putts.map((putt, i) => (
            <ShotRow key={`putt-${i}`} label={`Putt ${putt.puttNumber}`} icon={<Circle size={14} className="fill-current" />} detail={`${putt.distanceFeet}ft ${putt.made ? '✓ Made' : `→ ${putt.remainingDistanceFeet}ft`}`} sg={putt.sg} />
          ))}

          {!hasShots && <div className="text-center py-6 text-white/40">No shots recorded yet</div>}
        </div>
      </div>

      <div className="p-4 space-y-3 safe-bottom">
        {hasShots && (
          <button onClick={clearLastShot} className="golf-btn golf-btn-secondary w-full text-sm py-2">
            <X size={16} /> Undo Last Shot
          </button>
        )}

        <div className="grid grid-cols-2 gap-3">
          {hole.par >= 4 && !hole.teeShot && (
            <button onClick={() => setShotMode('tee')} className="golf-btn"><Flag size={18} /> Tee Shot</button>
          )}
          <button onClick={() => setShotMode('approach')} className="golf-btn"><Target size={18} /> Approach</button>
          <button onClick={() => setShotMode('layup')} className="golf-btn golf-btn-secondary"><Target size={18} /> Layup</button>
          <button onClick={() => setShotMode('short')} className="golf-btn golf-btn-secondary"><Circle size={18} /> Chip/Pitch</button>
          <button onClick={() => setShotMode('putt')} className="golf-btn golf-btn-secondary"><Circle size={16} className="fill-current" /> Putt</button>
        </div>

        <div className="flex gap-3">
          {currentHoleIndex < totalHoles - 1 ? (
            <button onClick={goToNextHole} className="golf-btn w-full">Next Hole <ChevronRight size={20} /></button>
          ) : (
            <button onClick={() => setShowFinishModal(true)} className="golf-btn w-full bg-gradient-to-r from-amber-500 to-orange-500"><Check size={20} /> Finish Round</button>
          )}
        </div>
      </div>

      {showFinishModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="golf-card-elevated max-w-sm w-full animate-slide-up">
            <h2 className="text-xl font-bold mb-4">Finish Round</h2>
            
            <div className="bg-white/5 rounded-lg p-4 mb-4">
              <div className="text-sm text-white/60 mb-1">Calculated Score</div>
              <div className="text-3xl font-bold">{getCalculatedTotal()}</div>
              <div className="text-sm text-white/60">
                ({getCalculatedTotal() - activeRound.holes.reduce((s, h) => s + h.par, 0) > 0 ? '+' : ''}
                {getCalculatedTotal() - activeRound.holes.reduce((s, h) => s + h.par, 0)} vs Par {activeRound.holes.reduce((s, h) => s + h.par, 0)})
              </div>
            </div>

            <div className="mb-4">
              <label className="flex items-center gap-2 mb-2 cursor-pointer">
                <input type="checkbox" checked={useManualScore} onChange={(e) => setUseManualScore(e.target.checked)} className="w-4 h-4 rounded" />
                <span className="text-sm">Use different score</span>
              </label>
              
              {useManualScore && (
                <div className="flex items-center gap-2">
                  <Edit3 size={18} className="text-white/40" />
                  <input type="number" value={manualScore} onChange={(e) => setManualScore(e.target.value ? Number(e.target.value) : '')} placeholder="Enter actual score" className="golf-input flex-1" />
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowFinishModal(false)} className="golf-btn golf-btn-secondary flex-1">Cancel</button>
              <button onClick={handleFinishRound} className="golf-btn flex-1"><Check size={18} /> Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ShotRow({ label, icon, detail, sg }: { label: string; icon: React.ReactNode; detail: string; sg: number }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
      <div className="text-white/60">{icon}</div>
      <div className="flex-1">
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-white/60">{detail}</div>
      </div>
      <div className={`text-sm font-medium ${sg > 0 ? 'sg-positive' : sg < 0 ? 'sg-negative' : 'sg-neutral'}`}>
        {sg > 0 ? '+' : ''}{sg.toFixed(2)}
      </div>
    </div>
  );
}
