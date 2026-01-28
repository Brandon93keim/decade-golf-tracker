'use client';

import { useMemo } from 'react';
import { Round } from '@/lib/types';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Flag, 
  Circle,
  PlayCircle,
  RefreshCw
} from 'lucide-react';

interface DashboardProps {
  rounds: Round[];
  onStartRound: () => void;
  hasActiveRound: boolean;
  onResumeRound: () => void;
}

export default function Dashboard({ rounds, onStartRound, hasActiveRound, onResumeRound }: DashboardProps) {
  const stats = useMemo(() => {
    if (rounds.length === 0) return null;
    
    const last10 = rounds.slice(0, 10);
    const last5 = rounds.slice(0, 5);
    
    return {
      roundsPlayed: rounds.length,
      avgScore: Math.round(last10.reduce((sum, r) => sum + (r.score - r.par), 0) / last10.length * 10) / 10,
      avgSgTotal: Math.round(last10.reduce((sum, r) => sum + r.sgTotal, 0) / last10.length * 100) / 100,
      avgSgOTT: Math.round(last10.reduce((sum, r) => sum + r.sgOTT, 0) / last10.length * 100) / 100,
      avgSgAPP: Math.round(last10.reduce((sum, r) => sum + r.sgAPP, 0) / last10.length * 100) / 100,
      avgSgARG: Math.round(last10.reduce((sum, r) => sum + r.sgARG, 0) / last10.length * 100) / 100,
      avgSgPUTT: Math.round(last10.reduce((sum, r) => sum + r.sgPUTT, 0) / last10.length * 100) / 100,
      avgFIR: Math.round(last10.reduce((sum, r) => sum + (r.firPct || 0), 0) / last10.length * 100),
      avgGIR: Math.round(last10.reduce((sum, r) => sum + (r.girPct || 0), 0) / last10.length * 100),
      avgPutts: Math.round(last10.reduce((sum, r) => sum + r.totalPutts, 0) / last10.length * 10) / 10,
      lowRound: Math.min(...rounds.map(r => r.score)),
      bestSg: Math.max(...rounds.map(r => r.sgTotal)),
      // Trends (comparing last 5 to previous 5)
      scoreTrend: last5.length >= 5 && rounds.length >= 10 
        ? (last5.reduce((s, r) => s + r.score, 0) / 5) - (rounds.slice(5, 10).reduce((s, r) => s + r.score, 0) / 5)
        : 0,
    };
  }, [rounds]);

  const getSgColor = (sg: number) => {
    if (sg > 0) return 'sg-positive';
    if (sg < 0) return 'sg-negative';
    return 'sg-neutral';
  };

  const formatSg = (sg: number) => {
    const prefix = sg > 0 ? '+' : '';
    return prefix + sg.toFixed(2);
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="pt-2">
        <h1 className="text-2xl font-bold">Decade Golf</h1>
        <p className="text-white/60 text-sm">Strokes Gained Tracker</p>
      </div>

      {/* Quick Actions */}
      {hasActiveRound ? (
        <button 
          onClick={onResumeRound}
          className="golf-btn w-full bg-gradient-to-r from-amber-500 to-orange-500"
        >
          <RefreshCw size={20} />
          Resume Round in Progress
        </button>
      ) : (
        <button 
          onClick={onStartRound}
          className="golf-btn w-full"
        >
          <PlayCircle size={20} />
          Start New Round
        </button>
      )}

      {!stats ? (
        // Empty State
        <div className="golf-card text-center py-12">
          <Flag size={48} className="mx-auto text-white/30 mb-4" />
          <h2 className="text-lg font-semibold mb-2">No Rounds Yet</h2>
          <p className="text-white/60 text-sm">
            Start tracking your rounds to see your strokes gained analysis
          </p>
        </div>
      ) : (
        <>
          {/* Main Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="stat-card">
              <div className={`stat-value ${stats.avgScore > 0 ? 'text-red-400' : stats.avgScore < 0 ? 'text-green-400' : ''}`}>
                {stats.avgScore > 0 ? '+' : ''}{stats.avgScore}
              </div>
              <div className="stat-label">Avg vs Par</div>
            </div>
            <div className="stat-card">
              <div className={`stat-value ${getSgColor(stats.avgSgTotal)}`}>
                {formatSg(stats.avgSgTotal)}
              </div>
              <div className="stat-label">Total SG</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.avgFIR}%</div>
              <div className="stat-label">FIR</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.avgGIR}%</div>
              <div className="stat-label">GIR</div>
            </div>
          </div>

          {/* SG Breakdown */}
          <div className="golf-card">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Target size={18} />
              Strokes Gained Breakdown
            </h3>
            <div className="space-y-3">
              <SGBar label="Off the Tee" value={stats.avgSgOTT} />
              <SGBar label="Approach" value={stats.avgSgAPP} />
              <SGBar label="Around Green" value={stats.avgSgARG} />
              <SGBar label="Putting" value={stats.avgSgPUTT} />
            </div>
          </div>

          {/* Records */}
          <div className="golf-card">
            <h3 className="font-semibold mb-4">Personal Bests</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-2xl font-bold text-green-400">{stats.lowRound}</div>
                <div className="text-xs text-white/60">Low Round</div>
              </div>
              <div>
                <div className={`text-2xl font-bold ${getSgColor(stats.bestSg)}`}>
                  {formatSg(stats.bestSg)}
                </div>
                <div className="text-xs text-white/60">Best SG</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.avgPutts}</div>
                <div className="text-xs text-white/60">Avg Putts</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.roundsPlayed}</div>
                <div className="text-xs text-white/60">Rounds</div>
              </div>
            </div>
          </div>

          {/* Recent Rounds Preview */}
          <div className="golf-card">
            <h3 className="font-semibold mb-3">Recent Rounds</h3>
            <div className="space-y-2">
              {rounds.slice(0, 3).map((round) => (
                <div key={round.id} className="flex items-center justify-between py-2 border-b border-white/10 last:border-0">
                  <div>
                    <div className="font-medium">{round.courseId}</div>
                    <div className="text-xs text-white/60">
                      {new Date(round.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{round.score}</div>
                    <div className={`text-xs ${getSgColor(round.sgTotal)}`}>
                      {formatSg(round.sgTotal)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// SG Bar Component
function SGBar({ label, value }: { label: string; value: number }) {
  const maxWidth = 100;
  const absValue = Math.abs(value);
  const width = Math.min(absValue * 20, maxWidth); // Scale: 5 SG = full bar
  const isPositive = value >= 0;
  
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-white/80">{label}</span>
        <span className={value > 0 ? 'sg-positive' : value < 0 ? 'sg-negative' : 'sg-neutral'}>
          {value > 0 ? '+' : ''}{value.toFixed(2)}
        </span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden relative">
        <div 
          className={`h-full rounded-full transition-all duration-500 ${
            isPositive ? 'bg-green-500 ml-1/2' : 'bg-red-400'
          }`}
          style={{ 
            width: `${width}%`,
            marginLeft: isPositive ? '50%' : `${50 - width}%`
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-px h-full bg-white/30" />
        </div>
      </div>
    </div>
  );
}
