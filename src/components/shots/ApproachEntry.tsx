'use client';

import { useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { HoleData, ApproachData } from '@/lib/types';
import { calculateApproachSG } from '@/lib/sg-calculator';

interface ApproachEntryProps {
  hole: HoleData;
  onSave: (approach: ApproachData) => void;
  onCancel: () => void;
  isLayup?: boolean;
}

// All clubs available
const ALL_CLUBS = [
  'Dr', '3W', '7W',
  '3i', '4i', '5i', '6i', '7i', '8i', '9i',
  '46', '50', '54', '60', 'Putter'
];

const LIES = [
  { code: 'F', label: 'Fairway' },
  { code: 'R', label: 'Rough' },
  { code: 'HR', label: 'Heavy Rough' },
  { code: 'T', label: 'Trees' },
  { code: 'FB', label: 'Bunker' },
];

export default function ApproachEntry({ hole, onSave, onCancel, isLayup = false }: ApproachEntryProps) {
  const [distance, setDistance] = useState<number | ''>(
    hole.teeShot?.distanceRemaining || ''
  );
  const [lie, setLie] = useState('F');
  const [club, setClub] = useState('7i');
  const [onGreen, setOnGreen] = useState(isLayup ? false : true);
  const [proximity, setProximity] = useState<number | ''>('');

  const handleSave = () => {
    if (!distance || proximity === '') {
      alert('Please fill in all fields');
      return;
    }

    const result = calculateApproachSG(
      Number(distance),
      lie,
      Number(proximity),
      onGreen
    );

    const approach: ApproachData = {
      startingDistance: Number(distance),
      startingLie: lie,
      club,
      onGreen,
      proximityFeet: Number(proximity),
      startBenchmark: result.startBenchmark,
      endBenchmark: result.endBenchmark,
      sg: result.sg,
    };

    onSave(approach);
  };

  const previewSG = () => {
    if (!distance || proximity === '') return null;
    const result = calculateApproachSG(Number(distance), lie, Number(proximity), onGreen);
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
          <h1 className="text-xl font-bold">{isLayup ? 'Layup Shot' : 'Approach Shot'}</h1>
          <p className="text-white/60 text-sm">Hole {hole.holeNumber} • Par {hole.par}</p>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-5 overflow-auto">
        {/* Distance & Lie */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Distance (yds)</label>
            <input
              type="number"
              value={distance}
              onChange={(e) => setDistance(Number(e.target.value) || '')}
              placeholder="0"
              className="golf-input text-center text-xl"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Lie</label>
            <select
              value={lie}
              onChange={(e) => setLie(e.target.value)}
              className="golf-select"
            >
              {LIES.map((l) => (
                <option key={l.code} value={l.code}>{l.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Club Selection - All clubs */}
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

        {/* On Green Toggle */}
        <div>
          <label className="block text-sm font-medium mb-3">Result</label>
          <div className="flex gap-3">
            <button
              onClick={() => setOnGreen(true)}
              className={`flex-1 p-4 rounded-lg text-center transition-all ${
                onGreen ? 'bg-green-600 ring-2 ring-white' : 'bg-white/10'
              }`}
            >
              <div className="font-semibold">On Green</div>
              <div className="text-xs text-white/70">Hit the green</div>
            </button>
            <button
              onClick={() => setOnGreen(false)}
              className={`flex-1 p-4 rounded-lg text-center transition-all ${
                !onGreen ? 'bg-amber-600 ring-2 ring-white' : 'bg-white/10'
              }`}
            >
              <div className="font-semibold">Missed Green</div>
              <div className="text-xs text-white/70">Short/long/left/right</div>
            </button>
          </div>
        </div>

        {/* Proximity */}
        <div>
          <label className="block text-sm font-medium mb-2">
            {isLayup ? 'Distance Remaining (yards)' : onGreen ? 'Proximity to Hole (feet)' : 'Distance from Hole (feet)'}
          </label>
          <input
            type="number"
            value={proximity}
            onChange={(e) => setProximity(Number(e.target.value) || '')}
            placeholder="0"
            className="golf-input text-center text-xl"
          />
          <div className="flex justify-center gap-2 mt-2">
            {(isLayup ? [80, 100, 150] : [10, 20, 45]).map((ft) => (
              <button
                key={ft}
                onClick={() => setProximity(ft)}
                className="px-3 py-1 rounded-full bg-white/10 text-sm hover:bg-white/20"
              >
                {ft}ft
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
          Save Approach
        </button>
      </div>
    </div>
  );
}
