import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Crown, TrendingUp, Leaf, Shield, Users, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

const categoryConfig = {
  total: { label: 'Score Global', icon: Trophy, color: 'text-amber-400' },
  ecology: { label: 'Écologie', icon: Leaf, color: 'text-emerald-400' },
  autonomy: { label: 'Autonomie', icon: Shield, color: 'text-purple-400' },
  satisfaction: { label: 'Satisfaction', icon: Users, color: 'text-blue-400' }
};

export default function SimulationLeaderboard({ category = 'total', currentPlayerName, compact = false }) {
  const { data: scores = [], isLoading } = useQuery({
    queryKey: ['simulation-scores'],
    queryFn: () => base44.entities.SimulationScore.list('-total_score', 100)
  });

  // Sort by selected category
  const sortedScores = [...scores].sort((a, b) => {
    switch (category) {
      case 'ecology': return (b.ecology_score || 0) - (a.ecology_score || 0);
      case 'autonomy': return (b.autonomy_score || 0) - (a.autonomy_score || 0);
      case 'satisfaction': return (b.satisfaction_score || 0) - (a.satisfaction_score || 0);
      default: return (b.total_score || 0) - (a.total_score || 0);
    }
  });

  const displayScores = compact ? sortedScores.slice(0, 5) : sortedScores.slice(0, 20);
  const config = categoryConfig[category];
  const Icon = config.icon;

  // Find current player rank
  const currentPlayerRank = sortedScores.findIndex(s => s.player_name === currentPlayerName) + 1;

  if (isLoading) {
    return (
      <div className="bg-slate-800/50 rounded-2xl p-6 border border-white/10 animate-pulse">
        <div className="h-8 bg-slate-700 rounded w-1/3 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-12 bg-slate-700 rounded" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 rounded-2xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-white flex items-center gap-2">
          <Icon className={`w-5 h-5 ${config.color}`} />
          Classement {config.label}
        </h3>
        {currentPlayerRank > 0 && (
          <span className="text-sm text-slate-400">
            Votre rang: <span className={config.color}>#{currentPlayerRank}</span>
          </span>
        )}
      </div>

      {displayScores.length === 0 ? (
        <p className="text-slate-400 text-center py-4">Aucun score enregistré</p>
      ) : (
        <div className="space-y-2">
          {displayScores.map((score, index) => {
            const rank = index + 1;
            const isCurrentPlayer = score.player_name === currentPlayerName;
            const value = category === 'total' ? score.total_score : score[`${category}_score`];

            return (
              <motion.div
                key={score.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                  isCurrentPlayer 
                    ? 'bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-500/30' 
                    : 'bg-slate-700/30 hover:bg-slate-700/50'
                }`}
              >
                {/* Rank */}
                <div className="w-8 h-8 flex items-center justify-center">
                  {rank === 1 ? (
                    <Crown className="w-6 h-6 text-amber-400" />
                  ) : rank === 2 ? (
                    <Medal className="w-5 h-5 text-slate-300" />
                  ) : rank === 3 ? (
                    <Medal className="w-5 h-5 text-amber-600" />
                  ) : (
                    <span className="text-slate-400 font-mono">#{rank}</span>
                  )}
                </div>

                {/* Player info */}
                <div className="flex-1 min-w-0">
                  <p className={`font-medium truncate ${isCurrentPlayer ? 'text-emerald-400' : 'text-white'}`}>
                    {score.player_name}
                    {isCurrentPlayer && <span className="text-xs ml-2">(vous)</span>}
                  </p>
                  {!compact && (
                    <p className="text-xs text-slate-400">
                      {score.scenarios_completed || 5} scénarios • {Math.round((score.play_duration || 300) / 60)}min
                    </p>
                  )}
                </div>

                {/* Score */}
                <div className="text-right">
                  <p className={`font-bold ${config.color}`}>{value || 0}%</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}