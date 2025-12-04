import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Lightbulb, Brain, ChevronDown, ChevronUp, Loader2, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';

// Génère un nouveau scénario basé sur les choix précédents
export async function generateDynamicScenario(previousDecisions, currentScores) {
  const decisionSummary = previousDecisions.map(d => `Scénario ${d.scenario + 1}: choix "${d.decision}"`).join(', ');
  
  const response = await base44.integrations.Core.InvokeLLM({
    prompt: `Tu es un expert en numérique responsable (NIRD - Numérique Inclusif, Responsable et Durable).

Contexte du joueur :
- Décisions précédentes : ${decisionSummary || 'Aucune'}
- Scores actuels : Budget ${currentScores.budget}€, Satisfaction ${currentScores.satisfaction}%, Autonomie ${currentScores.autonomy}%, Écologie ${currentScores.ecology}%

Génère UN NOUVEAU scénario de simulation réaliste et engageant pour un directeur numérique d'établissement éducatif français.
Le scénario doit être cohérent avec les décisions passées et proposer un défi adapté aux scores actuels.

IMPORTANT : Les conséquences doivent être réalistes et équilibrées (pas de solution parfaite).`,
    response_json_schema: {
      type: "object",
      properties: {
        title: { type: "string", description: "Titre court du scénario (3-5 mots)" },
        context: { type: "string", description: "Description du contexte et du problème (2-3 phrases)" },
        image: { type: "string", description: "Un seul emoji représentatif" },
        bgGradient: { type: "string", description: "Gradient CSS (ex: from-blue-900/50 to-purple-900/50)" },
        decisions: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              title: { type: "string", description: "Titre de la décision (2-4 mots)" },
              description: { type: "string", description: "Description courte de l'action" },
              consequences: {
                type: "object",
                properties: {
                  budget: { type: "number", description: "Impact budget en euros (-50000 à +10000)" },
                  satisfaction: { type: "number", description: "Impact satisfaction (-30 à +30)" },
                  autonomy: { type: "number", description: "Impact autonomie (-20 à +60)" },
                  ecology: { type: "number", description: "Impact écologie (-40 à +50)" },
                  message: { type: "string", description: "Message de résultat explicatif" }
                }
              }
            }
          },
          minItems: 3,
          maxItems: 3
        }
      },
      required: ["title", "context", "image", "decisions"]
    }
  });

  return response;
}

// Génère un conseil personnalisé pendant le jeu
export async function getAIAdvice(scenario, currentScores, previousDecisions) {
  const response = await base44.integrations.Core.InvokeLLM({
    prompt: `Tu es un conseiller expert en numérique responsable pour l'éducation.

Scénario actuel : "${scenario.title}" - ${scenario.context}

Scores du joueur :
- Budget : ${currentScores.budget}€
- Satisfaction : ${currentScores.satisfaction}%
- Autonomie numérique : ${currentScores.autonomy}%
- Impact écologique : ${currentScores.ecology}%

Donne UN conseil stratégique court (2-3 phrases max) pour aider le joueur à prendre sa décision.
Ne révèle pas quelle est la "meilleure" option, mais aide à réfléchir aux enjeux.
Sois bienveillant et pédagogique.`,
    response_json_schema: {
      type: "object",
      properties: {
        advice: { type: "string", description: "Conseil stratégique (2-3 phrases)" },
        focus: { type: "string", enum: ["budget", "satisfaction", "autonomy", "ecology"], description: "L'aspect principal à considérer" },
        warning: { type: "string", description: "Point de vigilance optionnel (1 phrase courte)" }
      },
      required: ["advice", "focus"]
    }
  });

  return response;
}

// Analyse complète post-partie
export async function analyzeGameStrategy(allDecisions, finalScores, scenarios) {
  const decisionsDetail = allDecisions.map((d, i) => {
    const scenario = scenarios[d.scenario];
    return `Scénario "${scenario?.title || i + 1}": choix "${d.decision}"`;
  }).join('\n');

  const response = await base44.integrations.Core.InvokeLLM({
    prompt: `Tu es un expert en stratégie numérique responsable. Analyse la partie d'un joueur de simulation NIRD.

Décisions prises :
${decisionsDetail}

Scores finaux :
- Budget restant : ${finalScores.budget}€
- Satisfaction utilisateurs : ${finalScores.satisfaction}%
- Autonomie numérique : ${finalScores.autonomy}%
- Impact écologique : ${finalScores.ecology}%

Fournis une analyse complète et constructive de la stratégie du joueur avec des recommandations concrètes pour s'améliorer.`,
    response_json_schema: {
      type: "object",
      properties: {
        overallGrade: { type: "string", enum: ["A", "B", "C", "D"], description: "Note globale" },
        summary: { type: "string", description: "Résumé de la stratégie en 2-3 phrases" },
        strengths: {
          type: "array",
          items: { type: "string" },
          description: "2-3 points forts de la stratégie"
        },
        improvements: {
          type: "array",
          items: { type: "string" },
          description: "2-3 axes d'amélioration"
        },
        bestDecision: { type: "string", description: "La meilleure décision prise et pourquoi" },
        alternativeStrategy: { type: "string", description: "Une stratégie alternative à essayer" },
        realWorldTip: { type: "string", description: "Un conseil applicable dans la vraie vie" }
      },
      required: ["overallGrade", "summary", "strengths", "improvements"]
    }
  });

  return response;
}

