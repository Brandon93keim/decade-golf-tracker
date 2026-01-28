'use client';

import { useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { HoleData, PuttData } from '@/lib/types';
import { calculatePuttSG } from '@/lib/sg-calculator';

interface PuttEntryProps {
  hole: HoleData;
  puttNumber: number;
  onSave: (putt: PuttData) => void;
  onCancel: () => void;
}

const BREAKS = [
  { code: 'RL', label: 'Right to Left' },
  { code: 'LR', label: 'Left to Right' },
  { code: 'S', label: 'Straight' },
];

const SLOPES = [
  { code: 'U', label: 'Uphill' },
  { code: 'D', label: 'Downhill' },
  { code: 'F', label: 'Flat' },
];

export default function PuttEntry({ hole, puttNumber, onSave, onCancel }: PuttEntryProps) {
  const [distance, setDistance] = useState<number | ''>('');
  const [made, setMade] = useState(false);
  const [remainingDistance, setRemainingDistance] = useState<number | ''>(2);
  const [breakDir, setBreakDir] = useState('S');
  const [slope, setSlope] = useState('F');
  const [greenSpeed, setGreenSpeed] = useState(10);

  const handleSave = () => {
    if (!distance) {
      alert('Please enter putt distance');
      return;
    }

    const result = calculatePuttSG(
      Number(distance),
      made,
      made ? undefined : Number(remainingDistance) || 2
    );

    const putt: PuttData = {
      puttNumber,
      distanceFeet: Number(distance),
      made,
      remainingDistanceFeet: made ? undefined : Number(remainingDistance) || 2,
      break: breakDir,
      slope,
      greenSpeed,
      startBenchmark: result.startBenchmark,
      endBenchmark: result.endBenchmark,
      sg: result.sg,
    };

    onSave(putt);
  };

  const previewSG = () => {
    if (!distance) return null;
    const result = calculatePuttSG(
      Number(distance),
      made,
      made ? undefined : Number(remainingDistance) || 2
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
          <h1 className="text-xl font-bold">Putt #{puttNumber}</h1>
          <p className="text-white/60 text-sm">Hole {hole.holeNumber}</p>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-5 overflow-auto">
        {/* Distance */}
        <div>
          <label className="block text-sm font-medium mb-2">Putt Distance (feet)</label>
          <input
            type="number"
            value={distance}
            onChange={(e) => setDistance(Number(e.target.value) || '')}
            placeholder="0"
            className="golf-input text-center text-2xl"
          />
          <div className="flex justify-center flex-wrap gap-2 mt-3">
            {[3, 5, 10, 20, 50].map((ft) => (
              <button
                key={ft}
                onClick={() => setDistance(ft)}
                className="px-3 py-2 rounded-lg bg-white/10 text-sm hover:bg-white/20"
              >
                {ft}ft
              </button>
            ))}
          </div>
        </div>

        {/* Made/Missed */}
        <div>
          <label className="block text-sm font-medium mb-3">Result</label>
          <div className="flex gap-3">
            <button
              onClick={() => setMade(true)}
              className={`flex-1 p-4 rounded-lg text-center transition-all ${
                made ? 'bg-green-600 ring-2 ring-white' : 'bg-white/10'
              }`}
            >
              <div className="text-2xl mb-1">✓</div>
              <div className="font-semibold">Made</div>
            </button>
            <button
              onClick={() => setMade(false)}
              className={`flex-1 p-4 rounded-lg text-center transition-all ${
                !made ? 'bg-amber-600 ring-2 ring-white' : 'bg-white/10'
              }`}
            >
              <div className="text-2xl mb-1">○</div>
              <div className="font-semibold">Missed</div>
            </button>
          </div>
        </div>

        {/* Remaining Distance (if missed) */}
        {!made && (
          <div>
            <label className="block text-sm font-medium mb-2">Remaining Distance (feet)</label>
            <input
              type="number"
              value={remainingDistance}
              onChange={(e) => setRemainingDistance(Number(e.target.value) || '')}
              placeholder="2"
              className="golf-input text-center text-xl"
            />
            <div className="flex justify-center gap-2 mt-2">
              {[1, 2, 3, 4, 10].map((ft) => (
                <button
                  key={ft}
                  onClick={() => setRemainingDistance(ft)}
                  className="px-3 py-1 rounded-full bg-white/10 text-sm hover:bg-white/20"
                >
                  {ft}ft
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Break & Slope */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Break</label>
            <div className="space-y-2">
              {BREAKS.map((b) => (
                <button
                  key={b.code}
                  onClick={() => setBreakDir(b.code)}
                  className={`w-full p-2 rounded-lg text-sm transition-all ${
                    breakDir === b.code ? 'bg-green-600' : 'bg-white/10'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Slope</label>
            <div className="space-y-2">
              {SLOPES.map((s) => (
                <button
                  key={s.code}
                  onClick={() => setSlope(s.code)}
                  className={`w-full p-2 rounded-lg text-sm transition-all ${
                    slope === s.code ? 'bg-green-600' : 'bg-white/10'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SG Preview */}
        {sgPreview !== null && (
          <div className="golf-card text-center">
            <div className="text-sm text-white/60 mb-1">Strokes Gained</div>
            <div className={`text-3xl font-bold ${sgPreview > 0 ? 'sg-positive' : sgPreview < 0 ? 'sg-negative' : 'sg-neutral'}`}>
              {sgPreview > 0 ? '+' : ''}{sgPreview.toFixed(2)}
            </div>
            {made && Number(distance) > 10 && (
              <div className="text-xs text-green-400 mt-1">
                Great putt! Tour make rate from {distance}ft: ~{Math.round((1 - (Number(distance) * 0.03)) * 100)}%
              </div>
            )}
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="p-4 safe-bottom">
        <button onClick={handleSave} className="golf-btn w-full">
          <Check size={20} />
          Save Putt
        </button>
      </div>
    </div>
  );
}
