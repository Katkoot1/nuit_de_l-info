import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Video, FileText, BarChart3, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

const resourceIcons = {
  article: BookOpen,
  video: Video,
  case_study: FileText,
  infographic: BarChart3
};

const resourceColors = {
  article: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  video: 'bg-red-500/20 text-red-400 border-red-500/30',
  case_study: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  infographic: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
};

const resourceLabels = {
  article: 'Article',
  video: 'Vidéo',
  case_study: 'Étude de cas',
  infographic: 'Infographie'
};

export default function ChapterResources({ resources, title = "Pour approfondir" }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!resources || resources.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-slate-800/80 to-slate-800/50 rounded-2xl border border-white/10 overflow-hidden mt-8"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-500/20 to-blue-500/20 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-white">{title}</h3>
            <p className="text-sm text-slate-400">{resources.length} ressources disponibles</p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-slate-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400" />
        )}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 space-y-3">
              {resources.map((resource, index) => {
                const Icon = resourceIcons[resource.type] || BookOpen;
                const colorClass = resourceColors[resource.type] || resourceColors.article;
                const label = resourceLabels[resource.type] || 'Ressource';

                return (
                  <motion.a
                    key={index}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="block p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg border ${colorClass}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${colorClass}`}>
                            {label}
                          </span>
                          {resource.source && (
                            <span className="text-xs text-slate-500">{resource.source}</span>
                          )}
                        </div>
                        <h4 className="font-medium text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                          {resource.title}
                        </h4>
                        <p className="text-sm text-slate-400 mt-1 line-clamp-2">
                          {resource.description}
                        </p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors flex-shrink-0 mt-1" />
                    </div>
                  </motion.a>
                );
              })}

              {/* Key points infographic summary */}
              {resources.some(r => r.keyPoints) && (
                <div className="mt-4 p-4 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-xl border border-emerald-500/20">
                  <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-emerald-400" />
                    Points clés à retenir
                  </h4>
                  <div className="grid gap-2">
                    {resources.find(r => r.keyPoints)?.keyPoints.map((point, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-emerald-400 mt-0.5">•</span>
                        <span className="text-sm text-slate-300">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}