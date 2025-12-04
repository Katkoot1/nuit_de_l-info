import React from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

// Badges spécifiques à la simulation
export const SIMULATION_BADGES = {
  // Écologie
  'eco-starter': { 
    name: 'Éco-Débutant', 
    icon: '🌱', 
    description: 'Atteindre 40% en écologie',
    condition: (stats) => stats.bestEcology >= 40,
    category: 'ecology'
  },
  'eco-warrior': { 
    name: 'Éco-Guerrier', 
    icon: '🌿', 
    description: 'Atteindre 60% en écologie',
    condition: (stats) => stats.bestEcology >= 60,
    category: 'ecology'
  },
  'eco-master': { 
    name: 'Maître Écolo', 
    icon: '🌳', 
    description: 'Atteindre 80% en écologie',
    condition: (stats) => stats.bestEcology >= 80,
    category: 'ecology'
  },
  'eco-legend': { 
    name: 'Légende Verte', 
    icon: '🌍', 
    description: 'Maintenir 70%+ en écologie sur 3 parties',
    condition: (stats) => stats.highEcologyGames >= 3,
    category: 'ecology'
  },

  // Autonomie
  'autonomy-starter': { 
    name: 'Vers la Liberté', 
    icon: '🔓', 
    description: 'Atteindre 40% en autonomie',
    condition: (stats) => stats.bestAutonomy >= 40,
    category: 'autonomy'
  },
  'autonomy-advocate': { 
    name: 'Avocat du Libre', 
    icon: '🐧', 
    description: 'Atteindre 60% en autonomie',
    condition: (stats) => stats.bestAutonomy >= 60,
    category: 'autonomy'
  },
  'autonomy-master': { 
    name: 'Souveraineté Totale', 
    icon: '🏛️', 
    description: 'Atteindre 80% en autonomie',
    condition: (stats) => stats.bestAutonomy >= 80,
    category: 'autonomy'
  },
  'sovereignty-champion': { 
    name: 'Champion Souverain', 
    icon: '🗽', 
    description: 'Maintenir 70%+ en autonomie sur 3 parties',
    condition: (stats) => stats.highAutonomyGames >= 3,
    category: 'autonomy'
  },

  // Performance globale
  'first-simulation': { 
    name: 'Première Simulation', 
    icon: '🎮', 
    description: 'Compléter votre première simulation',
    condition: (stats) => stats.totalGames >= 1,
    category: 'progress'
  },
  'simulation-veteran': { 
    name: 'Vétéran', 
    icon: '⭐', 
    description: 'Compléter 5 simulations',
    condition: (stats) => stats.totalGames >= 5,
    category: 'progress'
  },
  'simulation-expert': { 
    name: 'Expert NIRD', 
    icon: '🏆', 
    description: 'Compléter 10 simulations',
    condition: (stats) => stats.totalGames >= 10,
    category: 'progress'
  },
  'perfect-balance': { 
    name: 'Équilibre Parfait', 
    icon: '⚖️', 
    description: 'Tous les scores au-dessus de 50% simultanément',
    condition: (stats) => stats.perfectBalanceAchieved,
    category: 'achievement'
  },
  'budget-master': { 
    name: 'Gestionnaire Hors Pair', 
    icon: '💰', 
    description: 'Terminer avec plus de 80K€ de budget',
    condition: (stats) => stats.bestBudget >= 80,
    category: 'achievement'
  },
  'speed-runner': { 
    name: 'Speed Runner', 
    icon: '⚡', 
    description: 'Terminer une simulation en moins de 3 minutes',
    condition: (stats) => stats.fastestGame && stats.fastestGame < 180,
    category: 'achievement'
  },

  // IA
  'ai-explorer': { 
    name: 'Explorateur IA', 
    icon: '🤖', 
    description: 'Compléter un scénario généré par l\'IA',
    condition: (stats) => stats.aiScenariosCompleted >= 1,
    category: 'ai'
  },
  'ai-master': { 
    name: 'Maître de l\'IA', 
    icon: '🧠', 
    description: 'Compléter 5 scénarios générés par l\'IA',
    condition: (stats) => stats.aiScenariosCompleted >= 5,
    category: 'ai'
  }
};

