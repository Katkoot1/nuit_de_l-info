import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Trophy, Zap, TrendingUp, Target, Gift, X } from 'lucide-react';

// Points configuration
export const POINTS_CONFIG = {
  chapter_complete: 100,
  badge_earned: 50,
  quiz_correct: 25,
  forum_post: 30,
  forum_reply: 15,
  forum_like_received: 5,
  daily_visit: 10,
  challenge_complete: 150,
  max_transformation: 200
};

// Levels configuration
export const LEVELS = [
  { level: 1, name: 'Débutant·e', minPoints: 0, icon: '🌱', color: 'from-slate-400 to-slate-500' },
  { level: 2, name: 'Initié·e', minPoints: 100, icon: '🌿', color: 'from-emerald-400 to-emerald-600' },
  { level: 3, name: 'Explorateur·rice', minPoints: 300, icon: '🔍', color: 'from-blue-400 to-blue-600' },
  { level: 4, name: 'Acteur·rice', minPoints: 600, icon: '⚡', color: 'from-amber-400 to-orange-500' },
  { level: 5, name: 'Champion·ne', minPoints: 1000, icon: '🏆', color: 'from-purple-400 to-purple-600' },
  { level: 6, name: 'Ambassadeur·rice', minPoints: 1500, icon: '🌟', color: 'from-pink-400 to-rose-500' },
  { level: 7, name: 'Légende NIRD', minPoints: 2500, icon: '👑', color: 'from-amber-300 to-yellow-500' }
];

// Weekly challenges - Expanded and varied
export const WEEKLY_CHALLENGES = [
  {
    id: 'forum_active',
    title: 'Communauté active',
    description: 'Publie 3 posts ou réponses sur le forum',
    target: 3,
    reward: 150,
    icon: '💬',
    trackKey: 'weekly_forum_posts',
    category: 'social'
  },
  {
    id: 'chapter_master',
    title: 'Maître des chapitres',
    description: 'Termine un chapitre avec toutes les bonnes réponses',
    target: 1,
    reward: 200,
    icon: '📚',
    trackKey: 'weekly_perfect_chapters',
    category: 'learning'
  },
  {
    id: 'eco_warrior',
    title: 'Guerrier·ère écolo',
    description: 'Atteins 80% de transformation dans le jeu',
    target: 80,
    reward: 175,
    icon: '🌍',
    trackKey: 'transformation_level',
    category: 'impact'
  },
  {
    id: 'social_butterfly',
    title: 'Papillon social',
    description: 'Reçois 10 likes sur tes contributions',
    target: 10,
    reward: 125,
    icon: '🦋',
    trackKey: 'weekly_likes_received',
    category: 'social'
  },
  {
    id: 'knowledge_seeker',
    title: 'Soif de savoir',
    description: 'Consulte 5 ressources éducatives',
    target: 5,
    reward: 100,
    icon: '📖',
    trackKey: 'weekly_resources_viewed',
    category: 'learning'
  },
  {
    id: 'helpful_hero',
    title: 'Héros de l\'entraide',
    description: 'Aide 3 personnes avec des réponses utiles',
    target: 3,
    reward: 180,
    icon: '🤝',
    trackKey: 'weekly_helpful_replies',
    category: 'social'
  },
  {
    id: 'quiz_champion',
    title: 'Champion·ne des quiz',
    description: 'Réponds correctement à 10 questions de quiz',
    target: 10,
    reward: 160,
    icon: '🎯',
    trackKey: 'weekly_quiz_correct',
    category: 'learning'
  },
  {
    id: 'impact_tracker',
    title: 'Traqueur d\'impact',
    description: 'Enregistre 2 entrées dans le suivi d\'impact',
    target: 2,
    reward: 140,
    icon: '📊',
    trackKey: 'weekly_impact_entries',
    category: 'impact'
  },
  {
    id: 'explorer',
    title: 'Explorateur·rice NIRD',
    description: 'Visite toutes les sections de l\'application',
    target: 5,
    reward: 120,
    icon: '🧭',
    trackKey: 'weekly_sections_visited',
    category: 'exploration'
  },
  {
    id: 'daily_streak',
    title: 'Régularité parfaite',
    description: 'Connecte-toi 5 jours cette semaine',
    target: 5,
    reward: 200,
    icon: '🔥',
    trackKey: 'weekly_visits',
    category: 'engagement'
  },
  {
    id: 'suggestion_maker',
    title: 'Force de proposition',
    description: 'Soumets 2 suggestions sur le forum',
    target: 2,
    reward: 170,
    icon: '💡',
    trackKey: 'weekly_suggestions',
    category: 'social'
  },
  {
    id: 'badge_hunter',
    title: 'Chasseur·se de badges',
    description: 'Débloque 2 nouveaux badges',
    target: 2,
    reward: 250,
    icon: '🏅',
    trackKey: 'weekly_badges_earned',
    category: 'achievement'
  }
];

