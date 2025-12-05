import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Leaf, Calculator } from 'lucide-react';
import { createPageUrl } from '@/utils';
import CarbonFootprintCalculator from '@/components/impact/CarbonFootprintCalculator.jsx';

export default function CarbonFootprintCalculatorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link 
              to={createPageUrl('Home')} 
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Accueil</span>
            </Link>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Leaf className="w-5 h-5 text-emerald-400" />
              Calculateur d'empreinte carbone
            </h1>
            <div className="w-20" /> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Info banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-2xl p-6 mb-8"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-center flex-shrink-0">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white mb-1">Estimez l'empreinte carbone de votre établissement</h2>
              <p className="text-slate-400 text-sm">
                Répondez aux questions guidées sur vos équipements, infrastructure et consommation énergétique. 
                Obtenez un rapport détaillé avec des comparaisons et des recommandations personnalisées pour réduire votre impact environnemental.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Calculator component */}
        <CarbonFootprintCalculator />
      </div>
    </div>
  );
}


