import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award } from 'lucide-react';

const allBadges = {
  'scanner': { name: 'Détective Numérique', icon: '🔍', description: 'Tu as identifié les dépendances de ton établissement' },
  'pillar-inclusion': { name: 'Champion de l\'Inclusion', icon: '🤝', description: 'Tu comprends l\'importance de l\'accessibilité' },
  'pillar-responsability': { name: 'Gardien Éthique', icon: '🛡️', description: 'Tu as saisi les enjeux de la responsabilité numérique' },
  'pillar-durability': { name: 'Éco-Warrior', icon: '🌱', description: 'Tu es sensibilisé à la durabilité numérique' },
  'linux-master': { name: 'Linux Master', icon: '🐧', description: 'Tu as découvert les alternatives libres' },
  'autonomy': { name: 'Autonomie Numérique', icon: '🗽', description: 'Tu sais comment réduire les dépendances' },
  'transformer': { name: 'Transformateur', icon: '⚡', description: 'Tu as transformé ton établissement' },
  'nird-hero': { name: 'Héros NIRD', icon: '🏆', description: 'Tu as complété l\'aventure NIRD Quest' },
  'eco-champion': { name: 'Éco-Champion', icon: '🌍', description: 'Tu as atteint un score d\'impact environnemental maximal (80+)' }
};

export function BadgePopup({ badge, onClose }) {
  const badgeData = allBadges[badge];
  if (!badgeData) return null;

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

export function BadgeCollection({ badges = [] }) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {Object.entries(allBadges).map(([key, badge]) => {
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
            <span className={`text-xs mt-1 text-center ${
              isUnlocked ? 'text-amber-400' : 'text-slate-500'
            }`}>
              {isUnlocked ? badge.name : '???'}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}

export { allBadges };