// Extended badges
export const EXTENDED_BADGES = {
  // Original badges
  'scanner': { name: 'Détective Numérique', icon: '🔍', description: 'Tu as identifié les dépendances de ton établissement', category: 'story' },
  'pillar-inclusion': { name: 'Champion de l\'Inclusion', icon: '🤝', description: 'Tu comprends l\'importance de l\'accessibilité', category: 'story' },
  'pillar-responsability': { name: 'Gardien Éthique', icon: '🛡️', description: 'Tu as saisi les enjeux de la responsabilité numérique', category: 'story' },
  'pillar-durability': { name: 'Éco-Warrior', icon: '🌱', description: 'Tu es sensibilisé à la durabilité numérique', category: 'story' },
  'linux-master': { name: 'Linux Master', icon: '🐧', description: 'Tu as découvert les alternatives libres', category: 'story' },
  'autonomy': { name: 'Autonomie Numérique', icon: '🗽', description: 'Tu sais comment réduire les dépendances', category: 'story' },
  'transformer': { name: 'Transformateur', icon: '⚡', description: 'Tu as transformé ton établissement', category: 'story' },
  'nird-hero': { name: 'Héros NIRD', icon: '🏆', description: 'Tu as complété l\'aventure NIRD Quest', category: 'story' },
  
  // New achievement badges
  'first-post': { name: 'Première Voix', icon: '📝', description: 'Tu as publié ton premier post sur le forum', category: 'community' },
  'super-moderator': { name: 'Super Modérateur·rice', icon: '⭐', description: '10+ contributions sur le forum', category: 'community' },
  'helpful': { name: 'Entraide', icon: '🤗', description: 'Tu as aidé 5 personnes avec tes réponses', category: 'community' },
  'influencer': { name: 'Influenceur·se NIRD', icon: '📢', description: '50+ likes reçus au total', category: 'community' },
  'mentor-nird': { name: 'Mentor NIRD', icon: '🎓', description: '10+ réponses marquées comme utiles', category: 'community' },
  'idea-factory': { name: 'Boutique à idées', icon: '💡', description: '5+ suggestions pertinentes soumises', category: 'community' },
  'reputation-star': { name: 'Étoile de la Réputation', icon: '🌟', description: 'Atteint 100 points de réputation', category: 'community' },
  'trusted-voice': { name: 'Voix de Confiance', icon: '🎤', description: '3+ posts marqués comme utiles', category: 'community' },
  
  'eco-champion': { name: 'Éco-Champion·ne', icon: '🌍', description: 'Transformation maximale (100%)', category: 'achievement' },
  'speed-runner': { name: 'Speed Runner', icon: '⏱️', description: 'Chapitres complétés en moins de 30 min', category: 'achievement' },
  'perfectionist': { name: 'Perfectionniste', icon: '💎', description: '100% de bonnes réponses aux quiz', category: 'achievement' },
  'collector': { name: 'Collectionneur·se', icon: '🎯', description: 'Tous les badges de l\'histoire obtenus', category: 'achievement' },
  
  'early-bird': { name: 'Lève-tôt', icon: '🌅', description: 'Connecté·e avant 8h du matin', category: 'special' },
  'night-owl': { name: 'Oiseau de nuit', icon: '🦉', description: 'Connecté·e après 22h', category: 'special' },
  'weekly-warrior': { name: 'Guerrier·ère Hebdo', icon: '🗓️', description: '3 défis hebdomadaires complétés', category: 'special' },
  'streak-master': { name: 'Maître de la Régularité', icon: '🔥', description: '7 jours de connexion consécutifs', category: 'special' }
};

// Helper functions
export function getPlayerLevel(points) {
  let currentLevel = LEVELS[0];
  for (const level of LEVELS) {
    if (points >= level.minPoints) {
      currentLevel = level;
    } else {
      break;
    }
  }
  return currentLevel;
}

export function getNextLevel(points) {
  for (const level of LEVELS) {
    if (points < level.minPoints) {
      return level;
    }
  }
  return null;
}

export function getProgressToNextLevel(points) {
  const current = getPlayerLevel(points);
  const next = getNextLevel(points);
  if (!next) return 100;
  
  const pointsInCurrentLevel = points - current.minPoints;
  const pointsNeededForNext = next.minPoints - current.minPoints;
  return Math.round((pointsInCurrentLevel / pointsNeededForNext) * 100);
}

