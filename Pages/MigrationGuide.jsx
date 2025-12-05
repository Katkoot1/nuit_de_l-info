import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Settings, 
  GraduationCap, 
  CheckCircle, 
  Circle, 
  ArrowRight, 
  Clock, 
  BookOpen, 
  Video, 
  FileText, 
  ExternalLink,
  Download,
  Calendar,
  Target,
  Sparkles,
  ChevronRight,
  Info
} from 'lucide-react';

const profiles = [
  {
    id: 'director',
    name: 'Directeur·rice',
    icon: User,
    color: 'from-blue-400 to-blue-600',
    description: 'Décisions stratégiques et vision globale'
  },
  {
    id: 'technician',
    name: 'Technicien·ne',
    icon: Settings,
    color: 'from-emerald-400 to-emerald-600',
    description: 'Mise en œuvre technique et maintenance'
  },
  {
    id: 'teacher',
    name: 'Enseignant·e',
    icon: GraduationCap,
    color: 'from-orange-400 to-orange-600',
    description: 'Utilisation pédagogique au quotidien'
  }
];

const migrationSteps = [
  {
    id: 'planning',
    title: 'Planification',
    duration: '2-4 semaines',
    description: 'Évaluation et préparation',
    milestones: [
      'Audit du parc informatique',
      'Identification des besoins',
      'Formation de l\'équipe projet',
      'Définition du budget'
    ],
    resources: [
      {
        type: 'guide',
        title: 'Guide d\'audit du parc informatique',
        url: 'https://nird.forge.apps.education.fr/',
        icon: FileText,
        description: 'Ressources NIRD pour évaluer votre parc'
      },
      {
        type: 'video',
        title: 'Présentation des distributions Linux éducatives',
        url: 'https://tube-numerique-educatif.apps.education.fr/w/3LXem3XK4asbwZa5R1qGkW',
        icon: Video,
        description: 'Vidéo du lycée Carnot (5 min)'
      },
      {
        type: 'template',
        title: 'Modèle de plan de migration',
        url: 'https://www.april.org/',
        icon: Download,
        description: 'Ressources April pour la migration'
      }
    ]
  },
  {
    id: 'pilot',
    title: 'Phase pilote',
    duration: '4-8 semaines',
    description: 'Test sur un échantillon',
    milestones: [
      'Installation sur 5-10 machines',
      'Formation des utilisateurs pilotes',
      'Collecte des retours',
      'Ajustements techniques'
    ],
    resources: [
      {
        type: 'guide',
        title: 'Guide d\'installation Linux Mint',
        url: 'https://linuxmint.com/documentation.php',
        icon: FileText,
        description: 'Documentation officielle Linux Mint'
      },
      {
        type: 'video',
        title: 'Le projet NIRD présenté par les élèves',
        url: 'https://tube-numerique-educatif.apps.education.fr/w/pZCnzPKTYX2iF38Qh4ZGmq',
        icon: Video,
        description: 'Témoignage lycée Carnot (4 min)'
      },
      {
        type: 'template',
        title: 'Alternatives libres Framasoft',
        url: 'https://framasoft.org/fr/',
        icon: Download,
        description: 'Découvrir les alternatives libres'
      }
    ]
  },
  {
    id: 'deployment',
    title: 'Déploiement',
    duration: '8-12 semaines',
    description: 'Migration progressive',
    milestones: [
      'Formation des équipes',
      'Migration par salle/service',
      'Support et assistance',
      'Documentation utilisateur'
    ],
    resources: [
      {
        type: 'guide',
        title: 'Guide de déploiement massif',
        url: 'https://nird.forge.apps.education.fr/',
        icon: FileText,
        description: 'Méthodologie NIRD complète'
      },
      {
        type: 'video',
        title: 'Linux, c\'est facile ! - Lycée Carnot',
        url: 'https://tube-numerique-educatif.apps.education.fr/w/3LXem3XK4asbwZa5R1qGkW',
        icon: Video,
        description: 'Présentation par les élèves (5 min)'
      },
      {
        type: 'template',
        title: 'Ressources April',
        url: 'https://www.april.org/',
        icon: Download,
        description: 'Association pour le logiciel libre'
      }
    ]
  },
  {
    id: 'optimization',
    title: 'Optimisation',
    duration: 'Ongoing',
    description: 'Amélioration continue',
    milestones: [
      'Analyse des performances',
      'Optimisation des configurations',
      'Formation continue',
      'Évolution du parc'
    ],
    resources: [
      {
        type: 'guide',
        title: 'Guide d\'optimisation Linux',
        url: 'https://www.greenit.fr/etude-empreinte-environnementale-du-numerique-mondial/',
        icon: FileText,
        description: 'Impact environnemental du numérique'
      },
      {
        type: 'video',
        title: 'Documentaire : Internet, la pollution cachée',
        url: 'https://www.youtube.com/results?search_query=internet+pollution+cachee',
        icon: Video,
        description: 'Enquête sur l\'impact environnemental'
      },
      {
        type: 'template',
        title: 'Forge des Communs Numériques',
        url: 'https://forge.apps.education.fr/',
        icon: Download,
        description: 'Plateforme collaborative Éducation'
      }
    ]
  }
];

