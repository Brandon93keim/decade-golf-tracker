'use client';

import { useState } from 'react';
import { Trash2, ChevronRight, TrendingUp, TrendingDown, Filter } from 'lucide-react';
import { Round } from '@/lib/types';

interface RoundHistoryProps {
  rounds: Round[];
  onDeleteRound: (id: string) => void;
}

export default function RoundHistory({ rounds, onDeleteRound }: RoundHistoryProps) {
  const [expandedRound, setExpandedRound] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getSgColor = (sg: number) => {
    if (sg > 0) return 'sg-positive';
    if (sg < 0) return 'sg-negative';
    return 'sg-neutral';
  };

  const formatSg = (sg: number) => {
    const prefix = sg > 0 ? '+' : '';
    return prefix + sg.toFixed(2);
  };

  const handleDelete = (id: string) => {
    onDeleteRound(id);
    setConfirmDelete(null);
  };

  if (rounds.length === 0) {
    return (
      <div className="p-4 pt-6">
        <h1 className="text-2xl font-bold mb-6">Round History</h1>
        <div className="golf-card text-center py-12">
          <p className="text-white/60">No rounds recorded yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pt-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Round History</h1>
        <div className="text-sm text-white/60">{rounds.length} rounds</div>
      </div>

      <div className="space-y-3">
        {rounds.map((round, index) => (
          <div key={round.id} className="golf-card">
            {/* Main Row */}
            <button
              onClick={() => setExpandedRound(expandedRound === round.id ? null : round.id)}
              className="w-full flex items-center justify-between"
            >
              <div className="text-left">
                <div className="font-semibold">{round.courseName}</div>
                <div className="text-sm text-white/60">
                  {formatDate(round.date)}
                  {round.teeBoxName && ` • ${round.teeBoxName}`}
                  {round.isNineHole && ` • ${round.nineHoleType === 'front' ? 'Front' : 'Back'} 9`}
                </div>
                {round.courseRating && (
                  <div className="text-xs text-white/40">
                    {round.courseRating}/{round.courseSlope}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-xl font-bold">{round.score}</div>
                  <div className={`text-sm ${getSgColor(round.sgTotal)}`}>
                    {formatSg(round.sgTotal)}
                  </div>
                </div>
                <ChevronRight 
                  size={20} 
                  className={`text-white/40 transition-transform ${expandedRound === round.id ? 'rotate-90' : ''}`}
                />
              </div>
            </button>

            {/* Expanded Details */}
            {expandedRound === round.id && (
              <div className="mt-4 pt-4 border-t border-white/10 animate-fade-in">
                {/* SG Breakdown */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                  <div className="text-center">
                    <div className={`font-semibold ${getSgColor(round.sgOTT)}`}>
                      {formatSg(round.sgOTT)}
                    </div>
                    <div className="text-xs text-white/50">OTT</div>
                  </div>
                  <div className="text-center">
                    <div className={`font-semibold ${getSgColor(round.sgAPP)}`}>
                      {formatSg(round.sgAPP)}
                    </div>
                    <div className="text-xs text-white/50">APP</div>
                  </div>
                  <div className="text-center">
                    <div className={`font-semibold ${getSgColor(round.sgARG)}`}>
                      {formatSg(round.sgARG)}
                    </div>
                    <div className="text-xs text-white/50">ARG</div>
                  </div>
                  <div className="text-center">
                    <div className={`font-semibold ${getSgColor(round.sgPUTT)}`}>
                      {formatSg(round.sgPUTT)}
                    </div>
                    <div className="text-xs text-white/50">PUTT</div>
                  </div>
                </div>

                {/* Traditional Stats */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                  <div className="text-center">
                    <div className="font-semibold">{Math.round(round.firPct * 100)}%</div>
                    <div className="text-xs text-white/50">FIR</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">{Math.round(round.girPct * 100)}%</div>
                    <div className="text-xs text-white/50">GIR</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">{round.totalPutts}</div>
                    <div className="text-xs text-white/50">Putts</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">{round.penalties}</div>
                    <div className="text-xs text-white/50">Pen</div>
                  </div>
                </div>

                {/* vs Par */}
                <div className="flex justify-between items-center mb-4 p-3 rounded-lg bg-white/5">
                  <span className="text-white/60">vs Par</span>
                  <span className={`font-bold ${round.score - round.par > 0 ? 'text-red-400' : round.score - round.par < 0 ? 'text-green-400' : ''}`}>
                    {round.score - round.par > 0 ? '+' : ''}{round.score - round.par || 'E'}
                  </span>
                </div>

                {/* Trend Indicator */}
                {index > 0 && (
                  <div className="flex items-center gap-2 text-sm mb-4">
                    {round.sgTotal > rounds[index - 1].sgTotal ? (
                      <>
                        <TrendingUp size={16} className="text-green-400" />
                        <span className="text-green-400">
                          Improved {(round.sgTotal - rounds[index - 1].sgTotal).toFixed(2)} SG from previous
                        </span>
                      </>
                    ) : round.sgTotal < rounds[index - 1].sgTotal ? (
                      <>
                        <TrendingDown size={16} className="text-red-400" />
                        <span className="text-red-400">
                          {(rounds[index - 1].sgTotal - round.sgTotal).toFixed(2)} SG below previous
                        </span>
                      </>
                    ) : null}
                  </div>
                )}

                {/* Delete Button */}
                {confirmDelete === round.id ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(round.id)}
                      className="golf-btn golf-btn-danger flex-1"
                    >
                      Confirm Delete
                    </button>
                    <button
                      onClick={() => setConfirmDelete(null)}
                      className="golf-btn golf-btn-secondary flex-1"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDelete(round.id)}
                    className="flex items-center justify-center gap-2 w-full py-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                    Delete Round
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
