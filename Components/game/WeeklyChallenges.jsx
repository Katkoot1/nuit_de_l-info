import React from 'react';
import { motion } from 'framer-motion';
import { Target, Gift, CheckCircle, Clock } from 'lucide-react';
import { getCurrentWeekChallenges, addPoints } from './GamificationSystem';

export default function WeeklyChallenges({ onChallengeComplete }) {
  const challenges = getCurrentWeekChallenges();
  const stats = JSON.parse(localStorage.getItem('nird-stats') || '{}');
  const completedChallenges = stats.completedChallenges || [];
  
  // Get current week identifier
  const currentWeek = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));

  const getChallengeProgress = (challenge) => {
    const weeklyStats = stats.weeklyStats?.[currentWeek] || {};
    const value = weeklyStats[challenge.trackKey] || 0;
    
    // Special case for transformation level
    if (challenge.trackKey === 'transformation_level') {
      const progress = JSON.parse(localStorage.getItem('nird-progress') || '{}');
      return progress.transformationLevel || 0;
    }
    
    return value;
  };

  const isChallengeCompleted = (challenge) => {
    return completedChallenges.includes(`${currentWeek}-${challenge.id}`);
  };

  const handleClaimReward = (challenge) => {
    if (isChallengeCompleted(challenge)) return;
    
    const progress = getChallengeProgress(challenge);
    if (progress >= challenge.target) {
      // Mark as completed
      const newCompletedChallenges = [...completedChallenges, `${currentWeek}-${challenge.id}`];
      stats.completedChallenges = newCompletedChallenges;
      localStorage.setItem('nird-stats', JSON.stringify(stats));
      
      // Award points
      const result = addPoints(challenge.reward, `Défi: ${challenge.title}`);
      
      // Check weekly warrior badge
      const weekChallengesCompleted = newCompletedChallenges.filter(c => c.startsWith(`${currentWeek}-`)).length;
      if (weekChallengesCompleted >= 3) {
        const badges = JSON.parse(localStorage.getItem('nird-badges') || '[]');
        if (!badges.includes('weekly-warrior')) {
          badges.push('weekly-warrior');
          localStorage.setItem('nird-badges', JSON.stringify(badges));
        }
      }
      
      if (onChallengeComplete) {
        onChallengeComplete(challenge, result);
      }
    }
  };

  // Calculate days until reset
  const msUntilReset = ((currentWeek + 1) * 7 * 24 * 60 * 60 * 1000) - Date.now();
  const daysUntilReset = Math.ceil(msUntilReset / (24 * 60 * 60 * 1000));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 rounded-2xl border border-white/10 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white">Défis de la semaine</h3>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {daysUntilReset} jour{daysUntilReset > 1 ? 's' : ''} restant{daysUntilReset > 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {challenges.map((challenge, index) => {
          const progress = getChallengeProgress(challenge);
          const progressPercent = Math.min(100, (progress / challenge.target) * 100);
          const isCompleted = isChallengeCompleted(challenge);
          const canClaim = progress >= challenge.target && !isCompleted;

          return (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-xl border transition-all ${
                isCompleted
                  ? 'bg-emerald-500/10 border-emerald-500/30'
                  : canClaim
                  ? 'bg-amber-500/10 border-amber-500/30'
                  : 'bg-slate-700/30 border-white/5'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl">{challenge.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-white">{challenge.title}</h4>
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <span className="text-xs px-2 py-1 bg-amber-500/20 text-amber-400 rounded-full flex items-center gap-1">
                        <Gift className="w-3 h-3" />
                        {challenge.reward} pts
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-400 mb-2">{challenge.description}</p>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        className={`h-full ${isCompleted ? 'bg-emerald-500' : 'bg-gradient-to-r from-purple-500 to-pink-500'}`}
                      />
                    </div>
                    <span className="text-xs text-slate-400 whitespace-nowrap">
                      {Math.min(progress, challenge.target)}/{challenge.target}
                    </span>
                  </div>

                  {canClaim && (
                    <button
                      onClick={() => handleClaimReward(challenge)}
                      className="mt-3 w-full py-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                    >
                      Réclamer la récompense !
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}