import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, Filter } from 'lucide-react';
import { EXTENDED_BADGES } from './GamificationSystem';

const CATEGORIES = [
  { id: 'all', label: 'Tous', color: 'bg-slate-500' },
  { id: 'story', label: 'Histoire', color: 'bg-emerald-500' },
  { id: 'community', label: 'Communauté', color: 'bg-blue-500' },
  { id: 'achievement', label: 'Exploits', color: 'bg-purple-500' },
  { id: 'special', label: 'Spéciaux', color: 'bg-amber-500' }
];

export function ExtendedBadgePopup({ badge, onClose }) {
  const badgeData = EXTENDED_BADGES[badge];
  if (!badgeData) return null;

  const categoryInfo = CATEGORIES.find(c => c.id === badgeData.category) || CATEGORIES[0];

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
          className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 max-w-sm w-full text-center border border-white/20 shadow-2xl relative"
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30"
          >
            <span className="text-5xl">{badgeData.icon}</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className={`inline-block px-3 py-1 rounded-full text-xs text-white mb-3 ${categoryInfo.color}`}>
              {categoryInfo.label}
            </span>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span className="text-amber-400 text-sm font-medium uppercase tracking-wide">
                Nouveau badge !
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{badgeData.name}</h3>
            <p className="text-slate-400">{badgeData.description}</p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            onClick={onClose}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity"
          >
            Super ! 🎉
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export function ExtendedBadgeCollection({ badges = [] }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const filteredBadges = Object.entries(EXTENDED_BADGES).filter(([key, badge]) => 
    selectedCategory === 'all' || badge.category === selectedCategory
  );

  const unlockedCount = badges.length;
  const totalCount = Object.keys(EXTENDED_BADGES).length;

  return (
    <div>
      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              selectedCategory === cat.id
                ? `${cat.color} text-white`
                : 'bg-slate-700/50 text-slate-400 hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Progress */}
      <div className="mb-4 p-3 bg-slate-700/30 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-400">Progression</span>
          <span className="text-sm font-semibold text-white">{unlockedCount}/{totalCount}</span>
        </div>
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(unlockedCount / totalCount) * 100}%` }}
            className="h-full bg-gradient-to-r from-amber-400 to-orange-500"
          />
        </div>
      </div>

      {/* Badges grid */}
      <div className="grid grid-cols-4 gap-3">
        {filteredBadges.map(([key, badge]) => {
          const isUnlocked = badges.includes(key);
          return (
            <motion.div
              key={key}
              whileHover={{ scale: 1.05 }}
              className={`aspect-square rounded-xl flex flex-col items-center justify-center p-2 transition-all ${
                isUnlocked
                  ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30'
                  : 'bg-slate-800/50 border border-slate-700'
              }`}
            >
              <span className={`text-2xl ${!isUnlocked && 'opacity-30 grayscale'}`}>
                {badge.icon}
              </span>
              <span className={`text-xs mt-1 text-center line-clamp-1 ${
                isUnlocked ? 'text-amber-400' : 'text-slate-500'
              }`}>
                {isUnlocked ? badge.name : '???'}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}