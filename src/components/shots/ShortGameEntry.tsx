'use client';

import { useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { HoleData, ShortGameData } from '@/lib/types';
import { calculateShortGameSG } from '@/lib/sg-calculator';

interface ShortGameEntryProps {
  hole: HoleData;
  onSave: (shortGame: ShortGameData) => void;
  onCancel: () => void;
}

const SHOT_TYPES = ['Chip', 'Pitch', 'Flop', 'Bunker'] as const;

const LIES = [
  { code: 'GF', label: 'Fringe', desc: 'Could putt' },
  { code: 'FR', label: 'Fairway', desc: 'Tight lie' },
  { code: 'R', label: 'Rough', desc: 'Around green' },
  { code: 'HR', label: 'Heavy Rough', desc: 'Deep/buried' },
  { code: 'GBS', label: 'Greenside Bunker', desc: 'Sand' },
  { code: 'FBS', label: 'Fairway Bunker', desc: 'Close to green' },
];

// All clubs available
const ALL_CLUBS = [
  'Dr', '3W', '7W',
  '3i', '4i', '5i', '6i', '7i', '8i', '9i',
  '46', '50', '54', '60', 'Putter'
];

export default function ShortGameEntry({ hole, onSave, onCancel }: ShortGameEntryProps) {
  const [distance, setDistance] = useState<number | ''>('');
  const [lie, setLie] = useState('FR');
  const [shotType, setShotType] = useState<typeof SHOT_TYPES[number]>('Chip');
  const [club, setClub] = useState('60');
  const [proximity, setProximity] = useState<number | ''>('');

  const handleSave = () => {
    if (!distance || proximity === '') {
      alert('Please fill in all fields');
      return;
    }

    const result = calculateShortGameSG(
      Number(distance),
      lie,
      Number(proximity)
    );

    const shortGame: ShortGameData = {
      startingDistance: Number(distance),
      startingLie: lie,
      shotType,
      club,
      proximityFeet: Number(proximity),
      startBenchmark: result.startBenchmark,
      endBenchmark: result.endBenchmark,
      sg: result.sg,
    };

    onSave(shortGame);
  };

  const previewSG = () => {
    if (!distance || proximity === '') return null;
    const result = calculateShortGameSG(Number(distance), lie, Number(proximity));
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
          <h1 className="text-xl font-bold">Short Game</h1>
          <p className="text-white/60 text-sm">Hole {hole.holeNumber} • Par {hole.par}</p>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-5 overflow-auto">
        {/* Shot Type */}
        <div>
          <label className="block text-sm font-medium mb-3">Shot Type</label>
          <div className="flex gap-2">
            {SHOT_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setShotType(type)}
                className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                  shotType === type ? 'bg-green-600 ring-2 ring-white' : 'bg-white/10'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Distance */}
        <div>
          <label className="block text-sm font-medium mb-2">Distance (yds)</label>
          <input
            type="number"
            value={distance}
            onChange={(e) => setDistance(Number(e.target.value) || '')}
            placeholder="0"
            className="golf-input text-center text-xl"
          />
          <div className="flex justify-center gap-2 mt-2">
            {[5, 10, 20, 50].map((yds) => (
              <button
                key={yds}
                onClick={() => setDistance(yds)}
                className="px-2 py-1 rounded-full bg-white/10 text-xs hover:bg-white/20"
              >
                {yds}
              </button>
            ))}
          </div>
        </div>

        {/* Lie Selection */}
        <div>
          <label className="block text-sm font-medium mb-3">Lie</label>
          <div className="grid grid-cols-2 gap-2">
            {LIES.map((l) => (
              <button
                key={l.code}
                onClick={() => setLie(l.code)}
                className={`p-3 rounded-lg text-left transition-all ${
                  lie === l.code ? 'bg-green-600 ring-2 ring-white' : 'bg-white/10'
                }`}
              >
                <div className="font-medium text-sm">{l.label}</div>
                <div className="text-xs text-white/60">{l.desc}</div>
              </button>
            ))}
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

        {/* Proximity */}
        <div>
          <label className="block text-sm font-medium mb-2">Proximity to Hole (feet)</label>
          <input
            type="number"
            value={proximity}
            onChange={(e) => setProximity(Number(e.target.value) || '')}
            placeholder="0"
            className="golf-input text-center text-xl"
          />
          <div className="flex justify-center gap-2 mt-2">
            {[0, 1, 2, 3, 4, 10].map((ft) => (
              <button
                key={ft}
                onClick={() => setProximity(ft)}
                className={`px-3 py-1 rounded-full text-sm hover:bg-white/20 ${
                  ft === 0 ? 'bg-green-600' : 'bg-white/10'
                }`}
              >
                {ft === 0 ? 'Holed!' : `${ft}ft`}
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
          Save Shot
        </button>
      </div>
    </div>
  );
}
