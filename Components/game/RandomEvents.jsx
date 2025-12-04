import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Zap, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Pool d'événements aléatoires
export const RANDOM_EVENTS = [
  {
    id: 'server-crash',
    title: '🔥 Panne serveur critique',
    description: 'Un serveur principal vient de tomber en panne. Les services sont interrompus.',
    type: 'crisis',
    choices: [
      {
        label: 'Réparer en urgence',
        description: 'Appeler un technicien en urgence',
        effects: { budget: -5000, satisfaction: -5 },
        message: 'Réparation coûteuse mais rapide.'
      },
      {
        label: 'Basculer sur le backup',
        description: 'Utiliser le serveur de secours',
        effects: { satisfaction: -10, autonomy: 5 },
        message: 'Service réduit mais vous apprenez de cette expérience.'
      }
    ]
  },
  {
    id: 'gov-directive',
    title: '📜 Nouvelle directive gouvernementale',
    description: 'Le ministère impose 30% de logiciels libres dans les établissements publics d\'ici 2 ans.',
    type: 'opportunity',
    choices: [
      {
        label: 'Anticiper la migration',
        description: 'Commencer la transition maintenant',
        effects: { budget: -8000, autonomy: 20, ecology: 10 },
        message: 'Vous prenez de l\'avance sur la réglementation !'
      },
      {
        label: 'Attendre les détails',
        description: 'Reporter la décision',
        effects: { autonomy: -5 },
        message: 'Vous risquez d\'être en retard sur les délais.'
      }
    ]
  },
  {
    id: 'cyber-alert',
    title: '⚠️ Alerte cybersécurité',
    description: 'Une faille critique a été découverte dans un logiciel que vous utilisez.',
    type: 'crisis',
    choices: [
      {
        label: 'Mise à jour immédiate',
        description: 'Appliquer le correctif en urgence',
        effects: { budget: -2000, satisfaction: -5 },
        message: 'Interruption de service mais sécurité rétablie.'
      },
      {
        label: 'Passer au libre',
        description: 'Migrer vers une alternative open source',
        effects: { budget: -5000, autonomy: 15, ecology: 5 },
        message: 'Solution plus pérenne et transparente.'
      }
    ]
  },
  {
    id: 'budget-cut',
    title: '💸 Coupe budgétaire',
    description: 'La région annonce une réduction de 10% des subventions numériques.',
    type: 'crisis',
    choices: [
      {
        label: 'Réduire les licences',
        description: 'Diminuer les abonnements propriétaires',
        effects: { budget: 5000, autonomy: 10, satisfaction: -10 },
        message: 'Économies réalisées mais mécontentement.'
      },
      {
        label: 'Chercher des alternatives gratuites',
        description: 'Migrer vers des solutions libres',
        effects: { budget: 3000, autonomy: 25, ecology: 10, satisfaction: -5 },
        message: 'Transition vers le libre accélérée !'
      }
    ]
  },
  {
    id: 'eco-bonus',
    title: '🌱 Prime écologique',
    description: 'L\'ADEME offre une subvention pour les projets numériques durables.',
    type: 'opportunity',
    choices: [
      {
        label: 'Demander la prime',
        description: 'Soumettre un dossier de reconditionnement',
        effects: { budget: 10000, ecology: 15 },
        message: 'Subvention accordée pour votre engagement !'
      },
      {
        label: 'Ignorer',
        description: 'Trop de paperasse administrative',
        effects: {},
        message: 'Opportunité manquée.'
      }
    ]
  },
  {
    id: 'teacher-demand',
    title: '👩‍🏫 Demande des enseignants',
    description: 'Les professeurs réclament un accès à des outils collaboratifs modernes.',
    type: 'neutral',
    choices: [
      {
        label: 'Microsoft Teams',
        description: 'Solution propriétaire populaire',
        effects: { budget: -8000, satisfaction: 20, autonomy: -15 },
        message: 'Satisfaction immédiate mais dépendance accrue.'
      },
      {
        label: 'Nextcloud + BigBlueButton',
        description: 'Solutions libres et souveraines',
        effects: { budget: -3000, satisfaction: 10, autonomy: 30, ecology: 10 },
        message: 'Adoption progressive mais solution pérenne.'
      }
    ]
  },
  {
    id: 'hardware-donation',
    title: '🎁 Don de matériel',
    description: 'Une entreprise locale propose de donner 50 PC de moins de 3 ans.',
    type: 'opportunity',
    choices: [
      {
        label: 'Accepter avec Linux',
        description: 'Installer Linux sur les machines',
        effects: { budget: 2000, autonomy: 20, ecology: 25, satisfaction: 5 },
        message: 'Matériel valorisé et indépendance renforcée !'
      },
      {
        label: 'Refuser',
        description: 'Trop de travail d\'intégration',
        effects: {},
        message: 'Opportunité manquée de réduire votre empreinte.'
      }
    ]
  },
  {
    id: 'student-project',
    title: '🎓 Projet étudiant',
    description: 'Des étudiants proposent de créer une application libre pour l\'établissement.',
    type: 'opportunity',
    choices: [
      {
        label: 'Soutenir le projet',
        description: 'Fournir ressources et mentorat',
        effects: { budget: -1000, satisfaction: 15, autonomy: 10 },
        message: 'Initiative valorisée, compétences développées !'
      },
      {
        label: 'Décliner poliment',
        description: 'Manque de temps pour encadrer',
        effects: { satisfaction: -5 },
        message: 'Les étudiants sont déçus.'
      }
    ]
  },
  {
    id: 'rgpd-audit',
    title: '🔍 Audit RGPD',
    description: 'La CNIL annonce un contrôle de conformité dans 3 mois.',
    type: 'crisis',
    choices: [
      {
        label: 'Audit interne urgent',
        description: 'Vérifier et corriger les non-conformités',
        effects: { budget: -4000, autonomy: 10 },
        message: 'Mise en conformité réussie.'
      },
      {
        label: 'Migrer vers solutions souveraines',
        description: 'Passer aux outils conformes par défaut',
        effects: { budget: -10000, autonomy: 35, ecology: 10 },
        message: 'Transformation profonde mais sécurisante.'
      }
    ]
  },
  {
    id: 'energy-crisis',
    title: '⚡ Crise énergétique',
    description: 'Les prix de l\'électricité explosent. Vos serveurs coûtent 40% plus cher.',
    type: 'crisis',
    choices: [
      {
        label: 'Optimiser les serveurs',
        description: 'Virtualisation et extinction automatique',
        effects: { budget: -3000, ecology: 20 },
        message: 'Consommation réduite de 30%.'
      },
      {
        label: 'Migrer vers le cloud souverain',
        description: 'Externaliser vers un datacenter français',
        effects: { budget: -8000, ecology: 15, autonomy: 20 },
        message: 'Moins d\'infrastructure à gérer.'
      }
    ]
  }
];

