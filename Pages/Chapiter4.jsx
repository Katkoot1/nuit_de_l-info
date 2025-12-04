import React, { useState, useEffect, Suspense } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { createPageUrl } from '@/utils';
import ProgressBar from '@/components/game/ProgressBar.jsx';
import SchoolView from '@/components/game/SchoolView.jsx';
import School3D from '@/components/3d/School3D.jsx';
import { BadgePopup, BadgeCollection } from '@/components/game/BadgeDisplay.jsx';
import ChapterResources from '@/components/game/ChapterResources.jsx';
import { Trophy, Euro, Leaf, Shield, ArrowRight, Share2, RefreshCw, ExternalLink, Download } from 'lucide-react';

const chapter4Resources = [
  {
    type: 'article',
    title: 'Site officiel du projet NIRD',
    description: 'Toutes les ressources, guides et actualités du mouvement NIRD.',
    url: 'https://nird.forge.apps.education.fr/',
    source: 'NIRD'
  },
  {
    type: 'video',
    title: 'Reportage France 3 : Un lycée passe au libre',
    description: 'Découvrez comment le lycée de Carquefou a transformé son infrastructure numérique.',
    url: 'https://www.france.tv/france-3/pays-de-la-loire/',
    source: 'France 3'
  },
  {
    type: 'case_study',
    title: 'Bilan : 3 ans de migration Linux dans l\'académie',
    description: 'Analyse détaillée des économies réalisées et des défis rencontrés.',
    url: 'https://nird.forge.apps.education.fr/',
    source: 'NIRD'
  },
  {
    type: 'article',
    title: 'April : Promouvoir le logiciel libre',
    description: 'Association de référence pour le logiciel libre en France.',
    url: 'https://www.april.org/',
    source: 'April'
  },
  {
    type: 'article',
    title: 'Framasoft : Dégooglisons Internet',
    description: 'Des alternatives libres et éthiques aux services des GAFAM.',
    url: 'https://framasoft.org/',
    source: 'Framasoft'
  },
  {
    type: 'video',
    title: 'TEDx : Le numérique responsable, c\'est possible',
    description: 'Conférence inspirante sur la transformation numérique durable.',
    url: 'https://www.youtube.com/watch?v=tedx-numerique-responsable',
    source: 'TEDx'
  },
  {
    type: 'case_study',
    title: 'La ville de Munich et Linux',
    description: 'L\'histoire de la plus grande migration vers Linux en Europe.',
    url: 'https://en.wikipedia.org/wiki/LiMux',
    source: 'Wikipedia'
  },
  {
    type: 'infographic',
    title: 'Ton impact en chiffres',
    description: 'Résumé de ce que tu as appris et de l\'impact potentiel de tes actions.',
    url: 'https://nird.forge.apps.education.fr/',
    source: 'NIRD',
    keyPoints: [
      'Un établissement peut économiser jusqu\'à 50 000€/an avec le libre',
      'Linux peut faire fonctionner un PC pendant 10+ ans',
      'Les données restent en France avec des solutions souveraines',
      'Chaque PC reconditionné évite 200kg de CO2'
    ]
  }
];

const stats = [
  {
    icon: Euro,
    label: 'Économies potentielles',
    beforeValue: '0€',
    getValue: (level) => `${Math.round(level * 150)}€/an`,
    color: 'text-amber-400'
  },
  {
    icon: Shield,
    label: 'Autonomie numérique',
    beforeValue: '20%',
    getValue: (level) => `${Math.round(20 + level * 0.7)}%`,
    color: 'text-blue-400'
  },
  {
    icon: Leaf,
    label: 'Impact CO2 réduit',
    beforeValue: '0 kg',
    getValue: (level) => `${Math.round(level * 5)} kg/an`,
    color: 'text-emerald-400'
  }
];

