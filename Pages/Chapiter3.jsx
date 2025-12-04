import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { createPageUrl } from '@/utils';
import ProgressBar from '@/components/game/ProgressBar.jsx';
import SchoolView from '@/components/game/SchoolView.jsx';
import { BadgePopup } from '@/components/game/BadgeDisplay.jsx';
import ChapterResources from '@/components/game/ChapterResources.jsx';
import { Zap, ArrowRight, Check, Monitor, Recycle, Users, Share2, GraduationCap, Wrench, Shield, Clock, TrendingDown } from 'lucide-react';

const chapter3Resources = [
  {
    type: 'article',
    title: 'Guide de migration vers Linux en établissement scolaire',
    description: 'Méthodologie complète pour réussir sa transition vers les logiciels libres.',
    url: 'https://nird.forge.apps.education.fr/',
    source: 'NIRD'
  },
  {
    type: 'video',
    title: 'Tuto : Installer Linux Mint sur un vieux PC',
    description: 'Guide pas à pas pour donner une seconde vie à un ordinateur obsolète.',
    url: 'https://www.youtube.com/watch?v=linux-mint-install',
    source: 'LinuxFr'
  },
  {
    type: 'case_study',
    title: 'Le collège Henri Wallon : 100% logiciels libres',
    description: 'Témoignage d\'un établissement qui a réussi sa transition numérique responsable.',
    url: 'https://nird.forge.apps.education.fr/',
    source: 'NIRD'
  },
  {
    type: 'article',
    title: 'Économie circulaire et matériel informatique',
    description: 'Comment mettre en place un programme de réemploi et reconditionnement.',
    url: 'https://www.economiecirculaire.org/informatique',
    source: 'Institut Économie Circulaire'
  },
  {
    type: 'video',
    title: 'Reportage : Les Ateliers du Bocage reconditionnent',
    description: 'Visite d\'une entreprise sociale qui donne une seconde vie aux ordinateurs.',
    url: 'https://www.youtube.com/watch?v=ateliers-bocage',
    source: 'Emmaüs'
  },
  {
    type: 'case_study',
    title: 'Mutualisation inter-établissements en Loire-Atlantique',
    description: 'Retour d\'expérience sur le partage de ressources entre lycées.',
    url: 'https://nird.forge.apps.education.fr/',
    source: 'NIRD'
  },
  {
    type: 'infographic',
    title: 'Impact d\'une migration Linux',
    description: 'Chiffres clés sur les bénéfices économiques et écologiques.',
    url: 'https://nird.forge.apps.education.fr/',
    source: 'NIRD',
    keyPoints: [
      'Économie moyenne : 15 000€/an pour un lycée de 1000 élèves',
      'Durée de vie du matériel multipliée par 2,5',
      'Réduction de 60% de l\'empreinte carbone numérique',
      '90% des logiciels pédagogiques ont une alternative libre'
    ]
  }
];

