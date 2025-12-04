import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { createPageUrl } from '@/utils';
import ProgressBar from '@/components/game/ProgressBar.jsx';
import { BadgePopup } from '@/components/game/BadgeDisplay.jsx';
import ChapterResources from '@/components/game/ChapterResources.jsx';
import { Users, Shield, Leaf, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';

const chapter2Resources = [
  {
    type: 'article',
    title: 'L\'accessibilité numérique en milieu scolaire',
    description: 'Guide pratique pour rendre le numérique accessible à tous les élèves, y compris ceux en situation de handicap.',
    url: 'https://accessibilite.numerique.gouv.fr/',
    source: 'DINUM'
  },
  {
    type: 'video',
    title: 'C\'est quoi la souveraineté numérique ?',
    description: 'Explication claire des enjeux de l\'indépendance technologique pour la France et l\'Europe.',
    url: 'https://www.youtube.com/watch?v=souverainete-numerique',
    source: 'Lumni'
  },
  {
    type: 'case_study',
    title: 'La région Île-de-France adopte les logiciels libres',
    description: 'Comment une région a économisé des millions en migrant vers des solutions open source.',
    url: 'https://www.april.org/region-ile-de-france-logiciels-libres',
    source: 'April'
  },
  {
    type: 'article',
    title: 'Impact environnemental du numérique',
    description: 'Analyse complète de l\'empreinte carbone du secteur numérique et solutions pour la réduire.',
    url: 'https://www.greenit.fr/etude-empreinte-environnementale-du-numerique-mondial/',
    source: 'GreenIT.fr'
  },
  {
    type: 'video',
    title: 'Documentaire : Internet, la pollution cachée',
    description: 'Enquête sur l\'impact environnemental méconnu de nos usages numériques quotidiens.',
    url: 'https://www.youtube.com/watch?v=pollution-internet',
    source: 'France 5'
  },
  {
    type: 'infographic',
    title: 'Les 3 piliers NIRD en image',
    description: 'Synthèse visuelle de l\'approche Numérique Inclusif, Responsable et Durable.',
    url: 'https://nird.forge.apps.education.fr/',
    source: 'NIRD',
    keyPoints: [
      'Inclusion : 15% des élèves ont des besoins spécifiques d\'accessibilité',
      'Responsabilité : Le RGPD protège les données des mineurs',
      'Durabilité : Un PC sous Linux peut durer 10 ans au lieu de 4',
      'Les logiciels libres permettent l\'adaptation aux besoins locaux'
    ]
  }
];

const pillars = [
  {
    id: 'inclusion',
    badge: 'pillar-inclusion',
    icon: Users,
    title: 'Inclusion',
    subtitle: 'Numérique accessible à tous',
    color: 'from-orange-400 to-orange-600',
    bgColor: 'bg-orange-500',
    description: 'Un numérique qui ne laisse personne de côté',
    details: [
      'Accessibilité pour tous les handicaps (lecteurs d\'écran, contraste, etc.)',
      'Logiciels adaptés aux besoins de chacun (dyslexie, malvoyance...)',
      'Formation et accompagnement pour tous les niveaux',
      'Réduction de la fracture numérique territoriale et sociale',
      'Interfaces personnalisables selon les besoins'
    ],
    facts: [
      '15% des élèves ont des besoins spécifiques d\'accessibilité',
      'Les logiciels libres permettent de créer des versions adaptées',
      'L\'accessibilité bénéficie à tout le monde, pas seulement aux personnes handicapées'
    ],
    quiz: {
      question: 'Quel est le principal avantage des logiciels libres pour l\'inclusion ?',
      options: [
        { text: 'Ils sont toujours gratuits', correct: false, feedback: 'Pas forcément ! Libre ≠ gratuit, mais ils sont souvent moins chers.' },
        { text: 'Ils peuvent être adaptés aux besoins spécifiques', correct: true, feedback: 'Exact ! Le code source ouvert permet de les modifier pour tous.' },
        { text: 'Ils sont plus beaux', correct: false, feedback: 'L\'esthétique n\'est pas liée au type de licence du logiciel.' },
        { text: 'Ils fonctionnent sans internet', correct: false, feedback: 'Ça dépend du logiciel, pas de sa licence.' }
      ]
    }
  },
  {
    id: 'responsability',
    badge: 'pillar-responsability',
    icon: Shield,
    title: 'Responsabilité',
    subtitle: 'Éthique et transparent',
    color: 'from-blue-400 to-blue-600',
    bgColor: 'bg-blue-500',
    description: 'Des choix numériques éclairés et éthiques',
    details: [
      'Protection des données personnelles (RGPD)',
      'Transparence totale du code source',
      'Indépendance vis-à-vis des GAFAM (Google, Apple, Facebook, Amazon, Microsoft)',
      'Souveraineté numérique française et européenne',
      'Contrôle sur l\'utilisation des données des élèves'
    ],
    facts: [
      'Les données de 12 millions d\'élèves français sont stockées hors UE',
      'Le RGPD impose que les données des mineurs soient particulièrement protégées',
      'Un logiciel open source peut être audité par n\'importe qui pour vérifier sa sécurité'
    ],
    quiz: {
      question: 'Pourquoi est-il important de savoir où sont stockées nos données ?',
      options: [
        { text: 'Pour les retrouver facilement', correct: false, feedback: 'Les données sont sauvegardées automatiquement, ce n\'est pas la raison.' },
        { text: 'Pour respecter la vie privée et les lois (RGPD)', correct: true, feedback: 'Bravo ! Le RGPD protège les données des citoyens européens.' },
        { text: 'Pour impressionner ses amis', correct: false, feedback: 'Ce n\'est pas vraiment un argument pertinent !' },
        { text: 'Parce que c\'est à la mode', correct: false, feedback: 'C\'est une vraie question de droits fondamentaux, pas une mode.' }
      ]
    }
  },
  {
    id: 'durability',
    badge: 'pillar-durability',
    icon: Leaf,
    title: 'Durabilité',
    subtitle: 'Réutiliser, ne pas jeter',
    color: 'from-emerald-400 to-emerald-600',
    bgColor: 'bg-emerald-500',
    description: 'Un numérique qui préserve la planète',
    details: [
      'Prolonger la vie du matériel existant (10 ans au lieu de 4)',
      'Linux fait tourner les vieux PC avec fluidité',
      'Réemploi et reconditionnement du matériel',
      'Sobriété numérique dans les usages quotidiens',
      'Réduction de l\'empreinte carbone du numérique'
    ],
    facts: [
      'Fabriquer un ordinateur émet 200-400 kg de CO2',
      'Le numérique représente 4% des émissions mondiales de gaz à effet de serre',
      'Un PC reconditionné sous Linux peut fonctionner encore 6 ans',
      'L\'obsolescence logicielle force 70% des renouvellements de matériel'
    ],
    quiz: {
      question: 'Comment Linux aide-t-il l\'environnement ?',
      options: [
        { text: 'Il plante des arbres automatiquement', correct: false, feedback: 'Ce serait chouette, mais non !' },
        { text: 'Il permet de réutiliser du matériel ancien', correct: true, feedback: 'Exactement ! Linux est léger et fonctionne sur de vieux ordinateurs.' },
        { text: 'Il consomme plus d\'électricité', correct: false, feedback: 'Au contraire, Linux est souvent plus économe en ressources.' },
        { text: 'Il est fabriqué avec des matériaux recyclés', correct: false, feedback: 'Linux est un logiciel, il n\'est pas fabriqué physiquement.' }
      ]
    }
  }
];

export default function Chapter2() {
  const navigate = useNavigate();
  const [activePillar, setActivePillar] = useState(null);
  const [completedPillars, setCompletedPillars] = useState([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showBadge, setShowBadge] = useState(null);
  const [allComplete, setAllComplete] = useState(false);

  useEffect(() => {
    const progress = JSON.parse(localStorage.getItem('nird-progress') || '{}');
    if (!progress.completed?.includes(1)) {
      navigate(createPageUrl('Chapter1'));
    }
  }, [navigate]);

  const handlePillarClick = (pillar) => {
    setActivePillar(pillar);
    setShowQuiz(false);
    setSelectedAnswer(null);
  };

  const handleAnswer = (option, pillar) => {
    setSelectedAnswer(option);
    
    if (option.correct && !completedPillars.includes(pillar.id)) {
      setTimeout(() => {
        setCompletedPillars(prev => [...prev, pillar.id]);
        
        // Award badge
        const badges = JSON.parse(localStorage.getItem('nird-badges') || '[]');
        if (!badges.includes(pillar.badge)) {
          badges.push(pillar.badge);
          localStorage.setItem('nird-badges', JSON.stringify(badges));
          setShowBadge(pillar.badge);
        }
        
        // Check if all pillars completed
        if (completedPillars.length === 2) {
          setAllComplete(true);
        }
      }, 1000);
    }
  };

  const handleContinue = () => {
    const progress = JSON.parse(localStorage.getItem('nird-progress') || '{}');
    progress.completed = [...(progress.completed || []), 2];
    progress.chapter = 3;
    localStorage.setItem('nird-progress', JSON.stringify(progress));
    navigate(createPageUrl('Chapter3'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <ProgressBar currentChapter={2} completedChapters={[1]} />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Chapter title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 text-blue-400 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Chapitre 2
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">La Découverte NIRD</h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            Découvre les 3 piliers de l'approche NIRD pour un numérique plus responsable
          </p>
        </motion.div>

        {/* NIRD acronym explanation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 px-2"
        >
          <div className="flex flex-wrap items-center justify-center gap-1 text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">
            <span className="text-emerald-400">N</span>
            <span className="text-white/60">umérique</span>
            <span className="text-blue-400 ml-1 sm:ml-2">I</span>
            <span className="text-white/60">nclusif,</span>
            <span className="text-orange-400 ml-1 sm:ml-2">R</span>
            <span className="text-white/60">esponsable et</span>
            <span className="text-emerald-400 ml-1 sm:ml-2">D</span>
            <span className="text-white/60">urable</span>
          </div>
        </motion.div>

        {/* Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {pillars.map((pillar, index) => {
            const isCompleted = completedPillars.includes(pillar.id);
            return (
              <motion.button
                key={pillar.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handlePillarClick(pillar)}
                className={`relative p-4 sm:p-6 rounded-2xl border-2 transition-all text-left touch-manipulation ${
                  isCompleted
                    ? 'bg-gradient-to-br from-slate-800 to-slate-700 border-emerald-500/50'
                    : 'bg-slate-800/50 border-white/10 hover:border-white/20 active:bg-slate-800/70'
                }`}
              >
                {isCompleted && (
                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
                  </div>
                )}
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-r ${pillar.color} flex items-center justify-center mb-3 sm:mb-4`}>
                  <pillar.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-1">{pillar.title}</h3>
                <p className="text-xs sm:text-sm text-slate-400">{pillar.subtitle}</p>
              </motion.button>
            );
          })}
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center gap-2 mb-8">
          {pillars.map(pillar => (
            <div
              key={pillar.id}
              className={`w-3 h-3 rounded-full transition-colors ${
                completedPillars.includes(pillar.id)
                  ? pillar.bgColor
                  : 'bg-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Continue button */}
        {completedPillars.length === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center"
          >
            <button
              onClick={handleContinue}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl text-white font-bold text-base sm:text-lg shadow-2xl flex items-center justify-center gap-3 hover:opacity-90 active:opacity-80 transition-opacity touch-manipulation"
            >
              Passer à l'action !
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {/* Pillar detail modal */}
        <AnimatePresence>
          {activePillar && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
              onClick={() => setActivePillar(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-slate-800 rounded-3xl p-4 sm:p-6 md:p-8 max-w-lg w-full mx-4 border border-white/20 max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
              >
                <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-r ${activePillar.color} flex items-center justify-center mb-4 sm:mb-6`}>
                  <activePillar.icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{activePillar.title}</h3>
                <p className="text-sm sm:text-base text-slate-400 mb-4 sm:mb-6">{activePillar.description}</p>

                {!showQuiz ? (
                  <>
                    <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                      {activePillar.details.map((detail, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-slate-300"
                        >
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span>{detail}</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Facts section */}
                    {activePillar.facts && (
                      <div className="mb-6 p-4 bg-slate-700/50 rounded-xl">
                        <h4 className="text-sm font-semibold text-amber-400 mb-3 flex items-center gap-2">
                          <Sparkles className="w-4 h-4" />
                          Le savais-tu ?
                        </h4>
                        <div className="space-y-2">
                          {activePillar.facts.map((fact, i) => (
                            <p key={i} className="text-sm text-slate-400 flex items-start gap-2">
                              <span className="text-amber-400">•</span>
                              {fact}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {!completedPillars.includes(activePillar.id) && (
                      <button
                        onClick={() => setShowQuiz(true)}
                        className={`w-full py-3 sm:py-4 bg-gradient-to-r ${activePillar.color} rounded-xl text-white font-semibold text-base sm:text-lg hover:opacity-90 transition-opacity touch-manipulation`}
                      >
                        Tester mes connaissances
                      </button>
                    )}
                  </>
                ) : (
                  <div>
                    <h4 className="text-base sm:text-lg font-semibold text-white mb-4 sm:mb-6">{activePillar.quiz.question}</h4>
                    <div className="space-y-2 sm:space-y-3">
                      {activePillar.quiz.options.map((option, i) => (
                        <button
                          key={i}
                          onClick={() => handleAnswer(option, activePillar)}
                          disabled={selectedAnswer !== null}
                          className={`w-full p-3 sm:p-4 rounded-xl text-left transition-all touch-manipulation min-h-[60px] sm:min-h-[auto] ${
                            selectedAnswer === option
                              ? option.correct
                                ? 'bg-emerald-500/20 border-2 border-emerald-500'
                                : 'bg-red-500/20 border-2 border-red-500'
                              : selectedAnswer !== null && option.correct
                              ? 'bg-emerald-500/20 border-2 border-emerald-500'
                              : 'bg-slate-700/50 border-2 border-transparent hover:border-white/20 active:bg-slate-700/70'
                          }`}
                        >
                          <span className={`text-sm sm:text-base ${selectedAnswer === option 
                            ? option.correct ? 'text-emerald-400' : 'text-red-400'
                            : 'text-white'
                          }`}>
                            {option.text}
                          </span>
                        </button>
                      ))}
                    </div>
                    
                    {/* Feedback on answer */}
                    {selectedAnswer && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mt-4 sm:mt-6 p-3 sm:p-4 rounded-xl ${
                          selectedAnswer.correct 
                            ? 'bg-emerald-500/20 text-emerald-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        <p className="text-base sm:text-lg font-medium mb-1 sm:mb-2">
                          {selectedAnswer.correct ? '🎉 Bravo !' : '❌ Pas tout à fait...'}
                        </p>
                        <p className="text-sm sm:text-base opacity-90">{selectedAnswer.feedback}</p>
                        {selectedAnswer.correct && (
                          <p className="mt-2 sm:mt-3 text-sm sm:text-base">Tu as compris le pilier {activePillar.title} !</p>
                        )}
                      </motion.div>
                    )}
                  </div>
                )}

                <button
                  onClick={() => setActivePillar(null)}
                  className="w-full mt-4 sm:mt-6 py-3 sm:py-4 bg-white/10 rounded-xl text-white font-medium text-base sm:text-lg hover:bg-white/20 active:bg-white/30 transition-colors touch-manipulation"
                >
                  Fermer
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Educational resources */}
        {completedPillars.length > 0 && (
          <ChapterResources 
            resources={chapter2Resources} 
            title="Ressources sur l'approche NIRD"
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