import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, TrendingUp, Users, Clock, Target, Leaf, Shield, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

const scoreIcons = {
  budget: DollarSign,
  satisfaction: Users,
  autonomy: Shield,
  ecology: Leaf,
  risk: Target
};

const scoreLabels = {
  budget: 'Budget',
  satisfaction: 'Satisfaction',
  autonomy: 'Autonomie',
  ecology: 'Écologie',
  risk: 'Sécurité'
};

export default function MultiplayerResults({ sessionId, mode, playerName, onPlayAgain, onExit }) {
  const { data: results = [], isLoading } = useQuery({
    queryKey: ['player-results', sessionId],
    queryFn: () => base44.entities.PlayerResult.filter({ session_id: sessionId }, '-total_score'),
    refetchInterval: mode === 'competition' ? 3000 : false
  });

  const sortedResults = [...results].sort((a, b) => (b.total_score || 0) - (a.total_score || 0));
  const winner = sortedResults[0];
  const currentPlayerResult = results.find(r => r.player_name === playerName);
  const currentRank = sortedResults.findIndex(r => r.player_name === playerName) + 1;

  // Collaboration mode: calculate team averages
  const teamAverages = mode === 'collaboration' && results.length > 0 ? {
    budget: Math.round(results.reduce((sum, r) => sum + (r.scores?.budget || 0), 0) / results.length),
    satisfaction: Math.round(results.reduce((sum, r) => sum + (r.scores?.satisfaction || 0), 0) / results.length),
    autonomy: Math.round(results.reduce((sum, r) => sum + (r.scores?.autonomy || 0), 0) / results.length),
    ecology: Math.round(results.reduce((sum, r) => sum + (r.scores?.ecology || 0), 0) / results.length),
    risk: Math.round(results.reduce((sum, r) => sum + (r.scores?.risk || 0), 0) / results.length)
  } : null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-8">
        {mode === 'competition' ? (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center"
            >
              <Trophy className="w-12 h-12 text-white" />
            </motion.div>
            <h2 className="text-3xl font-bold text-white mb-2">
              {winner?.player_name === playerName ? '🎉 Victoire !' : 'Résultats'}
            </h2>
            <p className="text-slate-400">
              {winner?.player_name} remporte la partie avec {winner?.total_score} points !
            </p>
          </>
        ) : (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center"
            >
              <Users className="w-12 h-12 text-white" />
            </motion.div>
            <h2 className="text-3xl font-bold text-white mb-2">Résultats d'équipe</h2>
            <p className="text-slate-400">
              Performance collective de votre équipe
            </p>
          </>
        )}
      </div>

      {/* Competition Leaderboard */}
      {mode === 'competition' && (
        <div className="bg-slate-800/50 rounded-2xl border border-white/10 p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Medal className="w-5 h-5 text-amber-400" />
            Classement
          </h3>
          <div className="space-y-3">
            {sortedResults.map((result, idx) => {
              const isCurrentPlayer = result.player_name === playerName;
              const rankColors = ['from-amber-400 to-orange-500', 'from-slate-300 to-slate-400', 'from-amber-600 to-amber-700'];
              
              return (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`flex items-center gap-4 p-4 rounded-xl ${
                    isCurrentPlayer ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-slate-700/50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${rankColors[idx] || 'from-slate-600 to-slate-700'} flex items-center justify-center text-white font-bold`}>
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{result.player_name}</span>
                      {isCurrentPlayer && <span className="text-xs text-emerald-400">(vous)</span>}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {Math.floor((result.completion_time || 0) / 60)}min
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">{result.total_score || 0}</div>
                    <div className="text-xs text-slate-400">points</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Collaboration Team Stats */}
      {mode === 'collaboration' && teamAverages && (
        <div className="bg-slate-800/50 rounded-2xl border border-white/10 p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Performance d'équipe</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(teamAverages).map(([key, value]) => {
              const Icon = scoreIcons[key];
              const isGood = key === 'risk' ? value < 50 : value > 50;
              return (
                <div key={key} className="text-center">
                  <div className={`w-12 h-12 mx-auto rounded-xl ${isGood ? 'bg-emerald-500/20' : 'bg-red-500/20'} flex items-center justify-center mb-2`}>
                    <Icon className={`w-6 h-6 ${isGood ? 'text-emerald-400' : 'text-red-400'}`} />
                  </div>
                  <div className={`text-xl font-bold ${isGood ? 'text-emerald-400' : 'text-red-400'}`}>{value}%</div>
                  <div className="text-xs text-slate-400">{scoreLabels[key]}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Individual Score Details */}
      {currentPlayerResult?.scores && (
        <div className="bg-slate-800/50 rounded-2xl border border-white/10 p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Vos scores détaillés</h3>
          <div className="space-y-3">
            {Object.entries(currentPlayerResult.scores).map(([key, value]) => {
              const Icon = scoreIcons[key];
              const isGood = key === 'risk' ? value < 50 : value > 50;
              return (
                <div key={key} className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isGood ? 'text-emerald-400' : 'text-red-400'}`} />
                  <span className="text-slate-300 flex-1">{scoreLabels[key]}</span>
                  <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${value}%` }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      className={`h-full rounded-full ${isGood ? 'bg-emerald-500' : 'bg-red-500'}`}
                    />
                  </div>
                  <span className={`text-sm font-medium w-12 text-right ${isGood ? 'text-emerald-400' : 'text-red-400'}`}>
                    {value}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4">
        <Button
          onClick={onPlayAgain}
          className="flex-1 bg-gradient-to-r from-emerald-500 to-blue-500"
        >
          Rejouer
        </Button>
        <Button
          onClick={onExit}
          variant="outline"
          className="flex-1 border-white/20 text-white hover:bg-white/10"
        >
          Quitter
        </Button>
      </div>
    </motion.div>
  );
}