const actions = [
  {
    id: 'linux',
    icon: Monitor,
    title: 'Installer Linux',
    description: 'Migrer vers un système d\'exploitation libre et gratuit',
    impact: 20,
    badge: 'linux-master',
    benefits: ['Gratuit à vie, sans licence', 'Sécurisé et mis à jour régulièrement', 'Entièrement personnalisable', 'Fait revivre les vieux PC de +10 ans'],
    difficulty: 'Moyen',
    duration: '2-4 semaines',
    savings: '50€/poste/an'
  },
  {
    id: 'reemploi',
    icon: Recycle,
    title: 'Programme de réemploi',
    description: 'Donner une seconde vie au matériel informatique usagé',
    impact: 15,
    benefits: ['Économies de 60% sur le matériel', 'Réduction de 200kg CO2/PC', 'Matériel disponible immédiatement', 'Partenariat avec l\'économie sociale'],
    difficulty: 'Facile',
    duration: '1-2 semaines',
    savings: '300€/poste'
  },
  {
    id: 'formation',
    icon: GraduationCap,
    title: 'Former les équipes',
    description: 'Sensibiliser à la sobriété numérique et aux alternatives',
    impact: 15,
    benefits: ['Autonomie technique renforcée', 'Adoption des bonnes pratiques', 'Transmission des savoirs', 'Réduction des tickets support'],
    difficulty: 'Facile',
    duration: '1 journée',
    savings: 'Temps gagné'
  },
  {
    id: 'mutualisation',
    icon: Share2,
    title: 'Mutualiser les ressources',
    description: 'Partager outils et bonnes pratiques entre établissements',
    impact: 15,
    badge: 'autonomy',
    benefits: ['Division des coûts par 3-5', 'Entraide inter-établissements', 'Innovation collective', 'Négociation groupée'],
    difficulty: 'Moyen',
    duration: '1-3 mois',
    savings: '40% sur les coûts'
  },
  {
    id: 'accompagnement',
    icon: Users,
    title: 'Accompagner la transition',
    description: 'Soutenir élèves et professeurs dans le changement',
    impact: 10,
    benefits: ['Transition progressive et sereine', 'Support adapté à chaque niveau', 'Aucun laissé-pour-compte', 'Feedback pour améliorer'],
    difficulty: 'Facile',
    duration: 'Continu',
    savings: 'Satisfaction +80%'
  },
  {
    id: 'coconstruction',
    icon: Wrench,
    title: 'Co-construire des solutions',
    description: 'Développer des outils adaptés aux besoins locaux',
    impact: 10,
    badge: 'transformer',
    benefits: ['Solutions sur-mesure', 'Implication de la communauté', 'Fierté collective', 'Contribution au bien commun'],
    difficulty: 'Avancé',
    duration: '3-6 mois',
    savings: 'Valeur inestimable'
  },
  {
    id: 'libre-office',
    icon: Monitor,
    title: 'Suite bureautique libre',
    description: 'Remplacer Microsoft Office par LibreOffice',
    impact: 10,
    benefits: ['100% compatible avec les formats existants', 'Zéro licence à payer', 'Disponible sur tous les OS', 'Interface familière'],
    difficulty: 'Facile',
    duration: '1 semaine',
    savings: '100€/poste/an'
  },
  {
    id: 'cloud-souverain',
    icon: Shield,
    title: 'Cloud souverain',
    description: 'Utiliser Nextcloud au lieu de Google Drive/OneDrive',
    impact: 15,
    benefits: ['Données hébergées en France', 'Conformité RGPD garantie', 'Fonctionnalités collaboratives', 'Contrôle total des données'],
    difficulty: 'Moyen',
    duration: '2-4 semaines',
    savings: 'Souveraineté des données'
  }
];

