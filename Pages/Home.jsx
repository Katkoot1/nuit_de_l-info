import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { createPageUrl } from '@/utils';
import { Sparkles, Play, Users, BookOpen, TreePine, MessageSquare, Star, Settings, Calculator, MapPin } from 'lucide-react';
import PlayerStats from '@/components/game/PlayerStats.jsx';
import { trackDailyVisit, LevelUpPopup } from '@/components/game/GamificationSystem.jsx';



const FloatingParticle = ({ delay, duration, x }) => (
  <motion.div
    className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-emerald-400/30 to-blue-400/30"
    initial={{ y: '100vh', x, opacity: 0 }}
    animate={{ 
      y: '-10vh', 
      opacity: [0, 1, 1, 0],
    }}
    transition={{ 
      duration, 
      delay, 
      repeat: Infinity,
      ease: 'linear'
    }}
  />
);

export default function Home() {
  const [levelUpInfo, setLevelUpInfo] = useState(null);
  const [hasExistingProgress, setHasExistingProgress] = useState(false);
  const [particles] = useState(() => 
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      delay: Math.random() * 5,
      duration: 8 + Math.random() * 4,
      x: Math.random() * 100 + 'vw'
    }))
  );

  useEffect(() => {
    // Track daily visit and check for level up
    trackDailyVisit();
    
    // Check if user has existing progress
    const progress = localStorage.getItem('nird-progress');
    const stats = localStorage.getItem('nird-stats');
    setHasExistingProgress(!!progress || !!stats);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden relative">
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map(p => (
          <FloatingParticle key={p.id} {...p} />
        ))}
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBtLTEgMGExIDEgMCAxIDAgMiAwYTEgMSAwIDEgMCAtMiAwIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+PC9nPjwvc3ZnPg==')] opacity-40" />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Hero Section */}
        <AnimatePresence mode="wait">
          {true && (
            <motion.div
              key="hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -50 }}
              className="flex-1 flex flex-col items-center justify-center px-4 py-12"
            >
              {/* Logo / Title */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
                className="text-center mb-8"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-sm text-white/80">Une aventure pédagogique</span>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-blue-400 to-orange-400 mb-4">
                  NIRD Quest
                </h1>
                <p className="text-xl md:text-2xl text-slate-300 font-light max-w-2xl mx-auto">
                    Simulation stratégique du numérique responsable
                  </p>
              </motion.div>

              {/* Illustration */}
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="relative w-full max-w-lg mb-12"
              >
                <div className="aspect-video rounded-2xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 backdrop-blur-sm border border-white/10 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div 
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-8xl"
                    >
                      🏫
                    </motion.div>
                  </div>
                  <div className="absolute bottom-4 left-4 flex gap-2">
                    <span className="text-4xl">🌱</span>
                    <span className="text-4xl">💻</span>
                    <span className="text-4xl">♻️</span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="text-4xl">🐧</span>
                  </div>
                </div>
              </motion.div>

              {/* Player Stats (if returning player) */}
              {hasExistingProgress && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="w-full max-w-md mb-8"
                >
                  <PlayerStats compact />
                </motion.div>
              )}

              {/* CTA - Two game modes */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col gap-6 w-full max-w-2xl"
              >
                <p className="text-center text-slate-400 text-sm">Choisissez votre mode de jeu</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Adventure Mode (QCM chapters) */}
                  <Link
                    to={createPageUrl('Chapter1')}
                    className="group relative p-6 bg-gradient-to-br from-orange-500/20 to-amber-500/20 border border-orange-500/30 rounded-2xl hover:border-orange-500/50 transition-all"
                  >
                    <div className="text-4xl mb-3">🎮</div>
                    <h3 className="text-lg font-bold text-white mb-2">Mode Aventure</h3>
                    <p className="text-sm text-slate-400 mb-4">Parcours éducatif en 4 chapitres avec quiz et badges à débloquer</p>
                    <div className="flex items-center gap-2 text-orange-400 text-sm font-medium">
                      <Play className="w-4 h-4" />
                      Commencer l'aventure
                    </div>
                  </Link>

                  {/* Simulation Mode */}
                  <Link
                    to={createPageUrl('SimulationGame')}
                    className="group relative p-6 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 rounded-2xl hover:border-emerald-500/50 transition-all"
                  >
                    <div className="text-4xl mb-3">🎯</div>
                    <h3 className="text-lg font-bold text-white mb-2">Mode Simulation</h3>
                    <p className="text-sm text-slate-400 mb-4">5 scénarios stratégiques avec décisions et conséquences réalistes</p>
                    <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
                      <Play className="w-4 h-4" />
                      Lancer la simulation
                    </div>
                  </Link>
                </div>

                {hasExistingProgress && (
                  <Link
                    to={createPageUrl('Profile')}
                    className="mx-auto px-6 py-3 bg-white/10 rounded-xl text-white font-medium hover:bg-white/20 transition-colors flex items-center gap-2"
                  >
                    <Star className="w-4 h-4" />
                    Mon profil
                  </Link>
                )}
              </motion.div>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl w-full px-4"
              >
                {[
                  { icon: Users, text: '4 chapitres éducatifs', color: 'text-orange-400' },
                  { icon: BookOpen, text: '5 scénarios stratégiques', color: 'text-blue-400' },
                  { icon: TreePine, text: 'Impact mesurable', color: 'text-emerald-400' }
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-slate-400">
                    <feature.icon className={`w-5 h-5 ${feature.color}`} />
                    <span className="text-sm">{feature.text}</span>
                  </div>
                ))}
                </motion.div>

                {/* Forum and Tools links */}
                <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-8 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                      to={createPageUrl('Forum')}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500/20 border border-purple-500/30 rounded-xl text-purple-400 hover:bg-purple-500/30 transition-colors"
                    >
                      <MessageSquare className="w-5 h-5" />
                      Rejoindre le forum communautaire
                    </Link>
                    <Link
                      to={createPageUrl('MigrationGuide')}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500/20 border border-blue-500/30 rounded-xl text-blue-400 hover:bg-blue-500/30 transition-colors"
                    >
                      <Settings className="w-5 h-5" />
                      Guide de migration Linux
                    </Link>
                  </div>
                  
                  {/* Nouveaux outils */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                      to={createPageUrl('CostComparator')}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                    >
                      <Calculator className="w-5 h-5" />
                      Comparateur de coûts
                    </Link>
                    <Link
                      to={createPageUrl('NIRDMap')}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500/20 border border-orange-500/30 rounded-xl text-orange-400 hover:bg-orange-500/30 transition-colors"
                    >
                      <MapPin className="w-5 h-5" />
                      Carte des établissements
                    </Link>
                  </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Level up popup */}
        {levelUpInfo && (
          <LevelUpPopup level={levelUpInfo} onClose={() => setLevelUpInfo(null)} />
        )}

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="py-6 text-center text-slate-500 text-sm"
        >
          <p>
            Une initiative pour un{' '}
            <span className="text-emerald-400">N</span>umérique{' '}
            <span className="text-blue-400">I</span>nclusif,{' '}
            <span className="text-orange-400">R</span>esponsable et{' '}
            <span className="text-emerald-400">D</span>urable
          </p>
        </motion.footer>
      </div>
    </div>
  );
}