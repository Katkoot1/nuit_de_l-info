import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { createPageUrl } from '@/utils';
import ProgressBar from '@/components/game/ProgressBar.jsx';
import SchoolView from '@/components/game/SchoolView.jsx';
import { BadgePopup } from '@/components/game/BadgeDisplay.jsx';
import ChapterResources from '@/components/game/ChapterResources.jsx';
import { Scan, AlertTriangle, CheckCircle, ArrowRight, Zap, Server, FileText, Cloud, Euro, Lock } from 'lucide-react';

const chapter1Resources = [
  {
    type: 'article',
    title: 'Bruay-la-Buissière : Voyage au centre du libre éducatif',
    description: 'Article du Café Pédagogique sur le projet NIRD au lycée Carnot et la lutte contre l\'obsolescence programmée.',
    url: 'https://www.cafepedagogique.net/2025/04/27/bruay-labuissiere-voyage-au-centre-du-libre-educatif/',
    source: 'Café Pédagogique'
  },
  {
    type: 'video',
    title: 'Windows 11 : l\'alternative des logiciels libres',
    description: 'Reportage France 3 Alpes (octobre 2025) sur les solutions libres face à l\'obsolescence programmée.',
    url: 'https://video.echirolles.fr/w/hVykGUtRZqRen6eiutqRvQ',
    source: 'France 3 Alpes'
  },
  {
    type: 'audio',
    title: 'Mises à jour de Windows : face à l\'obsolescence programmée, le logiciel libre comme solution ?',
    description: 'Grand reportage de France Inter (octobre 2025) sur l\'obsolescence programmée et les alternatives libres.',
    url: 'https://www.radiofrance.fr/franceinter/podcasts/le-grand-reportage-de-france-inter/le-grand-reportage-du-mardi-14-octobre-2025-4136495',
    source: 'France Inter'
  },
  {
    type: 'video',
    title: 'Logiciel obsolète : l\'État obligé de jeter des milliers d\'ordinateurs ?',
    description: 'Reportage France Info (septembre 2025) sur les conséquences de l\'obsolescence programmée dans le secteur public.',
    url: 'https://www.youtube.com/watch?v=76T8oubek-c',
    source: 'France Info'
  },
  {
    type: 'video',
    title: 'Linux, c\'est facile ! - Intervention des élèves du lycée Carnot',
    description: 'Captation vidéo d\'une intervention des élèves du lycée Carnot présentant Linux (5 min).',
    url: 'https://tube-numerique-educatif.apps.education.fr/w/3LXem3XK4asbwZa5R1qGkW',
    source: 'Lycée Carnot'
  },
  {
    type: 'video',
    title: 'Le projet NIRD présenté par les élèves du lycée Carnot',
    description: 'Vidéo de présentation du projet NIRD par les élèves du lycée Carnot (4 min).',
    url: 'https://tube-numerique-educatif.apps.education.fr/w/pZCnzPKTYX2iF38Qh4ZGmq',
    source: 'Lycée Carnot'
  },
  {
    type: 'article',
    title: 'RGPD et données scolaires : les enjeux',
    description: 'Comprendre les risques liés au stockage des données des élèves hors UE.',
    url: 'https://www.cnil.fr/fr/education',
    source: 'CNIL'
  },
  {
    type: 'infographic',
    title: 'Infographie : Coûts cachés du numérique propriétaire',
    description: 'Visualisation des dépenses annuelles en licences dans l\'éducation nationale.',
    url: 'https://nird.forge.apps.education.fr/',
    source: 'NIRD',
    keyPoints: [
      'Les licences Microsoft coûtent en moyenne 50€/poste/an',
      '80% des établissements dépendent d\'un seul fournisseur',
      'Le matériel est renouvelé tous les 4 ans en moyenne',
      'Les données de 12 millions d\'élèves sont stockées hors UE'
    ]
  }
];