const getProfileChecklist = (profileId) => {
  const checklists = {
    director: [
      { id: 'vision', text: 'Définir la vision stratégique de la migration', step: 'planning' },
      { id: 'budget', text: 'Valider le budget et les ressources nécessaires', step: 'planning' },
      { id: 'team', text: 'Constituer l\'équipe projet', step: 'planning' },
      { id: 'communication', text: 'Préparer la communication interne', step: 'planning' },
      { id: 'pilot-validation', text: 'Valider les résultats de la phase pilote', step: 'pilot' },
      { id: 'deployment-approval', text: 'Approuver le plan de déploiement', step: 'deployment' },
      { id: 'roi', text: 'Mesurer le ROI et les économies réalisées', step: 'optimization' }
    ],
    technician: [
      { id: 'audit', text: 'Réaliser l\'audit technique du parc', step: 'planning' },
      { id: 'infrastructure', text: 'Préparer l\'infrastructure réseau', step: 'planning' },
      { id: 'images', text: 'Créer les images Linux personnalisées', step: 'pilot' },
      { id: 'deployment-tools', text: 'Configurer les outils de déploiement', step: 'pilot' },
      { id: 'testing', text: 'Tester les applications critiques', step: 'pilot' },
      { id: 'migration', text: 'Effectuer les migrations par lot', step: 'deployment' },
      { id: 'support', text: 'Assurer le support technique', step: 'deployment' },
      { id: 'monitoring', text: 'Mettre en place le monitoring', step: 'optimization' },
      { id: 'maintenance', text: 'Planifier la maintenance préventive', step: 'optimization' }
    ],
    teacher: [
      { id: 'needs', text: 'Identifier les besoins pédagogiques spécifiques', step: 'planning' },
      { id: 'software', text: 'Lister les logiciels pédagogiques utilisés', step: 'planning' },
      { id: 'training', text: 'Suivre la formation Linux de base', step: 'pilot' },
      { id: 'test-apps', text: 'Tester les alternatives Linux aux logiciels habituels', step: 'pilot' },
      { id: 'adapt-content', text: 'Adapter le contenu pédagogique si nécessaire', step: 'pilot' },
      { id: 'use-pilot', text: 'Utiliser le système pilote en classe', step: 'pilot' },
      { id: 'feedback', text: 'Fournir des retours d\'expérience', step: 'pilot' },
      { id: 'train-students', text: 'Former les élèves au nouvel environnement', step: 'deployment' },
      { id: 'document', text: 'Documenter les usages pédagogiques', step: 'optimization' }
    ]
  };
  return checklists[profileId] || [];
};

