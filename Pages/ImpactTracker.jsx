import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Plus, BarChart3, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ImpactTracker from '@/components/impact/ImpactTracker.jsx';
import ImpactVisualization, { calculateEcoScore } from '@/components/impact/ImpactVisualization.jsx';
import { BadgePopup } from '@/components/game/BadgeDisplay.jsx';
import { addPoints, POINTS_CONFIG } from '@/components/game/GamificationSystem.jsx';

export default function ImpactTrackerPage() {
  const [showForm, setShowForm] = useState(false);
  const [showBadge, setShowBadge] = useState(null);

  const { data: impactData = [], refetch } = useQuery({
    queryKey: ['impact-data'],
    queryFn: () => base44.entities.ImpactData.list('-created_date')
  });

  const handleDataSaved = () => {
    setShowForm(false);
    refetch();
    
    // Award points
    addPoints(30, 'Données impact enregistrées');
    
    // Check for eco-champion badge
    setTimeout(() => {
      const score = calculateEcoScore(impactData);
      if (score >= 80) {
        const badges = JSON.parse(localStorage.getItem('nird-badges') || '[]');
        if (!badges.includes('eco-champion')) {
          badges.push('eco-champion');
          localStorage.setItem('nird-badges', JSON.stringify(badges));
          setShowBadge('eco-champion');
        }
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to={createPageUrl('Home')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Accueil</span>
            </Link>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Leaf className="w-5 h-5 text-emerald-400" />
              Suivi Impact
            </h1>
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-gradient-to-r from-emerald-500 to-blue-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Info banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-2xl p-6"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-center flex-shrink-0">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white mb-1">Mesure ton impact</h2>
              <p className="text-slate-400 text-sm">
                Enregistre régulièrement les données de ton établissement pour suivre l'évolution 
                de ton empreinte numérique. Atteins un score de 80+ pour débloquer le badge Éco-Champion !
              </p>
            </div>
          </div>
        </motion.div>

        {/* Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <ImpactTracker onDataSaved={handleDataSaved} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Visualization */}
        <ImpactVisualization data={impactData} />

        {/* Recent entries */}
        {impactData.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-slate-800/50 rounded-2xl border border-white/10 p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Entrées récentes</h3>
            <div className="space-y-3">
              {impactData.slice(0, 5).map((entry, i) => (
                <div 
                  key={entry.id}
                  className="flex items-center justify-between p-3 bg-slate-700/30 rounded-xl"
                >
                  <div>
                    <p className="text-white font-medium">{entry.establishment_name}</p>
                    <p className="text-xs text-slate-400">{entry.month}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-emerald-400 font-semibold">{entry.co2_saved_kg || 0} kg CO₂</p>
                    <p className="text-xs text-slate-400">{entry.free_software_percentage}% libre</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Badge popup */}
      {showBadge && (
        <BadgePopup badge={showBadge} onClose={() => setShowBadge(null)} />
      )}
    </div>
  );
}