const problems = [
  {
    id: 'obsolete',
    icon: Server,
    title: 'Matériel obsolète',
    description: 'Des ordinateurs rendus obsolètes par les mises à jour forcées, alors qu\'ils fonctionnent encore parfaitement',
    details: [
      'Windows 11 refuse de s\'installer sur 60% des PC de moins de 5 ans',
      'Les mises à jour rendent les machines plus lentes',
      'Obsolescence programmée par le logiciel, pas le matériel'
    ],
    impact: '70% des PC jetés pourraient encore fonctionner',
    color: 'from-red-500 to-orange-500',
    position: { x: 20, y: 30 }
  },
  {
    id: 'licenses',
    icon: Euro,
    title: 'Licences coûteuses',
    description: 'Des milliers d\'euros dépensés chaque année en licences propriétaires',
    details: [
      'Microsoft 365 : 50-100€/utilisateur/an',
      'Adobe Creative Cloud : 600€/poste/an',
      'Coût total pour un lycée : 15 000-50 000€/an'
    ],
    impact: 'Budget qui pourrait financer du matériel ou des projets',
    color: 'from-amber-500 to-yellow-500',
    position: { x: 70, y: 25 }
  },
  {
    id: 'data',
    icon: Cloud,
    title: 'Données hors UE',
    description: 'Les données des élèves stockées sur des serveurs américains soumis au Cloud Act',
    details: [
      'Google et Microsoft peuvent accéder aux données sur demande du gouvernement US',
      'Non-conformité potentielle avec le RGPD',
      '12 millions d\'élèves français concernés'
    ],
    impact: 'Violation de la vie privée des mineurs',
    color: 'from-purple-500 to-pink-500',
    position: { x: 15, y: 60 }
  },
  {
    id: 'ecosystem',
    icon: Lock,
    title: 'Écosystème fermé',
    description: 'Dépendance totale à un seul fournisseur (vendor lock-in)',
    details: [
      'Formats de fichiers propriétaires difficiles à migrer',
      'Compétences liées à un seul éditeur',
      'Négociation impossible sur les prix'
    ],
    impact: 'Perte d\'autonomie et de liberté de choix',
    color: 'from-blue-500 to-cyan-500',
    position: { x: 65, y: 55 }
  },
  {
    id: 'subscriptions',
    icon: FileText,
    title: 'Abonnements obligatoires',
    description: 'Des services indispensables qui nécessitent des abonnements permanents et croissants',
    details: [
      'Fin des licences perpétuelles (achat unique)',
      'Prix qui augmentent chaque année',
      'Fonctionnalités retirées pour pousser à l\'upgrade'
    ],
    impact: 'Dépenses récurrentes sans fin',
    color: 'from-emerald-500 to-teal-500',
    position: { x: 40, y: 75 }
  },
  {
    id: 'environment',
    icon: AlertTriangle,
    title: 'Impact environnemental',
    description: 'Le numérique représente 4% des émissions mondiales de CO2, en croissance de 9%/an',
    details: [
      'Fabrication d\'un PC : 200-400 kg de CO2',
      'Renouvellement tous les 4 ans en moyenne',
      'Déchets électroniques : 50 millions de tonnes/an'
    ],
    impact: 'Urgence climatique ignorée',
    color: 'from-rose-500 to-red-500',
    position: { x: 45, y: 40 }
  }
];

