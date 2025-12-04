import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Sparkles, Loader2, Tag, BookOpen, X, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';

// AI Tags for NIRD themes
const NIRD_TAGS = [
  { id: 'inclusion', label: 'Inclusion', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  { id: 'responsability', label: 'Responsabilité', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { id: 'durability', label: 'Durabilité', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  { id: 'linux', label: 'Linux/Libre', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  { id: 'privacy', label: 'Vie privée', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  { id: 'ecology', label: 'Écologie', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  { id: 'education', label: 'Éducation', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
  { id: 'migration', label: 'Migration', color: 'bg-pink-500/20 text-pink-400 border-pink-500/30' }
];

export function getTagConfig(tagId) {
  return NIRD_TAGS.find(t => t.id === tagId) || { id: tagId, label: tagId, color: 'bg-slate-500/20 text-slate-400 border-slate-500/30' };
}

// Analyze and summarize a resource/post
export async function analyzeResource(content, title = '') {
  try {
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Analyse ce contenu partagé sur un forum éducatif NIRD (Numérique Inclusif, Responsable et Durable).

Titre: ${title}
Contenu: ${content}

Fournis:
1. Un résumé concis en 2-3 phrases
2. Les tags pertinents parmi: inclusion, responsability, durability, linux, privacy, ecology, education, migration
3. Les points clés (max 3)
4. Un score de pertinence NIRD de 1 à 10`,
      response_json_schema: {
        type: "object",
        properties: {
          summary: { type: "string" },
          tags: { type: "array", items: { type: "string" } },
          keyPoints: { type: "array", items: { type: "string" } },
          nirdScore: { type: "number" }
        }
      }
    });
    return result;
  } catch (error) {
    console.error('AI analysis error:', error);
    return null;
  }
}

// Get personalized resource suggestions
export async function getSuggestedResources(userActivity, existingPosts) {
  try {
    // Default suggestions based on common NIRD topics
    const defaultSuggestions = [
      {
        title: 'Guide de migration vers les logiciels libres',
        description: 'Un guide complet pour migrer votre établissement vers des solutions libres et open source',
        type: 'guide',
        tags: ['linux', 'migration', 'education'],
        reason: 'Basé sur les discussions récentes sur les migrations'
      },
      {
        title: 'Ressources ADEME sur le numérique responsable',
        description: 'Outils et guides de l\'ADEME pour réduire l\'empreinte carbone du numérique',
        type: 'ressource',
        tags: ['ecology', 'durability', 'education'],
        reason: 'Pour approfondir vos connaissances sur l\'écologie numérique'
      },
      {
        title: 'Formation RGPD pour les établissements scolaires',
        description: 'Formation complète sur la protection des données et le RGPD en milieu éducatif',
        type: 'formation',
        tags: ['privacy', 'education', 'responsability'],
        reason: 'Important pour la protection des données des élèves'
      }
    ];

    // If we have posts, analyze them to personalize suggestions
    if (existingPosts && existingPosts.length > 0) {
      const postTopics = existingPosts.map(p => p.title + ' ' + p.content).join(' ').toLowerCase();
      
      // Customize suggestions based on topics
      if (postTopics.includes('libre') || postTopics.includes('linux') || postTopics.includes('migration')) {
        defaultSuggestions[0].reason = 'Vous semblez intéressé par les migrations vers le libre';
      }
      if (postTopics.includes('écologie') || postTopics.includes('carbone') || postTopics.includes('environnement')) {
        defaultSuggestions[1].reason = 'Vous discutez d\'écologie numérique';
      }
      if (postTopics.includes('données') || postTopics.includes('rgpd') || postTopics.includes('privée')) {
        defaultSuggestions[2].reason = 'La protection des données vous préoccupe';
      }
    }

    // Try to get AI suggestions, but fallback to defaults
    try {
      const activitySummary = userActivity.slice(0, 5).map(a => a.title || a.content).join(', ');
      const postTitles = existingPosts.slice(0, 10).map(p => p.title).join(', ');
      
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `En tant qu'assistant NIRD, suggère 3 ressources éducatives pertinentes basées sur:

Activité récente de l'utilisateur: ${activitySummary || 'Nouvel utilisateur'}
Posts existants sur le forum: ${postTitles}

Thèmes NIRD: Numérique Inclusif (accessibilité), Responsable (vie privée, éthique), Durable (écologie, réemploi).

Suggère des ressources éducatives concrètes (articles, outils, guides) qui aideraient cet utilisateur.`,
        response_json_schema: {
          type: "object",
          properties: {
            suggestions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  type: { type: "string" },
                  tags: { type: "array", items: { type: "string" } },
                  reason: { type: "string" }
                }
              }
            }
          }
        }
      });
      
      if (result && result.suggestions && result.suggestions.length > 0) {
        return result.suggestions;
      }
    } catch (error) {
      console.log('Using default suggestions');
    }
    
    return defaultSuggestions;
  } catch (error) {
    console.error('AI suggestions error:', error);
    return [];
  }
}

// Auto-categorize content
export async function autoCategorize(content) {
  try {
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Catégorise ce contenu pour un forum NIRD éducatif.

Contenu: ${content}

Fournis la catégorie appropriée (experience, question, resource, best-practice, suggestion) et des tags suggérés.`,
      response_json_schema: {
        type: "object",
        properties: {
          category: { type: "string" },
          confidence: { type: "number" },
          suggestedTags: { type: "array", items: { type: "string" } }
        }
      }
    });
    return result;
  } catch (error) {
    return { category: 'experience', confidence: 0.5, suggestedTags: [] };
  }
}

// AI Summary Badge Component
export function AISummaryBadge({ post, onAnalyze }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    const result = await analyzeResource(post.content, post.title);
    setAnalysis(result);
    setLoading(false);
    setShowDetails(true);
    if (onAnalyze) onAnalyze(result);
  };

  return (
    <>
      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg text-purple-400 text-xs hover:bg-purple-500/30 transition-colors disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : (
          <Sparkles className="w-3 h-3" />
        )}
        {loading ? 'Analyse...' : 'Analyser avec IA'}
      </button>

      <AnimatePresence>
        {showDetails && analysis && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-slate-800 rounded-2xl p-6 max-w-lg w-full border border-white/20"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <h3 className="font-semibold text-white">Analyse IA</h3>
                </div>
                <button onClick={() => setShowDetails(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Summary */}
                <div>
                  <h4 className="text-sm font-medium text-slate-400 mb-2">Résumé</h4>
                  <p className="text-white text-sm">{analysis.summary}</p>
                </div>

                {/* Tags */}
                <div>
                  <h4 className="text-sm font-medium text-slate-400 mb-2">Tags suggérés</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.tags?.map(tag => {
                      const config = getTagConfig(tag);
                      return (
                        <span key={tag} className={`px-2 py-1 rounded-lg text-xs border ${config.color}`}>
                          {config.label}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Key Points */}
                {analysis.keyPoints?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-400 mb-2">Points clés</h4>
                    <ul className="space-y-1">
                      {analysis.keyPoints.map((point, i) => (
                        <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                          <span className="text-emerald-400">•</span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* NIRD Score */}
                <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                  <span className="text-sm text-slate-400">Score NIRD</span>
                  <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-blue-500"
                      style={{ width: `${(analysis.nirdScore || 0) * 10}%` }}
                    />
                  </div>
                  <span className="text-white font-semibold">{analysis.nirdScore}/10</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// AI Suggestions Panel
export function AISuggestionsPanel({ userPosts = [], forumPosts = [] }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const loadSuggestions = async () => {
    setLoading(true);
    setExpanded(true);
    const results = await getSuggestedResources(userPosts, forumPosts);
    setSuggestions(results);
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl overflow-hidden">
      <button
        onClick={loadSuggestions}
        className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-white">Suggestions IA</h3>
            <p className="text-xs text-slate-400">Ressources personnalisées pour toi</p>
          </div>
        </div>
        {loading && <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />}
      </button>

      <AnimatePresence>
        {expanded && suggestions.length > 0 && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 space-y-3">
              {suggestions.map((suggestion, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-slate-800/50 rounded-xl p-4"
                >
                  <div className="flex items-start gap-3">
                    <BookOpen className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-white text-sm">{suggestion.title}</h4>
                      <p className="text-xs text-slate-400 mt-1">{suggestion.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {suggestion.tags?.map(tag => {
                          const config = getTagConfig(tag);
                          return (
                            <span key={tag} className={`px-2 py-0.5 rounded text-xs border ${config.color}`}>
                              {config.label}
                            </span>
                          );
                        })}
                      </div>
                      <p className="text-xs text-purple-400 mt-2 italic">💡 {suggestion.reason}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export { NIRD_TAGS };