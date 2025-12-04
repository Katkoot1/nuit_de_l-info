import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Trophy, Star, Target, Flame, TrendingUp, Share2, Euro, Leaf, Shield, BarChart3, Award } from 'lucide-react';
import PlayerStats from '@/components/game/PlayerStats.jsx';
import WeeklyChallenges from '@/components/game/WeeklyChallenges.jsx';
import { ExtendedBadgeCollection, ExtendedBadgePopup } from '@/components/game/ExtendedBadgeDisplay.jsx';
import { LevelUpPopup, addPoints } from '@/components/game/GamificationSystem.jsx';
import SimulationLeaderboard from '@/components/game/SimulationLeaderboard.jsx';
import SimulationBadgesDisplay from '@/components/game/SimulationBadges.jsx';
import ProgressTracker from '@/components/game/ProgressTracker.jsx';

export default function Profile() {
  const [badges, setBadges] = useState([]);
  const [showBadgePopup, setShowBadgePopup] = useState(null);
  const [levelUpInfo, setLevelUpInfo] = useState(null);
  const [stats, setStats] = useState({});
  const [progress, setProgress] = useState({});
  const [shareMessage, setShareMessage] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [playerName, setPlayerName] = useState('');

  useEffect(() => {
    const savedBadges = JSON.parse(localStorage.getItem('nird-badges') || '[]');
    const savedStats = JSON.parse(localStorage.getItem('nird-stats') || '{}');
    const savedProgress = JSON.parse(localStorage.getItem('nird-progress') || '{}');
    const savedName = localStorage.getItem('nird-player-name') || 'Joueur';
    setBadges(savedBadges);
    setStats(savedStats);
    setProgress(savedProgress);
    setPlayerName(savedName);
  }, []);

  const handleShare = async () => {
    const transformationLevel = progress.transformationLevel || 0;
    const shareText = `🏫 J'ai transformé mon établissement à ${transformationLevel}% avec NIRD Quest ! 🌱♻️ Rejoins l'aventure du numérique responsable !`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'NIRD Quest - Mes résultats',
          text: shareText,
          url: window.location.origin
        });
      } else {
        await navigator.clipboard.writeText(`${shareText} ${window.location.origin}`);
        setShareMessage('Lien copié !');
        setTimeout(() => setShareMessage(''), 2000);
      }
    } catch (err) {
      try {
        await navigator.clipboard.writeText(`${shareText} ${window.location.origin}`);
        setShareMessage('Lien copié !');
        setTimeout(() => setShareMessage(''), 2000);
      } catch {
        // Silent fail
      }
    }
  };

  const handleChallengeComplete = (challenge, result) => {
    if (result.levelUp) {
      setLevelUpInfo(result.newLevel);
    }
    // Refresh stats
    setStats(JSON.parse(localStorage.getItem('nird-stats') || '{}'));
  };

  const pointsHistory = stats.pointsHistory || [];
  const recentPoints = pointsHistory.slice(-10).reverse();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to={createPageUrl('Home')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Accueil</span>
            </Link>
            <h1 className="text-xl font-bold text-white">Mon Profil</h1>
            <div className="w-20" />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Player stats */}
        <PlayerStats />

        {/* Tab navigation */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { id: 'overview', label: 'Aperçu', icon: Star },
            { id: 'progress', label: 'Progression', icon: BarChart3 },
            { id: 'badges', label: 'Badges', icon: Award },
            { id: 'leaderboard', label: 'Classement', icon: Trophy }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 text-white'
                  : 'bg-slate-800/50 border border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <>
        {/* Game Results - Share section */}
        {progress.transformationLevel !== undefined && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-2xl border border-emerald-500/20 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Mes résultats NIRD Quest</h3>
                  <p className="text-xs text-slate-400">Partage ta progression !</p>
                </div>
              </div>
              <button
                onClick={handleShare}
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl text-white font-semibold text-sm flex items-center gap-2 hover:opacity-90 transition-opacity"
              >
                <Share2 className="w-4 h-4" />
                {shareMessage || 'Partager'}
              </button>
            </div>

            {/* Transformation level */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm">Transformation de l'établissement</span>
                <span className="text-emerald-400 font-bold text-lg">{progress.transformationLevel || 0}%</span>
              </div>
              <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress.transformationLevel || 0}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-blue-500"
                />
              </div>
            </div>

            {/* Impact stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-800/50 rounded-xl p-3 text-center">
                <Euro className="w-5 h-5 mx-auto mb-1 text-amber-400" />
                <p className="text-xs text-slate-400">Économies</p>
                <p className="text-amber-400 font-bold">{Math.round((progress.transformationLevel || 0) * 150)}€/an</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-3 text-center">
                <Shield className="w-5 h-5 mx-auto mb-1 text-blue-400" />
                <p className="text-xs text-slate-400">Autonomie</p>
                <p className="text-blue-400 font-bold">{Math.round(20 + (progress.transformationLevel || 0) * 0.7)}%</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-3 text-center">
                <Leaf className="w-5 h-5 mx-auto mb-1 text-emerald-400" />
                <p className="text-xs text-slate-400">CO2 évité</p>
                <p className="text-emerald-400 font-bold">{Math.round((progress.transformationLevel || 0) * 5)} kg</p>
              </div>
            </div>

            {/* Chapters completed */}
            <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
              <span>Chapitres complétés :</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4].map(ch => (
                  <span
                    key={ch}
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      progress.completed?.includes(ch)
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-700 text-slate-500'
                    }`}
                  >
                    {ch}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Weekly challenges */}
        <WeeklyChallenges onChallengeComplete={handleChallengeComplete} />

        {/* Badges collection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800/50 rounded-2xl border border-white/10 p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white">Collection de badges</h3>
              <p className="text-xs text-slate-400">{badges.length} badges débloqués</p>
            </div>
          </div>
          <ExtendedBadgeCollection badges={badges} />
        </motion.div>

        {/* Recent activity */}
        {recentPoints.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-800/50 rounded-2xl border border-white/10 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white">Activité récente</h3>
                <p className="text-xs text-slate-400">Tes derniers points gagnés</p>
              </div>
            </div>
            <div className="space-y-2">
              {recentPoints.map((entry, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-slate-700/30 rounded-xl"
                >
                  <span className="text-slate-300 text-sm">{entry.reason}</span>
                  <span className="text-amber-400 font-semibold">+{entry.amount}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-3 gap-4"
        >
          <Link
            to={createPageUrl('Chapter1')}
            className="p-6 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-2xl text-center hover:border-emerald-500/40 transition-colors"
          >
            <span className="text-3xl mb-2 block">🎮</span>
            <span className="text-white font-semibold text-sm">Jouer</span>
          </Link>
          <Link
            to={createPageUrl('Forum')}
            className="p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl text-center hover:border-purple-500/40 transition-colors"
          >
            <span className="text-3xl mb-2 block">💬</span>
            <span className="text-white font-semibold text-sm">Forum</span>
          </Link>
          <Link
            to={createPageUrl('EstablishmentDashboard')}
            className="p-6 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl text-center hover:border-blue-500/40 transition-colors"
          >
            <span className="text-3xl mb-2 block">🏫</span>
            <span className="text-white font-semibold text-sm">Dashboard</span>
          </Link>
        </motion.div>
          </>
        )}

        {/* PROGRESS TAB */}
        {activeTab === 'progress' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <ProgressTracker />
          </motion.div>
        )}

        {/* BADGES TAB */}
        {activeTab === 'badges' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Simulation badges */}
            <div className="bg-slate-800/50 rounded-2xl border border-white/10 p-6">
              <SimulationBadgesDisplay showLocked={true} />
            </div>

            {/* Story badges */}
            <div className="bg-slate-800/50 rounded-2xl border border-white/10 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Badges Aventure</h3>
                  <p className="text-xs text-slate-400">{badges.length} badges débloqués</p>
                </div>
              </div>
              <ExtendedBadgeCollection badges={badges} />
            </div>
          </motion.div>
        )}

        {/* LEADERBOARD TAB */}
        {activeTab === 'leaderboard' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <SimulationLeaderboard category="total" currentPlayerName={playerName} />
            <div className="grid md:grid-cols-3 gap-4">
              <SimulationLeaderboard category="ecology" currentPlayerName={playerName} compact />
              <SimulationLeaderboard category="autonomy" currentPlayerName={playerName} compact />
              <SimulationLeaderboard category="satisfaction" currentPlayerName={playerName} compact />
            </div>
          </motion.div>
        )}
      </div>

      {/* Badge popup */}
      {showBadgePopup && (
        <ExtendedBadgePopup badge={showBadgePopup} onClose={() => setShowBadgePopup(null)} />
      )}

      {/* Level up popup */}
      {levelUpInfo && (
        <LevelUpPopup level={levelUpInfo} onClose={() => setLevelUpInfo(null)} />
      )}
    </div>
  );
}