export default function Chapter3() {
  const navigate = useNavigate();
  const [selectedActions, setSelectedActions] = useState([]);
  const [transformationLevel, setTransformationLevel] = useState(0);
  const [showBadge, setShowBadge] = useState(null);
  const [activeAction, setActiveAction] = useState(null);
  const [character, setCharacter] = useState(null);

  useEffect(() => {
    const progress = JSON.parse(localStorage.getItem('nird-progress') || '{}');
    if (!progress.completed?.includes(2)) {
      navigate(createPageUrl('Chapter2'));
    }
    setCharacter(localStorage.getItem('nird-character'));
  }, [navigate]);

  const handleActionSelect = (action) => {
    if (selectedActions.includes(action.id)) return;
    
    setSelectedActions(prev => [...prev, action.id]);
    setTransformationLevel(prev => Math.min(100, prev + action.impact));
    
    if (action.badge) {
      const badges = JSON.parse(localStorage.getItem('nird-badges') || '[]');
      if (!badges.includes(action.badge)) {
        badges.push(action.badge);
        localStorage.setItem('nird-badges', JSON.stringify(badges));
        setTimeout(() => setShowBadge(action.badge), 500);
      }
    }
  };

  const handleContinue = () => {
    const progress = JSON.parse(localStorage.getItem('nird-progress') || '{}');
    progress.completed = [...(progress.completed || []), 3];
    progress.chapter = 4;
    progress.transformationLevel = transformationLevel;
    progress.selectedActions = selectedActions;
    localStorage.setItem('nird-progress', JSON.stringify(progress));
    navigate(createPageUrl('Chapter4'));
  };

  const characterTips = {
    student: "En tant qu'éco-délégué·e, propose ces actions au conseil de vie lycéenne !",
    teacher: "Tu peux commencer par ta propre classe et montrer l'exemple.",
    director: "Tu as le pouvoir de lancer ces transformations à l'échelle de l'établissement.",
    technician: "Tu es le mieux placé pour mettre en œuvre ces solutions techniques."
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <ProgressBar currentChapter={3} completedChapters={[1, 2]} />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Chapter title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-medium mb-4">
            <Zap className="w-4 h-4" />
            Chapitre 3
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">L'Action</h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            {character && characterTips[character]}
          </p>
        </motion.div>

        {/* School transformation view */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-800/50 rounded-3xl border border-white/10 p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">Transformation de l'établissement</h2>
            <span className="text-emerald-400 font-bold">{transformationLevel}%</span>
          </div>
          <SchoolView transformationLevel={transformationLevel} className="rounded-2xl overflow-hidden" />
        </motion.div>

        {/* Actions grid */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {actions.map((action, index) => {
            const isSelected = selectedActions.includes(action.id);
            return (
              <motion.button
                key={action.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: isSelected ? 1 : 1.02 }}
                whileTap={{ scale: isSelected ? 1 : 0.98 }}
                onClick={() => {
                  if (!isSelected) {
                    setActiveAction(action);
                  }
                }}
                disabled={isSelected}
                className={`relative p-5 rounded-2xl border-2 text-left transition-all ${
                  isSelected
                    ? 'bg-emerald-500/10 border-emerald-500/50 cursor-default'
                    : 'bg-slate-800/50 border-white/10 hover:border-white/20 cursor-pointer'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    isSelected 
                      ? 'bg-emerald-500' 
                      : 'bg-gradient-to-r from-blue-500 to-purple-500'
                  }`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold mb-1 ${isSelected ? 'text-emerald-400' : 'text-white'}`}>
                      {action.title}
                    </h3>
                    <p className="text-sm text-slate-400">{action.description}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400">
                        +{action.impact}% transformation
                      </span>
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Progress summary */}
        <div className="flex items-center justify-between mb-8 p-4 bg-slate-800/50 rounded-2xl border border-white/10">
          <div>
            <p className="text-slate-400 text-sm">Actions réalisées</p>
            <p className="text-white font-bold text-lg">{selectedActions.length} / {actions.length}</p>
          </div>
          <div className="text-right">
            <p className="text-slate-400 text-sm">Niveau de transformation</p>
            <p className="text-emerald-400 font-bold text-lg">{transformationLevel}%</p>
          </div>
        </div>

        {/* Continue button */}
        {selectedActions.length >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center"
          >
            <button
              onClick={handleContinue}
              className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl text-white font-bold text-lg shadow-2xl flex items-center gap-3 hover:opacity-90 transition-opacity"
            >
              Voir les résultats
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {selectedActions.length < 3 && (
          <p className="text-center text-slate-400">
            Sélectionne au moins 3 actions pour continuer
          </p>
        )}

        {/* Action detail modal */}
        <AnimatePresence>
          {activeAction && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setActiveAction(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-slate-800 rounded-3xl p-8 max-w-md w-full border border-white/20"
                onClick={e => e.stopPropagation()}
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mb-6">
                  <activeAction.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2">{activeAction.title}</h3>
                <p className="text-slate-400 mb-6">{activeAction.description}</p>

                <div className="mb-6">
                  <h4 className="font-semibold text-white mb-3">Bénéfices :</h4>
                  <div className="space-y-2">
                    {activeAction.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center gap-2 text-slate-300">
                        <Check className="w-4 h-4 text-emerald-400" />
                        {benefit}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action details */}
                <div className="grid grid-cols-3 gap-2 mb-6 p-3 bg-slate-700/50 rounded-xl">
                  <div className="text-center">
                    <Clock className="w-4 h-4 mx-auto mb-1 text-blue-400" />
                    <p className="text-xs text-slate-400">Durée</p>
                    <p className="text-sm text-white font-medium">{activeAction.duration}</p>
                  </div>
                  <div className="text-center">
                    <TrendingDown className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
                    <p className="text-xs text-slate-400">Économies</p>
                    <p className="text-sm text-white font-medium">{activeAction.savings}</p>
                  </div>
                  <div className="text-center">
                    <Zap className="w-4 h-4 mx-auto mb-1 text-amber-400" />
                    <p className="text-xs text-slate-400">Difficulté</p>
                    <p className="text-sm text-white font-medium">{activeAction.difficulty}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setActiveAction(null)}
                    className="flex-1 py-3 bg-white/10 rounded-xl text-white font-medium hover:bg-white/20 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => {
                      handleActionSelect(activeAction);
                      setActiveAction(null);
                    }}
                    className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity"
                  >
                    Appliquer
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Educational resources */}
        {selectedActions.length >= 1 && (
          <ChapterResources 
            resources={chapter3Resources} 
            title="Guides et retours d'expérience"
          />
        )}

        {/* Badge popup */}
        {showBadge && (
          <BadgePopup badge={showBadge} onClose={() => setShowBadge(null)} />
        )}
      </div>
    </div>
  );
}