// Fonction pour obtenir un événement aléatoire
export function getRandomEvent(excludeIds = []) {
  const available = RANDOM_EVENTS.filter(e => !excludeIds.includes(e.id));
  if (available.length === 0) return null;
  return available[Math.floor(Math.random() * available.length)];
}

// Composant d'affichage de l'événement
export default function RandomEventModal({ event, onChoice }) {
  if (!event) return null;

  const typeColors = {
    crisis: 'from-red-500/20 to-orange-500/20 border-red-500/30',
    opportunity: 'from-emerald-500/20 to-blue-500/20 border-emerald-500/30',
    neutral: 'from-purple-500/20 to-pink-500/20 border-purple-500/30'
  };

  const typeLabels = {
    crisis: { text: 'Crise', color: 'text-red-400', bg: 'bg-red-500/20' },
    opportunity: { text: 'Opportunité', color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
    neutral: { text: 'Événement', color: 'text-purple-400', bg: 'bg-purple-500/20' }
  };

  const typeConfig = typeLabels[event.type];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 50 }}
          className={`bg-gradient-to-br ${typeColors[event.type]} bg-slate-900 border rounded-3xl p-6 max-w-lg w-full shadow-2xl`}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${typeConfig.bg} ${typeConfig.color}`}>
              {typeConfig.text}
            </span>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: 2 }}
            >
              <Zap className="w-6 h-6 text-amber-400" />
            </motion.div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-white mb-3">{event.title}</h2>
          <p className="text-slate-300 mb-6">{event.description}</p>

          {/* Choices */}
          <div className="space-y-3">
            {event.choices.map((choice, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onChoice(choice)}
                className="w-full p-4 bg-slate-800/80 hover:bg-slate-700/80 rounded-xl border border-white/10 hover:border-white/20 transition-all text-left"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-white">{choice.label}</h3>
                    <p className="text-sm text-slate-400 mt-1">{choice.description}</p>
                  </div>
                </div>
                
                {/* Effects preview */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {choice.effects.budget && (
                    <span className={`text-xs px-2 py-1 rounded ${choice.effects.budget > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                      {choice.effects.budget > 0 ? '+' : ''}{choice.effects.budget}€
                    </span>
                  )}
                  {choice.effects.satisfaction && (
                    <span className={`text-xs px-2 py-1 rounded ${choice.effects.satisfaction > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                      Satisf. {choice.effects.satisfaction > 0 ? '+' : ''}{choice.effects.satisfaction}%
                    </span>
                  )}
                  {choice.effects.autonomy && (
                    <span className={`text-xs px-2 py-1 rounded ${choice.effects.autonomy > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                      Auton. {choice.effects.autonomy > 0 ? '+' : ''}{choice.effects.autonomy}%
                    </span>
                  )}
                  {choice.effects.ecology && (
                    <span className={`text-xs px-2 py-1 rounded ${choice.effects.ecology > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                      Écolo. {choice.effects.ecology > 0 ? '+' : ''}{choice.effects.ecology}%
                    </span>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}