export function checkAndAwardSimulationBadges(stats) {
  const currentBadges = JSON.parse(localStorage.getItem('nird-simulation-badges') || '[]');
  const newBadges = [];

  Object.entries(SIMULATION_BADGES).forEach(([id, badge]) => {
    if (!currentBadges.includes(id) && badge.condition(stats)) {
      newBadges.push(id);
    }
  });

  if (newBadges.length > 0) {
    localStorage.setItem('nird-simulation-badges', JSON.stringify([...currentBadges, ...newBadges]));
  }

  return newBadges;
}

export function getSimulationStats() {
  return JSON.parse(localStorage.getItem('nird-simulation-stats') || JSON.stringify({
    totalGames: 0,
    bestEcology: 0,
    bestAutonomy: 0,
    bestSatisfaction: 0,
    bestBudget: 0,
    bestTotalScore: 0,
    highEcologyGames: 0,
    highAutonomyGames: 0,
    perfectBalanceAchieved: false,
    fastestGame: null,
    aiScenariosCompleted: 0,
    totalPlayTime: 0,
    scoreHistory: []
  }));
}

export function updateSimulationStats(gameResult) {
  const stats = getSimulationStats();
  
  stats.totalGames += 1;
  stats.bestEcology = Math.max(stats.bestEcology, gameResult.ecology);
  stats.bestAutonomy = Math.max(stats.bestAutonomy, gameResult.autonomy);
  stats.bestSatisfaction = Math.max(stats.bestSatisfaction, gameResult.satisfaction);
  stats.bestBudget = Math.max(stats.bestBudget, gameResult.budget);
  stats.bestTotalScore = Math.max(stats.bestTotalScore, gameResult.totalScore);
  
  if (gameResult.ecology >= 70) stats.highEcologyGames += 1;
  if (gameResult.autonomy >= 70) stats.highAutonomyGames += 1;
  
  if (gameResult.ecology >= 50 && gameResult.autonomy >= 50 && 
      gameResult.satisfaction >= 50 && gameResult.budget >= 50) {
    stats.perfectBalanceAchieved = true;
  }
  
  if (!stats.fastestGame || gameResult.duration < stats.fastestGame) {
    stats.fastestGame = gameResult.duration;
  }
  
  stats.aiScenariosCompleted += gameResult.aiScenarios || 0;
  stats.totalPlayTime += gameResult.duration || 0;
  
  stats.scoreHistory.push({
    date: new Date().toISOString(),
    totalScore: gameResult.totalScore,
    ecology: gameResult.ecology,
    autonomy: gameResult.autonomy
  });
  
  // Keep only last 20 games
  if (stats.scoreHistory.length > 20) {
    stats.scoreHistory = stats.scoreHistory.slice(-20);
  }
  
  localStorage.setItem('nird-simulation-stats', JSON.stringify(stats));
  return stats;
}

export default function SimulationBadgesDisplay({ showLocked = true, category = null }) {
  const badges = JSON.parse(localStorage.getItem('nird-simulation-badges') || '[]');
  const stats = getSimulationStats();
  
  const filteredBadges = Object.entries(SIMULATION_BADGES).filter(([_, badge]) => 
    !category || badge.category === category
  );

  const unlockedCount = filteredBadges.filter(([id]) => badges.includes(id)).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-white">Badges Simulation</h3>
        <span className="text-sm text-slate-400">{unlockedCount}/{filteredBadges.length}</span>
      </div>
      
      <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
        {filteredBadges.map(([id, badge]) => {
          const isUnlocked = badges.includes(id);
          
          if (!showLocked && !isUnlocked) return null;
          
          return (
            <motion.div
              key={id}
              whileHover={{ scale: 1.05 }}
              className={`aspect-square rounded-xl flex flex-col items-center justify-center p-2 transition-all cursor-pointer group relative ${
                isUnlocked
                  ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30'
                  : 'bg-slate-800/50 border border-slate-700'
              }`}
            >
              <span className={`text-2xl ${!isUnlocked && 'opacity-30 grayscale'}`}>
                {isUnlocked ? badge.icon : <Lock className="w-5 h-5 text-slate-500" />}
              </span>
              <span className={`text-xs mt-1 text-center truncate w-full ${
                isUnlocked ? 'text-amber-400' : 'text-slate-500'
              }`}>
                {isUnlocked ? badge.name : '???'}
              </span>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 rounded-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
                <p className="text-sm font-medium text-white">{badge.name}</p>
                <p className="text-xs text-slate-400">{badge.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}