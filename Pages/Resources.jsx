import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { createPageUrl } from '@/utils';
import { 
  ArrowLeft, 
  ExternalLink, 
  BookOpen, 
  Video, 
  FileText, 
  Users, 
  Leaf, 
  Monitor,
  Github,
  Heart
} from 'lucide-react';

const resources = [
  {
    category: 'Sites officiels',
    icon: BookOpen,
    items: [
      {
        title: 'NIRD - Site officiel',
        description: 'Numérique Inclusif, Responsable et Durable',
        url: 'https://nird.forge.apps.education.fr/',
        icon: '🌱'
      },
      {
        title: 'Forge des Communs Numériques',
        description: 'Plateforme collaborative de l\'Éducation Nationale',
        url: 'https://forge.apps.education.fr/',
        icon: '🔧'
      }
    ]
  },
  {
    category: 'Médias & Reportages',
    icon: Video,
    items: [
      {
        title: 'France 3 - Reportage NIRD',
        description: 'Découvrez les initiatives dans les lycées',
        url: 'https://france3-regions.francetvinfo.fr/',
        icon: '📺'
      },
      {
        title: 'France Inter - Interview',
        description: 'L\'approche NIRD expliquée en podcast',
        url: 'https://www.radiofrance.fr/franceinter',
        icon: '🎙️'
      }
    ]
  },
  {
    category: 'Alternatives libres',
    icon: Monitor,
    items: [
      {
        title: 'Linux Mint',
        description: 'Distribution Linux idéale pour débuter',
        url: 'https://linuxmint.com/',
        icon: '🐧'
      },
      {
        title: 'LibreOffice',
        description: 'Suite bureautique libre et gratuite',
        url: 'https://www.libreoffice.org/',
        icon: '📝'
      },
      {
        title: 'Framasoft',
        description: 'Alternatives libres aux services des GAFAM',
        url: 'https://framasoft.org/',
        icon: '🦊'
      }
    ]
  },
  {
    category: 'Écologie numérique',
    icon: Leaf,
    items: [
      {
        title: 'GreenIT',
        description: 'Communauté du numérique responsable',
        url: 'https://www.greenit.fr/',
        icon: '♻️'
      },
      {
        title: 'The Shift Project',
        description: 'Think tank de la transition carbone',
        url: 'https://theshiftproject.org/',
        icon: '📊'
      }
    ]
  }
];

const actors = [
  { name: 'Élèves et éco-délégués', emoji: '🎓' },
  { name: 'Enseignants', emoji: '📚' },
  { name: 'Directions d\'établissements', emoji: '🏫' },
  { name: 'Techniciens et administrateurs', emoji: '🔧' },
  { name: 'Associations partenaires', emoji: '🤝' },
  { name: 'Collectivités territoriales', emoji: '🏛️' },
  { name: 'Services académiques', emoji: '📋' }
];

export default function Resources() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link 
            to={createPageUrl('Home')} 
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour à l'accueil
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ressources & Liens
          </h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            Tout ce dont tu as besoin pour aller plus loin dans ta démarche NIRD
          </p>
        </motion.div>

        {/* Resources by category */}
        <div className="space-y-8 mb-12">
          {resources.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.1 }}
            >
              <h2 className="flex items-center gap-3 text-lg font-semibold text-white mb-4">
                <category.icon className="w-5 h-5 text-emerald-400" />
                {category.category}
              </h2>
              <div className="grid gap-3">
                {category.items.map((item, itemIndex) => (
                  <a
                    key={item.title}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl border border-white/10 hover:border-emerald-500/30 hover:bg-slate-800 transition-all"
                  >
                    <span className="text-3xl">{item.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-medium text-white group-hover:text-emerald-400 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-slate-400">{item.description}</p>
                    </div>
                    <ExternalLink className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                  </a>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Actors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-800/50 rounded-3xl border border-white/10 p-6 mb-12"
        >
          <h2 className="flex items-center gap-3 text-lg font-semibold text-white mb-6">
            <Users className="w-5 h-5 text-blue-400" />
            Acteurs concernés
          </h2>
          <div className="flex flex-wrap gap-3">
            {actors.map((actor) => (
              <div
                key={actor.name}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 rounded-full"
              >
                <span>{actor.emoji}</span>
                <span className="text-sm text-slate-300">{actor.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* About this project */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-3xl border border-emerald-500/20 p-6"
        >
          <h2 className="flex items-center gap-3 text-lg font-semibold text-white mb-4">
            <Heart className="w-5 h-5 text-red-400" />
            À propos de ce projet
          </h2>
          <p className="text-slate-400 mb-4">
            NIRD Quest a été créé pour sensibiliser de manière ludique aux enjeux du numérique 
            responsable dans les établissements scolaires. Ce projet est open source et placé 
            sous licence libre.
          </p>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full">
              <Github className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-300">Code source disponible</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full">
              <FileText className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-300">Licence MIT</span>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="mt-12 text-center text-slate-500 text-sm">
          <p>
            Toutes les ressources utilisées sont libres de droits.
          </p>
          <p className="mt-2">
            Fait avec 💚 pour un numérique plus responsable
          </p>
        </div>
      </div>
    </div>
  );
}