export function addPoints(amount, reason, notifyCallback = null) {
  const stats = JSON.parse(localStorage.getItem('nird-stats') || '{}');
  const newPoints = (stats.points || 0) + amount;
  const oldLevel = getPlayerLevel(stats.points || 0);
  const newLevel = getPlayerLevel(newPoints);
  
  stats.points = newPoints;
  stats.pointsHistory = [...(stats.pointsHistory || []), { amount, reason, date: new Date().toISOString() }];
  localStorage.setItem('nird-stats', JSON.stringify(stats));
  
  // Return level up info if applicable
  if (newLevel.level > oldLevel.level) {
    // Trigger notification if callback provided
    if (notifyCallback) {
      notifyCallback(newLevel);
    }
    return { levelUp: true, newLevel, points: newPoints };
  }
  return { levelUp: false, points: newPoints };
}

export function awardBadge(badgeId, notifyCallback = null) {
  const badges = JSON.parse(localStorage.getItem('nird-badges') || '[]');
  if (!badges.includes(badgeId)) {
    badges.push(badgeId);
    localStorage.setItem('nird-badges', JSON.stringify(badges));
    
    // Trigger notification if callback provided
    if (notifyCallback) {
      notifyCallback(badgeId);
    }
    return true;
  }
  return false;
}

export function trackDailyVisit() {
  const stats = JSON.parse(localStorage.getItem('nird-stats') || '{}');
  const today = new Date().toDateString();
  
  if (stats.lastVisit !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (stats.lastVisit === yesterday.toDateString()) {
      stats.streak = (stats.streak || 0) + 1;
    } else {
      stats.streak = 1;
    }
    
    stats.lastVisit = today;
    stats.totalVisits = (stats.totalVisits || 0) + 1;
    localStorage.setItem('nird-stats', JSON.stringify(stats));
    
    // Award points for daily visit
    addPoints(POINTS_CONFIG.daily_visit, 'Visite quotidienne');
    
    // Check streak badge
    if (stats.streak >= 7) {
      const badges = JSON.parse(localStorage.getItem('nird-badges') || '[]');
      if (!badges.includes('streak-master')) {
        badges.push('streak-master');
        localStorage.setItem('nird-badges', JSON.stringify(badges));
      }
    }
    
    // Check time-based badges
    const hour = new Date().getHours();
    const badges = JSON.parse(localStorage.getItem('nird-badges') || '[]');
    if (hour < 8 && !badges.includes('early-bird')) {
      badges.push('early-bird');
      localStorage.setItem('nird-badges', JSON.stringify(badges));
    }
    if (hour >= 22 && !badges.includes('night-owl')) {
      badges.push('night-owl');
      localStorage.setItem('nird-badges', JSON.stringify(badges));
    }
  }
}

export function getCurrentWeekChallenges() {
  const weekNumber = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  // Rotate challenges based on week
  const startIndex = weekNumber % WEEKLY_CHALLENGES.length;
  return [
    WEEKLY_CHALLENGES[startIndex],
    WEEKLY_CHALLENGES[(startIndex + 1) % WEEKLY_CHALLENGES.length],
    WEEKLY_CHALLENGES[(startIndex + 2) % WEEKLY_CHALLENGES.length]
  ];
}

// Level Up Popup Component
export function LevelUpPopup({ level, onClose }) {
  if (!level) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.5, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 max-w-sm w-full text-center border border-white/20 shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className={`w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br ${level.color} flex items-center justify-center shadow-lg`}
          >
            <span className="text-5xl">{level.icon}</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span className="text-emerald-400 text-sm font-medium uppercase tracking-wide">
                Niveau supérieur !
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Niveau {level.level}</h3>
            <p className="text-xl text-amber-400 font-semibold mb-2">{level.name}</p>
            <p className="text-slate-400">Continue comme ça !</p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            onClick={onClose}
            className={`mt-6 px-6 py-3 bg-gradient-to-r ${level.color} rounded-xl text-white font-semibold hover:opacity-90 transition-opacity`}
          >
            Génial ! 🎉
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Points Animation Component
export function PointsPopup({ points, reason }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.8 }}
      className="fixed bottom-24 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-xl shadow-lg z-40 flex items-center gap-2"
    >
      <Star className="w-5 h-5" />
      <span className="font-bold">+{points}</span>
      <span className="text-sm opacity-90">{reason}</span>
    </motion.div>
  );
}