export default function Chapter4() {
  const navigate = useNavigate();
  const [transformationLevel, setTransformationLevel] = useState(0);
  const [sliderValue, setSliderValue] = useState(0);
  const [badges, setBadges] = useState([]);
  const [showBadge, setShowBadge] = useState(null);
  const [showFinalBadge, setShowFinalBadge] = useState(false);
  const [character, setCharacter] = useState(null);
  const [selectedActions, setSelectedActions] = useState([]);

  useEffect(() => {
    const progress = JSON.parse(localStorage.getItem('nird-progress') || '{}');
    if (!progress.completed?.includes(3)) {
      navigate(createPageUrl('Chapter3'));
      return;
    }
    
    setTransformationLevel(progress.transformationLevel || 0);
    setSelectedActions(progress.selectedActions || []);
    setCharacter(localStorage.getItem('nird-character'));
    
    const savedBadges = JSON.parse(localStorage.getItem('nird-badges') || '[]');
    
    // Award final badge
    if (!savedBadges.includes('nird-hero')) {
      savedBadges.push('nird-hero');
      localStorage.setItem('nird-badges', JSON.stringify(savedBadges));
      setTimeout(() => setShowFinalBadge(true), 1500);
    }
    
    setBadges(savedBadges);
    
    // Update progress
    progress.completed = [...(progress.completed || []), 4];
    localStorage.setItem('nird-progress', JSON.stringify(progress));
  }, [navigate]);

  const characterNames = {
    student: 'Éco-Délégué·e',
    teacher: 'Enseignant·e',
    director: 'Direction',
    technician: 'Technicien·ne'
  };

  const handleRestart = () => {
    localStorage.removeItem('nird-progress');
    localStorage.removeItem('nird-badges');
    localStorage.removeItem('nird-character');
    navigate(createPageUrl('Home'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <ProgressBar currentChapter={4} completedChapters={[1, 2, 3, 4]} />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Chapter title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 text-amber-400 text-sm font-medium mb-4">
            <Trophy className="w-4 h-4" />
            Chapitre 4
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Les Résultats</h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            Bravo {characterNames[character]} ! Découvre l'impact de tes choix
          </p>
        </motion.div>

        {/* Trophy */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex justify-center mb-8"
        >
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-8xl"
          >
            🏆
          </motion.div>
        </motion.div>

        {/* 3D School View */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-800/50 rounded-3xl border border-white/10 p-6 mb-8"
        >
          <h2 className="font-semibold text-white mb-4 text-center">
            Ton établissement en 3D
          </h2>
          
          <div className="h-64 md:h-80 rounded-2xl overflow-hidden bg-gradient-to-b from-sky-400 to-sky-200 mb-4">
            <Suspense fallback={
              <div className="w-full h-full flex items-center justify-center text-slate-600">
                Chargement 3D...
              </div>
            }>
              <School3D transformationLevel={sliderValue} className="w-full h-full" />
            </Suspense>
          </div>
          
          {/* Slider control for comparison */}
          <div className="flex items-center gap-4">
            <span className="text-red-400 text-sm font-medium">Avant</span>
            <input
              type="range"
              min="0"
              max="100"
              value={sliderValue}
              onChange={(e) => setSliderValue(Number(e.target.value))}
              className="flex-1 accent-emerald-500"
            />
            <span className="text-emerald-400 text-sm font-medium">Après</span>
          </div>
          <p className="text-center text-slate-400 text-sm mt-2">
            Déplace le curseur pour voir la transformation : {sliderValue}%
          </p>
        </motion.div>

        {/* 2D Comparison */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/50 rounded-3xl border border-white/10 p-6 mb-8"
        >
          <h2 className="font-semibold text-white mb-4 text-center">
            Comparaison Avant / Après
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <div className="absolute top-2 left-2 px-2 py-1 bg-red-500/80 rounded-full text-white text-xs font-medium z-10">
                Avant
              </div>
              <SchoolView transformationLevel={0} className="rounded-xl overflow-hidden" />
            </div>
            <div className="relative">
              <div className="absolute top-2 left-2 px-2 py-1 bg-emerald-500/80 rounded-full text-white text-xs font-medium z-10">
                Après ({transformationLevel}%)
              </div>
              <SchoolView transformationLevel={transformationLevel} className="rounded-xl overflow-hidden" />
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-3 gap-4 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="bg-slate-800/50 rounded-2xl border border-white/10 p-6 text-center"
            >
              <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
              <p className="text-slate-400 text-sm mb-2">{stat.label}</p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-slate-500 line-through text-sm">{stat.beforeValue}</span>
                <ArrowRight className="w-4 h-4 text-slate-500" />
                <span className={`text-2xl font-bold ${stat.color}`}>
                  {stat.getValue(transformationLevel)}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Badges collection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-800/50 rounded-3xl border border-white/10 p-6 mb-8"
        >
          <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            Tes badges ({badges.length}/8)
          </h2>
          <BadgeCollection badges={badges} />
        </motion.div>

        {/* Educational resources */}
        <ChapterResources 
          resources={chapter4Resources} 
          title="Ressources pour continuer l'aventure"
        />

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={handleRestart}
            className="px-6 py-4 bg-white/10 rounded-2xl text-white font-medium flex items-center justify-center gap-2 hover:bg-white/20 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Rejouer
          </button>
          <button
            onClick={async () => {
              const shareText = `J'ai transformé mon établissement à ${transformationLevel}% avec NIRD Quest ! 🏫♻️`;
              try {
                if (navigator.share) {
                  await navigator.share({
                    title: 'NIRD Quest',
                    text: shareText,
                    url: window.location.origin
                  });
                } else {
                  await navigator.clipboard.writeText(`${shareText} ${window.location.origin}`);
                  alert('Lien copié dans le presse-papier !');
                }
              } catch (err) {
                // Fallback: copy to clipboard
                try {
                  await navigator.clipboard.writeText(`${shareText} ${window.location.origin}`);
                  alert('Lien copié dans le presse-papier !');
                } catch {
                  // Silent fail
                }
              }
            }}
            className="px-6 py-4 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Share2 className="w-5 h-5" />
            Partager mes résultats
          </button>
        </motion.div>

        {/* Final message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <p className="text-slate-400 text-lg">
            "Seul on va plus vite, ensemble on va plus loin"
          </p>
          <p className="text-slate-500 text-sm mt-2">
            — Proverbe africain, mais aussi la philosophie NIRD 🌍
          </p>
        </motion.div>
      </div>

      {/* Final badge popup */}
      {showFinalBadge && (
        <BadgePopup badge="nird-hero" onClose={() => setShowFinalBadge(false)} />
      )}
    </div>
  );
}