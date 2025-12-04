import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Target, Zap, Clock, Gamepad2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getSimulationStats } from './SimulationBadges';

export default function ProgressTracker() {
  const stats = getSimulationStats();
  
  // Calculate trends
  const recentGames = stats.scoreHistory.slice(-5);
  const olderGames = stats.scoreHistory.slice(-10, -5);
  
  const calculateTrend = (key) => {
    if (recentGames.length < 2) return 0;
    const recentAvg = recentGames.reduce((sum, g) => sum + (g[key] || 0), 0) / recentGames.length;
    const olderAvg = olderGames.length > 0 
      ? olderGames.reduce((sum, g) => sum + (g[key] || 0), 0) / olderGames.length
      : recentAvg;
    return Math.round(recentAvg - olderAvg);
  };

  const trends = {
    totalScore: calculateTrend('totalScore'),
    ecology: calculateTrend('ecology'),
    autonomy: calculateTrend('autonomy')
  };

  const TrendIcon = ({ value }) => {
    if (value > 0) return <TrendingUp className="w-4 h-4 text-emerald-400" />;
    if (value < 0) return <TrendingDown className="w-4 h-4 text-red-400" />;
    return <Minus className="w-4 h-4 text-slate-400" />;
  };

  const chartData = stats.scoreHistory.map((game, i) => ({
    name: `#${i + 1}`,
    score: game.totalScore,
    ecology: game.ecology,
    autonomy: game.autonomy
  }));

  return (
    <div className="space-y-6">
      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Gamepad2 className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-slate-400">Parties jouées</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.totalGames}</p>
        </div>
        
        <div className="bg-slate-800/50 rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-slate-400">Meilleur score</span>
          </div>
          <p className="text-2xl font-bold text-amber-400">{stats.bestTotalScore}%</p>
        </div>
        
        <div className="bg-slate-800/50 rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-slate-400">Temps total</span>
          </div>
          <p className="text-2xl font-bold text-blue-400">{Math.round(stats.totalPlayTime / 60)}min</p>
        </div>
        
        <div className="bg-slate-800/50 rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-slate-400">Scénarios IA</span>
          </div>
          <p className="text-2xl font-bold text-emerald-400">{stats.aiScenariosCompleted}</p>
        </div>
      </div>

      {/* Records */}
      <div className="bg-slate-800/50 rounded-xl p-4 border border-white/10">
        <h4 className="font-semibold text-white mb-4">Records personnels</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-xs text-slate-400 mb-1">Écologie</p>
            <p className="text-xl font-bold text-emerald-400">{stats.bestEcology}%</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-400 mb-1">Autonomie</p>
            <p className="text-xl font-bold text-purple-400">{stats.bestAutonomy}%</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-400 mb-1">Satisfaction</p>
            <p className="text-xl font-bold text-blue-400">{stats.bestSatisfaction}%</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-400 mb-1">Budget</p>
            <p className="text-xl font-bold text-amber-400">{stats.bestBudget}K€</p>
          </div>
        </div>
      </div>

      {/* Trends */}
      {stats.scoreHistory.length >= 2 && (
        <div className="bg-slate-800/50 rounded-xl p-4 border border-white/10">
          <h4 className="font-semibold text-white mb-4">Tendances récentes</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <TrendIcon value={trends.totalScore} />
              <div>
                <p className="text-xs text-slate-400">Score global</p>
                <p className={`font-medium ${trends.totalScore >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {trends.totalScore >= 0 ? '+' : ''}{trends.totalScore}%
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendIcon value={trends.ecology} />
              <div>
                <p className="text-xs text-slate-400">Écologie</p>
                <p className={`font-medium ${trends.ecology >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {trends.ecology >= 0 ? '+' : ''}{trends.ecology}%
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendIcon value={trends.autonomy} />
              <div>
                <p className="text-xs text-slate-400">Autonomie</p>
                <p className={`font-medium ${trends.autonomy >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {trends.autonomy >= 0 ? '+' : ''}{trends.autonomy}%
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress Chart */}
      {chartData.length >= 2 && (
        <div className="bg-slate-800/50 rounded-xl p-4 border border-white/10">
          <h4 className="font-semibold text-white mb-4">Évolution des scores</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px'
                  }}
                />
                <Line type="monotone" dataKey="score" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b' }} name="Score" />
                <Line type="monotone" dataKey="ecology" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} name="Écologie" />
                <Line type="monotone" dataKey="autonomy" stroke="#a855f7" strokeWidth={2} dot={{ fill: '#a855f7' }} name="Autonomie" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-xs text-slate-400">Score</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-xs text-slate-400">Écologie</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <span className="text-xs text-slate-400">Autonomie</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}