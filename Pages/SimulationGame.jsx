import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { createPageUrl } from '@/utils';
import { 
  ArrowLeft, ArrowRight, Zap, Target, TrendingUp, AlertTriangle,
  CheckCircle, XCircle, Clock, Euro, Leaf, Shield, Users, Server,
  Building2, Lightbulb, BarChart3, Award, Star, UserPlus, Sparkles, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { addPoints, POINTS_CONFIG, awardBadge, LevelUpPopup } from '@/components/game/GamificationSystem.jsx';
import { BadgePopup } from '@/components/game/BadgeDisplay.jsx';
import MultiplayerSetup from '@/components/multiplayer/MultiplayerSetup.jsx';
import MultiplayerLobby from '@/components/multiplayer/MultiplayerLobby.jsx';
import MultiplayerResults from '@/components/multiplayer/MultiplayerResults.jsx';
import { AIAdvisor, AIStrategyAnalysis, generateDynamicScenario } from '@/components/ai/SimulationAI.jsx';
import { updateSimulationStats, checkAndAwardSimulationBadges } from '@/components/game/SimulationBadges.jsx';
import RandomEventModal, { getRandomEvent } from '@/components/game/RandomEvents.jsx';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';

// Scénarios de simulation réalistes
const scenarios = [
  {
    id: 'budget-crisis',
    title: 'Crise budgétaire',
    context: 'Votre établissement fait face à une réduction de 20% du budget informatique. Le renouvellement des licences Microsoft représente 45 000€/an.',
    image: '📊',
    bgGradient: 'from-red-900/50 to-orange-900/50',
    decisions: [
      {
        id: 'keep-microsoft',
        title: 'Maintenir Microsoft',
        description: 'Négocier une réduction avec Microsoft et réduire les postes',
        consequences: {
          budget: -35000,
          satisfaction: -15,
          autonomy: 0,
          ecology: 0,
          message: 'Budget serré, 15 postes supprimés. Dépendance maintenue.'
        },
        icon: Server
      },
      {
        id: 'hybrid',
        title: 'Solution hybride',
        description: 'Migrer 50% vers LibreOffice, garder Microsoft pour les formations',
        consequences: {
          budget: -18000,
          satisfaction: 5,
          autonomy: 25,
          ecology: 15,
          message: 'Économie de 27 000€. Transition progressive acceptée.'
        },
        icon: Users
      },
      {
        id: 'full-libre',
        title: 'Migration complète',
        description: 'Passer à 100% logiciels libres avec formation intensive',
        consequences: {
          budget: -5000,
          satisfaction: -5,
          autonomy: 60,
          ecology: 40,
          message: 'Économie de 40 000€. Résistance initiale, puis adoption.'
        },
        icon: Lightbulb
      }
    ]
  },
  {
    id: 'data-breach',
    title: 'Alerte RGPD',
    context: 'La CNIL vous informe que les données de vos étudiants stockées sur Google Workspace sont potentiellement accessibles aux autorités américaines (Cloud Act).',
    image: '🔒',
    bgGradient: 'from-purple-900/50 to-blue-900/50',
    decisions: [
      {
        id: 'ignore',
        title: 'Minimiser le risque',
        description: 'Continuer avec Google en signant un DPA renforcé',
        consequences: {
          budget: -2000,
          satisfaction: 0,
          autonomy: -10,
          ecology: 0,
          risk: 40,
          message: 'Risque juridique maintenu. Amende potentielle de 4% du budget.'
        },
        icon: AlertTriangle
      },
      {
        id: 'nextcloud',
        title: 'Migrer vers Nextcloud',
        description: 'Héberger les données en France sur serveur souverain',
        consequences: {
          budget: -8000,
          satisfaction: 10,
          autonomy: 50,
          ecology: 20,
          risk: 0,
          message: 'Conformité RGPD totale. Données sous contrôle français.'
        },
        icon: Shield
      },
      {
        id: 'education-nationale',
        title: 'Apps Education',
        description: 'Utiliser les outils de l\'Éducation Nationale (Portail Apps)',
        consequences: {
          budget: 0,
          satisfaction: 5,
          autonomy: 40,
          ecology: 15,
          risk: 0,
          message: 'Solution gratuite et souveraine. Intégration simplifiée.'
        },
        icon: Building2
      }
    ]
  },
  {
    id: 'hardware-obsolescence',
    title: 'Obsolescence programmée',
    context: 'Windows 11 refuse de s\'installer sur 120 PC de moins de 5 ans. Le fournisseur propose un renouvellement complet pour 180 000€.',
    image: '💻',
    bgGradient: 'from-amber-900/50 to-red-900/50',
    decisions: [
      {
        id: 'renew-all',
        title: 'Renouveler le parc',
        description: 'Acheter 120 nouveaux PC compatibles Windows 11',
        consequences: {
          budget: -180000,
          satisfaction: 15,
          autonomy: 0,
          ecology: -60,
          message: '24 tonnes de CO2 émises. Budget épuisé pour 3 ans.'
        },
        icon: Server
      },
      {
        id: 'linux-migration',
        title: 'Installer Linux',
        description: 'Migrer vers Linux Mint/Ubuntu sur le matériel existant',
        consequences: {
          budget: -3000,
          satisfaction: 5,
          autonomy: 70,
          ecology: 60,
          message: 'PC fonctionnels pour 6 ans de plus. 24 tonnes CO2 évitées.'
        },
        icon: Leaf
      },
      {
        id: 'reconditioned',
        title: 'Matériel reconditionné',
        description: 'Acheter 60 PC reconditionnés + Linux sur les anciens',
        consequences: {
          budget: -25000,
          satisfaction: 10,
          autonomy: 50,
          ecology: 45,
          message: 'Économie de 155 000€. Impact environnemental divisé par 4.'
        },
        icon: TrendingUp
      }
    ]
  },
  {
    id: 'student-accessibility',
    title: 'Inclusion numérique',
    context: '15% de vos étudiants ont des besoins spécifiques (dyslexie, malvoyance, handicap moteur). Les outils actuels ne sont pas adaptés.',
    image: '♿',
    bgGradient: 'from-blue-900/50 to-cyan-900/50',
    decisions: [
      {
        id: 'buy-licenses',
        title: 'Licences spécialisées',
        description: 'Acheter des logiciels propriétaires d\'accessibilité',
        consequences: {
          budget: -25000,
          satisfaction: 20,
          autonomy: -5,
          ecology: 0,
          message: 'Solutions efficaces mais coûteuses et fermées.'
        },
        icon: Euro
      },
      {
        id: 'open-source-access',
        title: 'Solutions libres',
        description: 'Déployer NVDA, OpenDyslexic, Orca et personnaliser Linux',
        consequences: {
          budget: -2000,
          satisfaction: 25,
          autonomy: 45,
          ecology: 10,
          message: 'Accessibilité totale. Code adaptable aux besoins futurs.'
        },
        icon: Users
      },
      {
        id: 'mixed',
        title: 'Approche mixte',
        description: 'Base libre + quelques licences spécifiques si nécessaire',
        consequences: {
          budget: -8000,
          satisfaction: 30,
          autonomy: 30,
          ecology: 5,
          message: 'Meilleur compromis. Flexibilité maximale.'
        },
        icon: Lightbulb
      }
    ]
  },
  {
    id: 'cyber-attack',
    title: 'Cyberattaque',
    context: 'Un ransomware a chiffré 40% de vos données. Les pirates demandent 50 000€ en Bitcoin. Vos sauvegardes sur OneDrive sont aussi touchées.',
    image: '🔐',
    bgGradient: 'from-red-900/50 to-black',
    decisions: [
      {
        id: 'pay-ransom',
        title: 'Payer la rançon',
        description: 'Payer et espérer récupérer les données',
        consequences: {
          budget: -50000,
          satisfaction: -30,
          autonomy: -20,
          ecology: 0,
          risk: 60,
          message: 'Données partiellement récupérées. Vous êtes maintenant une cible connue.'
        },
        icon: AlertTriangle
      },
      {
        id: 'rebuild-secure',
        title: 'Reconstruire + Sécuriser',
        description: 'Restaurer depuis zéro avec infrastructure sécurisée et décentralisée',
        consequences: {
          budget: -15000,
          satisfaction: -10,
          autonomy: 40,
          ecology: 20,
          risk: -30,
          message: '3 semaines de perturbation, mais infrastructure résiliente.'
        },
        icon: Shield
      },
      {
        id: 'sovereign-backup',
        title: 'Migration souveraine',
        description: 'Reconstruire avec backup local + Nextcloud + chiffrement',
        consequences: {
          budget: -20000,
          satisfaction: 0,
          autonomy: 60,
          ecology: 25,
          risk: -50,
          message: 'Plus jamais dépendant d\'un cloud étranger. Résilience maximale.'
        },
        icon: Building2
      }
    ]
  }
];

export default function SimulationGame() {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState('intro'); // intro, multiplayer-setup, multiplayer-lobby, playing, results, multiplayer-results
  const [currentScenario, setCurrentScenario] = useState(0);
  const [decisions, setDecisions] = useState([]);
  const [scores, setScores] = useState({
    budget: 100000,
    satisfaction: 50,
    autonomy: 20,
    ecology: 30,
    risk: 50
  });
  const [showConsequence, setShowConsequence] = useState(null);
  const [levelUpInfo, setLevelUpInfo] = useState(null);
  const [showBadge, setShowBadge] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [timerActive, setTimerActive] = useState(false);
  
  // Multiplayer state
  const [multiplayerSession, setMultiplayerSession] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [gameStartTime, setGameStartTime] = useState(null);
  
  // AI state
  const [dynamicScenarios, setDynamicScenarios] = useState([]);
  const [isGeneratingScenario, setIsGeneratingScenario] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(true);
  
  // Random events state
  const [currentEvent, setCurrentEvent] = useState(null);
  const [triggeredEvents, setTriggeredEvents] = useState([]);

  const saveResultMutation = useMutation({
    mutationFn: (data) => base44.entities.PlayerResult.create(data)
  });

  const saveScoreMutation = useMutation({
    mutationFn: (data) => base44.entities.SimulationScore.create(data)
  });

  // Get current scenario (from base or dynamic)
  const allScenarios = [...scenarios, ...dynamicScenarios];
  const scenario = allScenarios[currentScenario];

  // Timer pour chaque décision
  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && timerActive) {
      // Temps écoulé - choix aléatoire
      const scenario = scenarios[currentScenario];
      const randomDecision = scenario.decisions[Math.floor(Math.random() * scenario.decisions.length)];
      handleDecision(randomDecision);
    }
  }, [timerActive, timeLeft]);

  const startGame = () => {
    setGameState('playing');
    setTimerActive(true);
    setTimeLeft(60);
    setGameStartTime(Date.now());
  };

  const handleMultiplayerSessionReady = (session, name, host) => {
    setMultiplayerSession(session);
    setPlayerName(name);
    setIsHost(host);
    setGameState('multiplayer-lobby');
  };

  const handleMultiplayerStart = () => {
    setGameState('playing');
    setTimerActive(true);
    setTimeLeft(60);
    setGameStartTime(Date.now());
  };

  const handleLeaveSession = async () => {
    if (multiplayerSession && playerName) {
      try {
        const updatedPlayers = multiplayerSession.players.filter(p => p.name !== playerName);
        if (updatedPlayers.length === 0) {
          await base44.entities.MultiplayerSession.delete(multiplayerSession.id);
        } else {
          await base44.entities.MultiplayerSession.update(multiplayerSession.id, { 
            players: updatedPlayers,
            host_name: updatedPlayers[0]?.name || multiplayerSession.host_name
          });
        }
      } catch (err) {
        console.error('Error leaving session:', err);
      }
    }
    setMultiplayerSession(null);
    setPlayerName('');
    setIsHost(false);
    setGameState('intro');
  };

  const handleDecision = (decision) => {
    setTimerActive(false);
    setShowConsequence(decision);
    
    // Appliquer les conséquences
    setScores(prev => ({
      budget: Math.max(0, prev.budget + (decision.consequences.budget || 0)),
      satisfaction: Math.min(100, Math.max(0, prev.satisfaction + (decision.consequences.satisfaction || 0))),
      autonomy: Math.min(100, Math.max(0, prev.autonomy + (decision.consequences.autonomy || 0))),
      ecology: Math.min(100, Math.max(0, prev.ecology + (decision.consequences.ecology || 0)))
    }));

    setDecisions(prev => [...prev, { scenario: currentScenario, decision: decision.id }]);
  };

  // Handle random event choice
  const handleEventChoice = (choice) => {
    // Apply event effects
    setScores(prev => ({
      budget: Math.max(0, prev.budget + (choice.effects.budget || 0)),
      satisfaction: Math.min(100, Math.max(0, prev.satisfaction + (choice.effects.satisfaction || 0))),
      autonomy: Math.min(100, Math.max(0, prev.autonomy + (choice.effects.autonomy || 0))),
      ecology: Math.min(100, Math.max(0, prev.ecology + (choice.effects.ecology || 0)))
    }));
    setCurrentEvent(null);
    // Resume timer
    setTimerActive(true);
  };

  // Check for random event (30% chance between scenarios)
  const checkForRandomEvent = () => {
    if (Math.random() < 0.35 && triggeredEvents.length < 3) {
      const event = getRandomEvent(triggeredEvents);
      if (event) {
        setTriggeredEvents(prev => [...prev, event.id]);
        setCurrentEvent(event);
        setTimerActive(false); // Pause timer during event
        return true;
      }
    }
    return false;
  };

  const nextScenario = async () => {
    setShowConsequence(null);
    
    // Check for random event before proceeding
    if (checkForRandomEvent()) {
      return; // Event modal will handle resuming
    }
    
    const totalScenarios = scenarios.length + dynamicScenarios.length;
    
    if (currentScenario < totalScenarios - 1) {
      setCurrentScenario(prev => prev + 1);
      setTimeLeft(60);
      setTimerActive(true);
    } else if (aiEnabled && dynamicScenarios.length < 2) {
      // Generate a dynamic AI scenario after base scenarios
      setIsGeneratingScenario(true);
      try {
        const newScenario = await generateDynamicScenario(decisions, scores);
        if (newScenario && newScenario.title) {
          // Add icon component to decisions
          const iconMap = { Server, Users, Lightbulb, Shield, Leaf, Euro, Building2, AlertTriangle, Target };
          newScenario.decisions = newScenario.decisions.map((d, i) => ({
            ...d,
            icon: [Lightbulb, Shield, Users][i] || Lightbulb
          }));
          setDynamicScenarios(prev => [...prev, newScenario]);
          setCurrentScenario(prev => prev + 1);
          setTimeLeft(60);
          setTimerActive(true);
        } else {
          setGameState('results');
          calculateFinalScore();
        }
      } catch (err) {
        console.error('Error generating scenario:', err);
        setGameState('results');
        calculateFinalScore();
      }
      setIsGeneratingScenario(false);
    } else {
      // Fin du jeu
      setGameState('results');
      calculateFinalScore();
    }
  };

  const calculateFinalScore = () => {
    const totalScore = Math.round(
      (scores.satisfaction + scores.autonomy + scores.ecology) / 3 +
      (scores.budget / 2000)
    );
    
    const gameDuration = gameStartTime ? Math.round((Date.now() - gameStartTime) / 1000) : 300;
    
    // Attribuer des points
    const result = addPoints(totalScore * 2, 'Simulation NIRD terminée');
    if (result.levelUp) {
      setTimeout(() => setLevelUpInfo(result.newLevel), 500);
    }

    // Badges selon performance
    if (scores.autonomy >= 60) {
      const awarded = awardBadge('autonomy');
      if (awarded) setTimeout(() => setShowBadge('autonomy'), 1000);
    }
    if (scores.ecology >= 50) {
      const awarded = awardBadge('eco-champion');
      if (awarded) setTimeout(() => setShowBadge('eco-champion'), 1500);
    }

    // Update simulation stats and check for simulation badges
    const gameResult = {
      ecology: scores.ecology,
      autonomy: scores.autonomy,
      satisfaction: scores.satisfaction,
      budget: Math.round(scores.budget / 1000),
      totalScore: totalScore,
      duration: gameDuration,
      aiScenarios: dynamicScenarios.length
    };
    
    const updatedStats = updateSimulationStats(gameResult);
    const newBadges = checkAndAwardSimulationBadges(updatedStats);
    if (newBadges.length > 0) {
      setTimeout(() => setShowBadge(newBadges[0]), 2000);
    }

    // Save to leaderboard
    const storedName = localStorage.getItem('nird-player-name') || playerName || 'Joueur';
    saveScoreMutation.mutate({
      player_name: storedName,
      total_score: totalScore,
      budget_score: Math.round(scores.budget / 1000),
      satisfaction_score: scores.satisfaction,
      autonomy_score: scores.autonomy,
      ecology_score: scores.ecology,
      scenarios_completed: allScenarios.length,
      ai_scenarios_completed: dynamicScenarios.length,
      play_duration: gameDuration
    });

    // Sauvegarder progression
    const progress = JSON.parse(localStorage.getItem('nird-progress') || '{}');
    progress.simulationCompleted = true;
    progress.simulationScores = scores;
    progress.transformationLevel = Math.round((scores.autonomy + scores.ecology) / 2);
    localStorage.setItem('nird-progress', JSON.stringify(progress));

    // Save multiplayer result if in multiplayer mode
    if (multiplayerSession) {
      const completionTime = Math.round((Date.now() - gameStartTime) / 1000);
      saveResultMutation.mutate({
        session_id: multiplayerSession.id,
        player_name: playerName,
        scores: {
          budget: Math.round(scores.budget / 1000),
          satisfaction: scores.satisfaction,
          autonomy: scores.autonomy,
          ecology: scores.ecology,
          risk: scores.risk || 50
        },
        decisions: decisions,
        total_score: totalScore,
        completion_time: completionTime
      });
      setGameState('multiplayer-results');
    }
  };

  const restartGame = () => {
    setGameState('intro');
    setCurrentScenario(0);
    setDecisions([]);
    setScores({ budget: 100000, satisfaction: 50, autonomy: 20, ecology: 30, risk: 50 });
    setShowConsequence(null);
    setTimeLeft(60);
    setTimerActive(false);
    setMultiplayerSession(null);
    setPlayerName('');
    setIsHost(false);
    setGameStartTime(null);
    setDynamicScenarios([]);
    setCurrentEvent(null);
    setTriggeredEvents([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to={createPageUrl('Home')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Accueil</span>
            </Link>
            <h1 className="text-xl font-bold text-white">Simulation NIRD</h1>
            <div className="w-20" />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {/* INTRO */}
          {gameState === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-8xl mb-8"
              >
                🏛️
              </motion.div>
              
              <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 mb-4">
                Directeur·rice Numérique
              </h1>
              <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                Vous prenez la direction du numérique d'un établissement de 2000 personnes. 
                Vos décisions façonneront son avenir pour les 5 prochaines années.
              </p>

              {/* Stats initiales */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-12">
                <div className="bg-slate-800/50 rounded-2xl p-4 border border-white/10">
                  <Euro className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">100K€</p>
                  <p className="text-xs text-slate-400">Budget annuel</p>
                </div>
                <div className="bg-slate-800/50 rounded-2xl p-4 border border-white/10">
                  <Users className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">50%</p>
                  <p className="text-xs text-slate-400">Satisfaction</p>
                </div>
                <div className="bg-slate-800/50 rounded-2xl p-4 border border-white/10">
                  <Shield className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">20%</p>
                  <p className="text-xs text-slate-400">Autonomie</p>
                </div>
                <div className="bg-slate-800/50 rounded-2xl p-4 border border-white/10">
                  <Leaf className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">30%</p>
                  <p className="text-xs text-slate-400">Écologie</p>
                </div>
              </div>

              <div className="bg-slate-800/30 rounded-2xl p-6 max-w-2xl mx-auto mb-8 border border-white/10">
                <h3 className="font-semibold text-white mb-3 flex items-center justify-center gap-2">
                  <Target className="w-5 h-5 text-emerald-400" />
                  Objectifs
                </h3>
                <ul className="text-left text-slate-300 space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    Maximiser l'autonomie numérique (souveraineté)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    Réduire l'impact environnemental
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    Maintenir la satisfaction des utilisateurs
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    Optimiser le budget
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={startGame}
                  className="px-8 py-6 text-lg bg-gradient-to-r from-emerald-500 to-blue-500 hover:opacity-90"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Jouer en solo
                </Button>
                <Button
                  onClick={() => setGameState('multiplayer-setup')}
                  variant="outline"
                  className="px-8 py-6 text-lg border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                >
                  <UserPlus className="w-5 h-5 mr-2" />
                  Multijoueur
                </Button>
              </div>
            </motion.div>
          )}

          {/* MULTIPLAYER SETUP */}
          {gameState === 'multiplayer-setup' && (
            <motion.div
              key="multiplayer-setup"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <MultiplayerSetup
                onSessionReady={handleMultiplayerSessionReady}
                onCancel={() => setGameState('intro')}
              />
            </motion.div>
          )}

          {/* MULTIPLAYER LOBBY */}
          {gameState === 'multiplayer-lobby' && multiplayerSession && (
            <motion.div
              key="multiplayer-lobby"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex justify-center"
            >
              <MultiplayerLobby
                session={multiplayerSession}
                playerName={playerName}
                onStart={handleMultiplayerStart}
                onLeave={handleLeaveSession}
              />
            </motion.div>
          )}

          {/* PLAYING */}
          {gameState === 'playing' && scenario && (
            <motion.div
              key={`scenario-${currentScenario}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              {/* Score bar */}
              <div className="grid grid-cols-4 gap-3 mb-6">
                <div className="bg-slate-800/50 rounded-xl p-3 border border-white/10">
                  <div className="flex items-center justify-between mb-1">
                    <Euro className="w-4 h-4 text-amber-400" />
                    <span className="text-xs text-slate-400">Budget</span>
                  </div>
                  <p className="text-lg font-bold text-amber-400">{(scores.budget / 1000).toFixed(0)}K€</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-3 border border-white/10">
                  <div className="flex items-center justify-between mb-1">
                    <Users className="w-4 h-4 text-blue-400" />
                    <span className="text-xs text-slate-400">Satisf.</span>
                  </div>
                  <p className="text-lg font-bold text-blue-400">{scores.satisfaction}%</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-3 border border-white/10">
                  <div className="flex items-center justify-between mb-1">
                    <Shield className="w-4 h-4 text-purple-400" />
                    <span className="text-xs text-slate-400">Autonomie</span>
                  </div>
                  <p className="text-lg font-bold text-purple-400">{scores.autonomy}%</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-3 border border-white/10">
                  <div className="flex items-center justify-between mb-1">
                    <Leaf className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs text-slate-400">Écologie</span>
                  </div>
                  <p className="text-lg font-bold text-emerald-400">{scores.ecology}%</p>
                </div>
              </div>

              {/* Progress */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm text-slate-400">
                  Scénario {currentScenario + 1}/{allScenarios.length}
                  {currentScenario >= scenarios.length && (
                    <span className="ml-2 px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded text-xs">IA</span>
                  )}
                </span>
                <div className="flex items-center gap-2">
                  <Clock className={`w-4 h-4 ${timeLeft <= 10 ? 'text-red-400' : 'text-slate-400'}`} />
                  <span className={`font-mono ${timeLeft <= 10 ? 'text-red-400' : 'text-slate-400'}`}>
                    {timeLeft}s
                  </span>
                </div>
              </div>

              {/* Scenario card */}
              <motion.div
                className={`bg-gradient-to-br ${scenario.bgGradient} rounded-3xl p-8 mb-8 border border-white/10`}
              >
                <div className="text-center mb-6">
                  <span className="text-6xl">{scenario.image}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-4">
                  {scenario.title}
                </h2>
                <p className="text-slate-200 text-center text-lg max-w-2xl mx-auto">
                  {scenario.context}
                </p>
              </motion.div>

              {/* AI Advisor */}
              {!showConsequence && aiEnabled && scenario && (
                <AIAdvisor 
                  scenario={scenario} 
                  scores={scores} 
                  previousDecisions={decisions}
                />
              )}

              {/* Decisions */}
              {isGeneratingScenario ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-12"
                >
                  <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 text-purple-400 animate-pulse" />
                  </div>
                  <p className="text-slate-300">L'IA génère un nouveau scénario personnalisé...</p>
                </motion.div>
              ) : !showConsequence ? (
                <div className="grid md:grid-cols-3 gap-4">
                  {scenario.decisions.map((decision, index) => {
                    const IconComponent = decision.icon;
                    return (
                      <motion.button
                        key={decision.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleDecision(decision)}
                        className="bg-slate-800/80 hover:bg-slate-700/80 rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all text-left"
                      >
                        {IconComponent && <IconComponent className="w-8 h-8 text-emerald-400 mb-4" />}
                        <h3 className="font-bold text-white text-lg mb-2">{decision.title}</h3>
                        <p className="text-slate-400 text-sm">{decision.description}</p>
                      </motion.button>
                    );
                  })}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-slate-800/80 rounded-2xl p-8 border border-white/20"
                >
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-center mx-auto mb-4">
                      {showConsequence.icon && <showConsequence.icon className="w-8 h-8 text-white" />}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {showConsequence.title}
                    </h3>
                  </div>

                  <div className="bg-slate-900/50 rounded-xl p-4 mb-6">
                    <p className="text-slate-200 text-center">{showConsequence.consequences.message}</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    <div className={`rounded-xl p-3 text-center ${
                      showConsequence.consequences.budget >= 0 ? 'bg-emerald-500/20' : 'bg-red-500/20'
                    }`}>
                      <p className="text-xs text-slate-400 mb-1">Budget</p>
                      <p className={`font-bold ${
                        showConsequence.consequences.budget >= 0 ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {showConsequence.consequences.budget >= 0 ? '+' : ''}{showConsequence.consequences.budget}€
                      </p>
                    </div>
                    <div className={`rounded-xl p-3 text-center ${
                      showConsequence.consequences.satisfaction >= 0 ? 'bg-emerald-500/20' : 'bg-red-500/20'
                    }`}>
                      <p className="text-xs text-slate-400 mb-1">Satisfaction</p>
                      <p className={`font-bold ${
                        showConsequence.consequences.satisfaction >= 0 ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {showConsequence.consequences.satisfaction >= 0 ? '+' : ''}{showConsequence.consequences.satisfaction}%
                      </p>
                    </div>
                    <div className={`rounded-xl p-3 text-center ${
                      showConsequence.consequences.autonomy >= 0 ? 'bg-emerald-500/20' : 'bg-red-500/20'
                    }`}>
                      <p className="text-xs text-slate-400 mb-1">Autonomie</p>
                      <p className={`font-bold ${
                        showConsequence.consequences.autonomy >= 0 ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {showConsequence.consequences.autonomy >= 0 ? '+' : ''}{showConsequence.consequences.autonomy}%
                      </p>
                    </div>
                    <div className={`rounded-xl p-3 text-center ${
                      showConsequence.consequences.ecology >= 0 ? 'bg-emerald-500/20' : 'bg-red-500/20'
                    }`}>
                      <p className="text-xs text-slate-400 mb-1">Écologie</p>
                      <p className={`font-bold ${
                        showConsequence.consequences.ecology >= 0 ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {showConsequence.consequences.ecology >= 0 ? '+' : ''}{showConsequence.consequences.ecology}%
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={nextScenario}
                    className="w-full bg-gradient-to-r from-emerald-500 to-blue-500"
                    disabled={isGeneratingScenario}
                  >
                    {isGeneratingScenario ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Génération IA...
                      </>
                    ) : currentScenario < allScenarios.length - 1 || (aiEnabled && dynamicScenarios.length < 2) ? (
                      <>Scénario suivant <ArrowRight className="w-4 h-4 ml-2" /></>
                    ) : (
                      'Voir les résultats'
                    )}
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* MULTIPLAYER RESULTS */}
          {gameState === 'multiplayer-results' && multiplayerSession && (
            <motion.div
              key="multiplayer-results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <MultiplayerResults
                sessionId={multiplayerSession.id}
                mode={multiplayerSession.mode}
                playerName={playerName}
                onPlayAgain={restartGame}
                onExit={() => navigate(createPageUrl('Home'))}
              />
            </motion.div>
          )}

          {/* RESULTS */}
          {gameState === 'results' && !multiplayerSession && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="text-8xl mb-6"
              >
                {scores.autonomy >= 50 && scores.ecology >= 40 ? '🏆' : scores.autonomy >= 30 ? '🥈' : '📊'}
              </motion.div>

              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Simulation terminée !
              </h1>
              
              <p className="text-xl text-slate-300 mb-8">
                {scores.autonomy >= 50 && scores.ecology >= 40 
                  ? 'Excellent ! Vous avez transformé votre établissement vers un numérique responsable.'
                  : scores.autonomy >= 30
                  ? 'Bien joué ! Votre établissement a progressé vers plus d\'autonomie.'
                  : 'Continuez à explorer les alternatives pour améliorer votre score.'}
              </p>

              {/* Final scores */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-8">
                <div className="bg-slate-800/50 rounded-2xl p-6 border border-amber-500/30">
                  <Euro className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                  <p className="text-3xl font-bold text-amber-400">{(scores.budget / 1000).toFixed(0)}K€</p>
                  <p className="text-sm text-slate-400">Budget final</p>
                </div>
                <div className="bg-slate-800/50 rounded-2xl p-6 border border-blue-500/30">
                  <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-3xl font-bold text-blue-400">{scores.satisfaction}%</p>
                  <p className="text-sm text-slate-400">Satisfaction</p>
                </div>
                <div className="bg-slate-800/50 rounded-2xl p-6 border border-purple-500/30">
                  <Shield className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <p className="text-3xl font-bold text-purple-400">{scores.autonomy}%</p>
                  <p className="text-sm text-slate-400">Autonomie</p>
                </div>
                <div className="bg-slate-800/50 rounded-2xl p-6 border border-emerald-500/30">
                  <Leaf className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <p className="text-3xl font-bold text-emerald-400">{scores.ecology}%</p>
                  <p className="text-sm text-slate-400">Écologie</p>
                </div>
              </div>

              {/* Score global */}
              <div className="bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-2xl p-6 max-w-md mx-auto mb-8 border border-emerald-500/30">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <Star className="w-6 h-6 text-amber-400" />
                  <span className="text-2xl font-bold text-white">Score NIRD</span>
                </div>
                <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">
                  {Math.round((scores.satisfaction + scores.autonomy + scores.ecology) / 3)}%
                </p>
              </div>

              {/* AI Strategy Analysis */}
              {aiEnabled && decisions.length > 0 && (
                <div className="max-w-3xl mx-auto mb-8">
                  <AIStrategyAnalysis 
                    decisions={decisions}
                    scores={scores}
                    scenarios={allScenarios}
                  />
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={restartGame}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Recommencer
                </Button>
                <Link to={createPageUrl('Profile')}>
                  <Button className="bg-gradient-to-r from-emerald-500 to-blue-500">
                    Voir mon profil
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Popups */}
      {levelUpInfo && <LevelUpPopup level={levelUpInfo} onClose={() => setLevelUpInfo(null)} />}
      {showBadge && <BadgePopup badge={showBadge} onClose={() => setShowBadge(null)} />}
      
      {/* Random Event Modal */}
      {currentEvent && (
        <RandomEventModal event={currentEvent} onChoice={handleEventChoice} />
      )}
    </div>
  );
}