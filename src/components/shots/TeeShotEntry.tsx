'use client';

import { useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { HoleData, TeeShotData } from '@/lib/types';
import { calculateTeeShotSG } from '@/lib/sg-calculator';

interface TeeShotEntryProps {
  hole: HoleData;
  onSave: (teeShot: TeeShotData) => void;
  onCancel: () => void;
}

// All clubs available for any shot
const ALL_CLUBS = [
  'Dr', '3W', '7W',
  '3i', '4i', '5i', '6i', '7i', '8i', '9i',
  '46', '50', '54', '60', 'Putter'
];

const LIES = [
  { code: 'F', label: 'Fairway', color: 'bg-green-600' },
  { code: 'RL', label: 'Rough L', color: 'bg-green-800' },
  { code: 'RR', label: 'Rough R', color: 'bg-green-800' },
  { code: 'LR', label: 'Light Rough', color: 'bg-green-700' },
  { code: 'TL', label: 'Trees L', color: 'bg-amber-800' },
  { code: 'TR', label: 'Trees R', color: 'bg-amber-800' },
  { code: 'BL', label: 'Bunker L', color: 'bg-yellow-600' },
  { code: 'BR', label: 'Bunker R', color: 'bg-yellow-600' },
  { code: 'P', label: 'Penalty', color: 'bg-red-600' },
];

export default function TeeShotEntry({ hole, onSave, onCancel }: TeeShotEntryProps) {
  const [club, setClub] = useState('Dr');
  const [driveDistance, setDriveDistance] = useState<number | ''>('');
  const [distanceRemaining, setDistanceRemaining] = useState<number | ''>('');
  const [lie, setLie] = useState('F');

  const isPenalty = lie === 'P';

  const handleSave = () => {
    if (!driveDistance && distanceRemaining === '') {
      alert('Please enter drive distance or remaining distance');
      return;
    }

    // Calculate the other value if only one is provided
    let finalDriveDistance = Number(driveDistance) || 0;
    let finalRemaining = Number(distanceRemaining) || 0;

    if (!driveDistance && distanceRemaining) {
      finalDriveDistance = hole.distance - finalRemaining;
    }
    if (!distanceRemaining && driveDistance) {
      finalRemaining = hole.distance - finalDriveDistance;
    }

    const result = calculateTeeShotSG(
      hole.distance,
      hole.par,
      finalRemaining,
      lie,
      isPenalty
    );

    const teeShot: TeeShotData = {
      club,
      driveDistance: finalDriveDistance,
      distanceRemaining: finalRemaining,
      lie,
      isPenalty,
      startBenchmark: result.startBenchmark,
      endBenchmark: result.endBenchmark,
      sg: result.sg,
    };

    onSave(teeShot);
  };

  // Preview SG calculation
  const previewSG = () => {
    if (!driveDistance && distanceRemaining === '') return null;
    
    let remaining = Number(distanceRemaining) || 0;
    if (!distanceRemaining && driveDistance) {
      remaining = hole.distance - Number(driveDistance);
    }
    
    const result = calculateTeeShotSG(
      hole.distance,
      hole.par,
      remaining,
      lie,
      isPenalty
    );
    return result.sg;
  };

  const sgPreview = previewSG();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center gap-4">
        <button onClick={onCancel} className="p-2 -ml-2 rounded-lg hover:bg-white/10">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-xl font-bold">Tee Shot</h1>
          <p className="text-white/60 text-sm">Hole {hole.holeNumber} • Par {hole.par} • {hole.distance} yds</p>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-5 overflow-auto">
        {/* Club Selection - Scrollable */}
        <div>
          <label className="block text-sm font-medium mb-3">Club</label>
          <div className="flex flex-wrap gap-2">
            {ALL_CLUBS.map((c) => (
              <button
                key={c}
                onClick={() => setClub(c)}
                className={`golf-chip ${club === c ? 'golf-chip-selected' : ''}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Distance - Independent Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Drive Distance</label>
            <div className="relative">
              <input
                type="number"
                value={driveDistance}
                onChange={(e) => setDriveDistance(e.target.value ? Number(e.target.value) : '')}
                placeholder="0"
                className="golf-input text-center text-xl pr-12"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40">yds</span>
            </div>
            <div className="flex justify-center gap-1 mt-2">
              {[220, 275, 300].map((d) => (
                <button
                  key={d}
                  onClick={() => setDriveDistance(d)}
                  className="px-2 py-1 rounded-full bg-white/10 text-xs hover:bg-white/20"
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Remaining</label>
            <div className="relative">
              <input
                type="number"
                value={distanceRemaining}
                onChange={(e) => setDistanceRemaining(e.target.value ? Number(e.target.value) : '')}
                placeholder="0"
                className="golf-input text-center text-xl pr-12"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40">yds</span>
            </div>
            <div className="flex justify-center gap-1 mt-2">
              {[80, 100, 150].map((d) => (
                <button
                  key={d}
                  onClick={() => setDistanceRemaining(d)}
                  className="px-2 py-1 rounded-full bg-white/10 text-xs hover:bg-white/20"
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Note about independent fields */}
        <p className="text-xs text-white/50 text-center">
          Enter drive distance OR remaining distance (or both if they don't add up to hole distance)
        </p>

        {/* Lie Selection */}
        <div>
          <label className="block text-sm font-medium mb-3">Lie / Result</label>
          <div className="grid grid-cols-3 gap-2">
            {LIES.map((l) => (
              <button
                key={l.code}
                onClick={() => setLie(l.code)}
                className={`p-3 rounded-lg text-sm font-medium transition-all ${
                  lie === l.code 
                    ? `${l.color} ring-2 ring-white` 
                    : 'bg-white/10 hover:bg-white/15'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* SG Preview */}
        {sgPreview !== null && (
          <div className="golf-card text-center">
            <div className="text-sm text-white/60 mb-1">Strokes Gained</div>
            <div className={`text-3xl font-bold ${sgPreview > 0 ? 'sg-positive' : sgPreview < 0 ? 'sg-negative' : 'sg-neutral'}`}>
              {sgPreview > 0 ? '+' : ''}{sgPreview.toFixed(2)}
            </div>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="p-4 safe-bottom">
        <button onClick={handleSave} className="golf-btn w-full">
          <Check size={20} />
          Save Tee Shot
        </button>
      </div>
    </div>
  );
}