export default function Chapter1() {
  const navigate = useNavigate();
  const [scanProgress, setScanProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [foundProblems, setFoundProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [showBadge, setShowBadge] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [character, setCharacter] = useState(null);

  useEffect(() => {
    const savedCharacter = localStorage.getItem('nird-character');
    if (savedCharacter) {
      setCharacter(savedCharacter);
    }
  }, []);

  const startScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    setFoundProblems([]);
    
    const discoveredProblemIds = new Set();
    const problemThresholds = [12, 28, 44, 60, 76, 90];
    let currentProgress = 0;
    
    const interval = setInterval(() => {
      currentProgress += 2;
      setScanProgress(currentProgress);
      
      // Discover problems at certain thresholds
      problemThresholds.forEach((threshold, index) => {
        // Check if we just crossed this threshold
        const prevProgress = currentProgress - 2;
        if (prevProgress < threshold && currentProgress >= threshold && index < problems.length) {
          const problem = problems[index];
          // Only add if not already discovered
          if (!discoveredProblemIds.has(problem.id)) {
            discoveredProblemIds.add(problem.id);
            setFoundProblems(fp => {
              // Double check to avoid duplicates in state
              if (fp.some(p => p.id === problem.id)) {
                return fp;
              }
              return [...fp, problem];
            });
          }
        }
      });
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        setScanProgress(100);
        setIsScanning(false);
        setScanComplete(true);
        
        // Award badge
        const badges = JSON.parse(localStorage.getItem('nird-badges') || '[]');
        if (!badges.includes('scanner')) {
          badges.push('scanner');
          localStorage.setItem('nird-badges', JSON.stringify(badges));
          setTimeout(() => setShowBadge(true), 500);
        }
      }
    }, 100);
  };

  const handleContinue = () => {
    const progress = JSON.parse(localStorage.getItem('nird-progress') || '{}');
    progress.completed = [...(progress.completed || []), 1];
    progress.chapter = 2;
    localStorage.setItem('nird-progress', JSON.stringify(progress));
    navigate(createPageUrl('Chapter2'));
  };

  const characterMessages = {
    student: "En tant qu'éco-délégué·e, tu vas scanner ton établissement pour identifier les problèmes numériques !",
    teacher: "Découvre les dépendances technologiques qui impactent ton enseignement au quotidien.",
    director: "Analyse les coûts cachés et les risques de l'infrastructure actuelle de ton établissement.",
    technician: "Identifie les points de friction techniques et les solutions alternatives possibles."
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <ProgressBar currentChapter={1} completedChapters={[]} />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Chapter title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/20 text-orange-400 text-sm font-medium mb-4">
            <Scan className="w-4 h-4" />
            Chapitre 1
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Le Diagnostic</h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            {character && characterMessages[character]}
          </p>
        </motion.div>

        {/* Scanner interface */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative bg-slate-800/50 rounded-3xl border border-white/10 overflow-hidden mb-8"
        >
          {/* School visualization with scan overlay */}
          <div className="relative">
            <SchoolView transformationLevel={0} className="opacity-80" />
            
            {/* Scan line animation */}
            {isScanning && (
              <motion.div
                className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent"
                initial={{ top: 0 }}
                animate={{ top: '100%' }}
                transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
              />
            )}

            {/* Problem markers */}
            <AnimatePresence>
              {foundProblems.map((problem) => (
                <motion.button
                  key={`marker-${problem.id}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  onClick={() => setSelectedProblem(problem)}
                  className="absolute"
                  style={{ left: `${problem.position.x}%`, top: `${problem.position.y}%` }}
                >
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${problem.color} flex items-center justify-center shadow-lg animate-pulse`}>
                    <problem.icon className="w-5 h-5 text-white" />
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>

          {/* Scan progress bar */}
          <div className="p-6 border-t border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">Progression du scan</span>
              <span className="text-sm font-mono text-emerald-400">{scanProgress}%</span>
            </div>
            <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-500 to-blue-500"
                initial={{ width: 0 }}
                animate={{ width: `${scanProgress}%` }}
              />
            </div>
          </div>
        </motion.div>

        {/* Action buttons */}
        <div className="flex flex-col items-center gap-4 mb-8">
          {!isScanning && !scanComplete && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startScan}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl text-white font-bold text-base sm:text-lg shadow-2xl shadow-emerald-500/25 flex items-center justify-center gap-3 touch-manipulation"
            >
              <Scan className="w-5 h-5" />
              Lancer le diagnostic
            </motion.button>
          )}

          {isScanning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3 text-slate-400"
            >
              <Zap className="w-5 h-5 animate-pulse text-emerald-400" />
              Analyse en cours... Clique sur les problèmes détectés !
            </motion.div>
          )}

          {scanComplete && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleContinue}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl text-white font-bold text-base sm:text-lg shadow-2xl flex items-center justify-center gap-3 touch-manipulation"
            >
              Découvrir la solution NIRD
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          )}
        </div>

        {/* Found problems list */}
        {foundProblems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-2 sm:gap-3"
          >
            <h2 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
              Problèmes identifiés ({foundProblems.length}/{problems.length})
            </h2>
            {foundProblems.map((problem, index) => (
              <motion.div
                key={`list-${problem.id}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedProblem(problem)}
                className={`p-3 sm:p-4 rounded-xl bg-gradient-to-r ${problem.color} bg-opacity-10 border border-white/10 cursor-pointer hover:border-white/20 active:bg-opacity-20 transition-colors touch-manipulation`}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-r ${problem.color} flex items-center justify-center flex-shrink-0`}>
                    <problem.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm sm:text-base font-semibold text-white">{problem.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-400 line-clamp-2">{problem.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Problem detail modal */}
        <AnimatePresence>
          {selectedProblem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
              onClick={() => setSelectedProblem(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-slate-800 rounded-2xl p-4 sm:p-6 max-w-md w-full mx-4 border border-white/20 max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
              >
                <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-r ${selectedProblem.color} flex items-center justify-center mb-3 sm:mb-4`}>
                  <selectedProblem.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{selectedProblem.title}</h3>
                <p className="text-sm sm:text-base text-slate-400 mb-3 sm:mb-4">{selectedProblem.description}</p>

                {/* Problem details */}
                {selectedProblem.details && (
                  <div className="mb-3 sm:mb-4 space-y-2">
                    {selectedProblem.details.map((detail, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
                        <span className="text-red-400 mt-1">•</span>
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Impact highlight */}
                {selectedProblem.impact && (
                  <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
                    <p className="text-sm text-red-400 font-medium flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      {selectedProblem.impact}
                    </p>
                  </div>
                )}

                <button
                  onClick={() => setSelectedProblem(null)}
                  className="w-full py-3 sm:py-4 bg-white/10 rounded-xl text-white font-medium text-base sm:text-lg hover:bg-white/20 active:bg-white/30 transition-colors touch-manipulation"
                >
                  Compris !
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Educational resources */}
        {scanComplete && (
          <ChapterResources 
            resources={chapter1Resources} 
            title="Ressources pour approfondir le diagnostic"
          />
        )}

        {/* Badge popup */}
        {showBadge && (
          <BadgePopup badge="scanner" onClose={() => setShowBadge(false)} />
        )}
      </div>
    </div>
  );
}