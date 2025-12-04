import React from 'react';
import { motion } from 'framer-motion';
import { Star, TrendingUp, Flame, Trophy } from 'lucide-react';
import { getPlayerLevel, getNextLevel, getProgressToNextLevel, LEVELS } from './GamificationSystem';

export default function PlayerStats({ compact = false }) {
  const stats = JSON.parse(localStorage.getItem('nird-stats') || '{}');
  const badges = JSON.parse(localStorage.getItem('nird-badges') || '[]');
  const points = stats.points || 0;
  const streak = stats.streak || 0;
  
  const currentLevel = getPlayerLevel(points);
  const nextLevel = getNextLevel(points);
  const progress = getProgressToNextLevel(points);

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${currentLevel.color} flex items-center justify-center text-lg`}>
          {currentLevel.icon}
        </div>
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-amber-400" />
          <span className="text-white font-semibold">{points}</span>
        </div>
        {streak > 1 && (
          <div className="flex items-center gap-1 text-orange-400">
            <Flame className="w-4 h-4" />
            <span className="text-sm font-medium">{streak}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 rounded-2xl border border-white/10 p-6"
    >
      {/* Level display */}
      <div className="flex items-center gap-4 mb-6">
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${currentLevel.color} flex items-center justify-center text-3xl shadow-lg`}>
          {currentLevel.icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-sm">Niveau {currentLevel.level}</span>
            {streak > 1 && (
              <span className="flex items-center gap-1 text-orange-400 text-sm">
                <Flame className="w-3 h-3" />
                {streak} jours
              </span>
            )}
          </div>
          <h3 className="text-xl font-bold text-white">{currentLevel.name}</h3>
        </div>
      </div>

      {/* Points and progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400" />
            <span className="text-white font-bold">{points} points</span>
          </div>
          {nextLevel && (
            <span className="text-slate-400 text-sm">
              {nextLevel.minPoints - points} pts pour niveau {nextLevel.level}
            </span>
          )}
        </div>
        
        {nextLevel && (
          <div className="relative h-3 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
              className={`absolute inset-y-0 left-0 bg-gradient-to-r ${currentLevel.color}`}
            />
          </div>
        )}
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-700/50 rounded-xl p-3 text-center">
          <Trophy className="w-5 h-5 text-amber-400 mx-auto mb-1" />
          <p className="text-lg font-bold text-white">{badges.length}</p>
          <p className="text-xs text-slate-400">Badges</p>
        </div>
        <div className="bg-slate-700/50 rounded-xl p-3 text-center">
          <TrendingUp className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
          <p className="text-lg font-bold text-white">{stats.totalVisits || 1}</p>
          <p className="text-xs text-slate-400">Visites</p>
        </div>
        <div className="bg-slate-700/50 rounded-xl p-3 text-center">
          <Flame className="w-5 h-5 text-orange-400 mx-auto mb-1" />
          <p className="text-lg font-bold text-white">{streak}</p>
          <p className="text-xs text-slate-400">Streak</p>
        </div>
      </div>
    </motion.div>
  );
}