// Composant d'affichage des conseils IA
export function AIAdvisor({ scenario, scores, previousDecisions, onClose }) {
  const [advice, setAdvice] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const fetchAdvice = async () => {
    if (advice) {
      setIsExpanded(!isExpanded);
      return;
    }
    
    setIsLoading(true);
    setIsExpanded(true);
    try {
      const result = await getAIAdvice(scenario, scores, previousDecisions);
      setAdvice(result);
    } catch (err) {
      console.error('Error fetching AI advice:', err);
    }
    setIsLoading(false);
  };

  const focusIcons = {
    budget: '💰',
    satisfaction: '😊',
    autonomy: '🔓',
    ecology: '🌱'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4"
    >
      <button
        onClick={fetchAdvice}
        className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl hover:border-purple-500/50 transition-all"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <span className="text-purple-300 font-medium">Conseil IA</span>
        </div>
        {isLoading ? (
          <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
        ) : isExpanded ? (
          <ChevronUp className="w-4 h-4 text-purple-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-purple-400" />
        )}
      </button>

      <AnimatePresence>
        {isExpanded && advice && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-2 p-4 bg-slate-800/50 rounded-xl border border-white/10">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-2xl">{focusIcons[advice.focus]}</span>
                <p className="text-slate-200 text-sm leading-relaxed">{advice.advice}</p>
              </div>
              {advice.warning && (
                <div className="flex items-center gap-2 px-3 py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <p className="text-amber-300 text-xs">{advice.warning}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Composant d'analyse post-partie
export function AIStrategyAnalysis({ decisions, scores, scenarios, onClose }) {
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const result = await analyzeGameStrategy(decisions, scores, scenarios);
        setAnalysis(result);
      } catch (err) {
        console.error('Error analyzing strategy:', err);
      }
      setIsLoading(false);
    };
    fetchAnalysis();
  }, []);

  const gradeColors = {
    A: 'from-emerald-400 to-green-500',
    B: 'from-blue-400 to-cyan-500',
    C: 'from-amber-400 to-orange-500',
    D: 'from-red-400 to-rose-500'
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-slate-800/50 rounded-2xl p-6 border border-white/10"
      >
        <div className="flex items-center justify-center gap-3 py-8">
          <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
          <span className="text-slate-300">Analyse de votre stratégie en cours...</span>
        </div>
      </motion.div>
    );
  }

  if (!analysis) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 rounded-2xl p-6 border border-white/10"
    >
      <div className="flex items-center gap-3 mb-6">
        <Brain className="w-6 h-6 text-purple-400" />
        <h3 className="text-xl font-bold text-white">Analyse IA de votre stratégie</h3>
      </div>

      {/* Grade */}
      <div className="flex items-center gap-4 mb-6">
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradeColors[analysis.overallGrade]} flex items-center justify-center`}>
          <span className="text-3xl font-black text-white">{analysis.overallGrade}</span>
        </div>
        <p className="text-slate-300 flex-1">{analysis.summary}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {/* Strengths */}
        <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/30">
          <h4 className="font-semibold text-emerald-400 mb-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Points forts
          </h4>
          <ul className="space-y-2">
            {analysis.strengths?.map((s, i) => (
              <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                <span className="text-emerald-400">•</span>
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* Improvements */}
        <div className="bg-amber-500/10 rounded-xl p-4 border border-amber-500/30">
          <h4 className="font-semibold text-amber-400 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Axes d'amélioration
          </h4>
          <ul className="space-y-2">
            {analysis.improvements?.map((s, i) => (
              <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                <span className="text-amber-400">•</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Best decision & Alternative */}
      {analysis.bestDecision && (
        <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/30 mb-4">
          <h4 className="font-semibold text-blue-400 mb-2">🏆 Meilleure décision</h4>
          <p className="text-sm text-slate-300">{analysis.bestDecision}</p>
        </div>
      )}

      {analysis.alternativeStrategy && (
        <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/30 mb-4">
          <h4 className="font-semibold text-purple-400 mb-2">💡 Stratégie alternative à essayer</h4>
          <p className="text-sm text-slate-300">{analysis.alternativeStrategy}</p>
        </div>
      )}

      {analysis.realWorldTip && (
        <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-xl p-4 border border-emerald-500/30">
          <h4 className="font-semibold text-emerald-400 mb-2">🌍 À appliquer dans la vraie vie</h4>
          <p className="text-sm text-slate-300">{analysis.realWorldTip}</p>
        </div>
      )}
    </motion.div>
  );
}