export default function MigrationGuide() {
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [currentStep, setCurrentStep] = useState(null);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [showStepDetails, setShowStepDetails] = useState(false);

  const handleProfileSelect = (profile) => {
    setSelectedProfile(profile);
    setCurrentStep('planning');
    setCompletedTasks([]);
    setShowStepDetails(false);
  };

  const toggleTask = (taskId) => {
    setCompletedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const getStepProgress = (stepId) => {
    const checklist = getProfileChecklist(selectedProfile?.id);
    const stepTasks = checklist.filter(t => t.step === stepId);
    const completed = stepTasks.filter(t => completedTasks.includes(t.id));
    return stepTasks.length > 0 ? (completed.length / stepTasks.length) * 100 : 0;
  };

  const checklist = selectedProfile ? getProfileChecklist(selectedProfile.id) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 md:mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Guide de migration
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-blue-400 to-orange-400 mb-4">
            Migration vers Linux
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
            Assistant interactif pour planifier et suivre votre migration vers un environnement Linux éducatif
          </p>
        </motion.div>

        {/* Profile Selection */}
        {!selectedProfile ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-xl md:text-2xl font-bold text-white mb-6 text-center">
              Sélectionnez votre profil
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {profiles.map((profile) => {
                const Icon = profile.icon;
                return (
                  <motion.button
                    key={profile.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleProfileSelect(profile)}
                    className="p-6 rounded-2xl bg-slate-800/50 border-2 border-white/10 hover:border-white/30 transition-all text-left"
                  >
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${profile.color} flex items-center justify-center mb-4`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{profile.name}</h3>
                    <p className="text-sm text-slate-400">{profile.description}</p>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <>
            {/* Selected Profile Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className={`p-4 rounded-2xl bg-gradient-to-r ${selectedProfile.color} bg-opacity-20 border border-white/20 flex items-center justify-between flex-wrap gap-4`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${selectedProfile.color} flex items-center justify-center`}>
                    <selectedProfile.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Profil : {selectedProfile.name}</h2>
                    <p className="text-sm text-slate-300">{selectedProfile.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedProfile(null);
                    setCurrentStep(null);
                    setCompletedTasks([]);
                  }}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white text-sm transition-colors"
                >
                  Changer de profil
                </button>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
              {/* Timeline */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="mb-6"
                >
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-blue-400" />
                    Timeline de migration
                  </h2>
                </motion.div>

                <div className="space-y-4">
                  {migrationSteps.map((step, index) => {
                    const progress = getStepProgress(step.id);
                    const isActive = currentStep === step.id;
                    const isCompleted = progress === 100;

                    return (
                      <motion.div
                        key={step.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`relative p-6 rounded-2xl border-2 transition-all ${
                          isActive
                            ? 'bg-slate-800 border-blue-500/50'
                            : 'bg-slate-800/50 border-white/10 hover:border-white/20'
                        }`}
                      >
                        {/* Step Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${
                                isCompleted
                                  ? 'bg-emerald-500 text-white'
                                  : isActive
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-slate-700 text-slate-300'
                              }`}>
                                {index + 1}
                              </div>
                              <div>
                                <h3 className="text-xl font-bold text-white">{step.title}</h3>
                                <div className="flex items-center gap-2 text-sm text-slate-400 mt-1">
                                  <Clock className="w-4 h-4" />
                                  <span>{step.duration}</span>
                                </div>
                              </div>
                            </div>
                            <p className="text-slate-300 ml-[52px]">{step.description}</p>
                          </div>
                          <button
                            onClick={() => {
                              setCurrentStep(isActive ? null : step.id);
                              setShowStepDetails(isActive ? false : true);
                            }}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                          >
                            <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${isActive ? 'rotate-90' : ''}`} />
                          </button>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-slate-400">Progression</span>
                            <span className="text-emerald-400 font-semibold">{Math.round(progress)}%</span>
                          </div>
                          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              transition={{ duration: 0.5 }}
                              className="h-full bg-gradient-to-r from-emerald-400 to-blue-400"
                            />
                          </div>
                        </div>

                        {/* Milestones */}
                        <AnimatePresence>
                          {isActive && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-4 space-y-2"
                            >
                              <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                                <Target className="w-4 h-4 text-blue-400" />
                                Jalons
                              </h4>
                              <ul className="space-y-2">
                                {step.milestones.map((milestone, i) => (
                                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                    <span>{milestone}</span>
                                  </li>
                                ))}
                              </ul>

                              {/* Resources */}
                              <div className="mt-4 pt-4 border-t border-white/10">
                                <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                                  <BookOpen className="w-4 h-4 text-orange-400" />
                                  Ressources
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {step.resources.map((resource, i) => {
                                    const ResourceIcon = resource.icon;
                                    return (
                                      <a
                                        key={i}
                                        href={resource.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex flex-col gap-1 p-3 bg-slate-700/50 hover:bg-slate-700 hover:border-blue-400/50 border border-transparent rounded-lg transition-all group cursor-pointer"
                                      >
                                        <div className="flex items-center gap-2">
                                          <ResourceIcon className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors flex-shrink-0" />
                                          <span className="text-sm font-medium text-slate-300 group-hover:text-white flex-1">
                                            {resource.title}
                                          </span>
                                          <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-blue-400 transition-colors flex-shrink-0" />
                                        </div>
                                        {resource.description && (
                                          <p className="text-xs text-slate-400 group-hover:text-slate-300 ml-6">
                                            {resource.description}
                                          </p>
                                        )}
                                      </a>
                                    );
                                  })}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Checklist Sidebar */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="sticky top-4"
                >
                  <div className="p-6 rounded-2xl bg-slate-800/50 border border-white/10">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                      Checklist personnalisée
                    </h2>
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-slate-400">Tâches complétées</span>
                        <span className="text-emerald-400 font-semibold">
                          {completedTasks.length} / {checklist.length}
                        </span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(completedTasks.length / checklist.length) * 100}%` }}
                          transition={{ duration: 0.5 }}
                          className="h-full bg-gradient-to-r from-emerald-400 to-blue-400"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 max-h-[600px] overflow-y-auto">
                      {migrationSteps.map((step) => {
                        const stepTasks = checklist.filter(t => t.step === step.id);
                        if (stepTasks.length === 0) return null;

                        return (
                          <div key={step.id} className="mb-4">
                            <h3 className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                              {step.title}
                            </h3>
                            <div className="space-y-2">
                              {stepTasks.map((task) => {
                                const isCompleted = completedTasks.includes(task.id);
                                return (
                                  <motion.button
                                    key={task.id}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => toggleTask(task.id)}
                                    className={`w-full text-left p-3 rounded-lg transition-all flex items-start gap-3 ${
                                      isCompleted
                                        ? 'bg-emerald-500/20 border border-emerald-500/30'
                                        : 'bg-slate-700/50 border border-transparent hover:border-white/20'
                                    }`}
                                  >
                                    {isCompleted ? (
                                      <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                    ) : (
                                      <Circle className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                                    )}
                                    <span className={`text-sm flex-1 ${isCompleted ? 'text-emerald-300 line-through' : 'text-slate-300'}`}>
                                      {task.text}
                                    </span>
                                  </motion.button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Info Box */}
                    <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-slate-300">
                          <p className="font-semibold text-blue-400 mb-1">Conseil</p>
                          <p>Cette checklist est adaptée à votre profil. Cochez les tâches au fur et à mesure de votre progression.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

