import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, TrendingDown, Calculator, Download, 
  Monitor, Server, Users, FileText, BarChart3,
  ArrowLeft, Save
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#f97316', '#8b5cf6'];

export default function CostComparator() {
  const [inputs, setInputs] = useState({
    totalDevices: 150,
    servers: 3,
    users: 500,
    years: 3
  });

  const [savedComparison, setSavedComparison] = useState(null);

  // Calculs des coûts
  const calculateCosts = () => {
    const { totalDevices, servers, users, years } = inputs;

    // Coûts propriétaires (par an)
    const windowsLicensePerDevice = 50; // €/an
    const officeLicensePerUser = 80; // €/an
    const serverLicense = 500; // €/an par serveur
    const supportProprietary = totalDevices * 30; // €/an
    const hardwareReplacement = (totalDevices * 800) / 4; // Remplacement tous les 4 ans

    const proprietaryCosts = {
      windows: totalDevices * windowsLicensePerDevice,
      office: users * officeLicensePerUser,
      servers: servers * serverLicense,
      support: supportProprietary,
      hardware: hardwareReplacement,
      total: 0
    };
    proprietaryCosts.total = Object.values(proprietaryCosts).reduce((a, b) => a + b, 0) - proprietaryCosts.hardware; // Hardware séparé

    // Coûts libres (par an)
    const linuxSupport = totalDevices * 10; // Support réduit
    const libreOfficeSupport = users * 5; // Formation/support
    const serverSupport = servers * 100; // Support serveurs
    const hardwareExtended = (totalDevices * 600) / 6; // Remplacement tous les 6 ans (durée de vie prolongée)

    const libreCosts = {
      linux: 0, // Gratuit
      office: 0, // LibreOffice gratuit
      servers: servers * 50, // Support serveurs libres
      support: linuxSupport + libreOfficeSupport + serverSupport,
      hardware: hardwareExtended,
      total: 0
    };
    libreCosts.total = Object.values(libreCosts).reduce((a, b) => a + b, 0) - libreCosts.hardware;

    // Économies
    const annualSavings = proprietaryCosts.total - libreCosts.total;
    const totalSavings = annualSavings * years;
    const savingsPercentage = ((annualSavings / proprietaryCosts.total) * 100).toFixed(1);

    // Données pour graphiques
    const comparisonData = [
      { name: 'Windows/Licences', Propriétaire: proprietaryCosts.windows, Libre: 0 },
      { name: 'Office/Suite', Propriétaire: proprietaryCosts.office, Libre: 0 },
      { name: 'Serveurs', Propriétaire: proprietaryCosts.servers, Libre: libreCosts.servers },
      { name: 'Support', Propriétaire: proprietaryCosts.support, Libre: libreCosts.support },
    ];

    const pieData = [
      { name: 'Économies', value: annualSavings, color: '#10b981' },
      { name: 'Coûts libres', value: libreCosts.total, color: '#3b82f6' },
    ];

    const yearlyEvolution = Array.from({ length: years }, (_, i) => ({
      année: `Année ${i + 1}`,
      Propriétaire: proprietaryCosts.total * (i + 1),
      Libre: libreCosts.total * (i + 1),
      Économies: annualSavings * (i + 1)
    }));

    return {
      proprietary: proprietaryCosts,
      libre: libreCosts,
      annualSavings,
      totalSavings,
      savingsPercentage,
      comparisonData,
      pieData,
      yearlyEvolution
    };
  };

  const costs = calculateCosts();

  const handleInputChange = (field, value) => {
    const numValue = parseInt(value) || 0;
    setInputs(prev => ({ ...prev, [field]: numValue }));
  };

  const exportToPDF = () => {
    // Simulation d'export PDF (dans une vraie app, utiliser jsPDF)
    const report = `
COMPARATEUR DE COÛTS NIRD
========================

Configuration:
- Nombre de postes: ${inputs.totalDevices}
- Nombre de serveurs: ${inputs.servers}
- Nombre d'utilisateurs: ${inputs.users}
- Période: ${inputs.years} ans

COÛTS PROPRIÉTAIRES (par an):
- Licences Windows: ${costs.proprietary.windows.toLocaleString('fr-FR')} €
- Licences Office: ${costs.proprietary.office.toLocaleString('fr-FR')} €
- Licences serveurs: ${costs.proprietary.servers.toLocaleString('fr-FR')} €
- Support: ${costs.proprietary.support.toLocaleString('fr-FR')} €
- TOTAL ANNUEL: ${costs.proprietary.total.toLocaleString('fr-FR')} €

COÛTS LIBRES (par an):
- Linux: 0 €
- LibreOffice: 0 €
- Support serveurs: ${costs.libre.servers.toLocaleString('fr-FR')} €
- Support/Formation: ${costs.libre.support.toLocaleString('fr-FR')} €
- TOTAL ANNUEL: ${costs.libre.total.toLocaleString('fr-FR')} €

ÉCONOMIES:
- Économies annuelles: ${costs.annualSavings.toLocaleString('fr-FR')} €
- Économies sur ${inputs.years} ans: ${costs.totalSavings.toLocaleString('fr-FR')} €
- Pourcentage d'économie: ${costs.savingsPercentage}%
    `;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `comparateur-couts-nird-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to={createPageUrl('Home')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Accueil</span>
            </Link>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Calculator className="w-6 h-6 text-emerald-400" />
              Comparateur de Coûts
            </h1>
            <div className="w-20"></div> {/* Spacer */}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <p className="text-slate-400 max-w-2xl mx-auto">
            Comparez les coûts entre solutions propriétaires et libres pour votre établissement. 
            Visualisez les économies potentielles et exportez votre rapport.
          </p>
        </motion.div>

        {/* Inputs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/50 rounded-2xl border border-white/10 p-6 mb-8"
        >
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Monitor className="w-5 h-5 text-blue-400" />
            Configuration de votre établissement
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm text-slate-400 mb-2 block">Nombre de postes</label>
              <Input
                type="number"
                min="0"
                value={inputs.totalDevices}
                onChange={(e) => handleInputChange('totalDevices', e.target.value)}
                className="bg-slate-700/50 border-white/10 text-white"
              />
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-2 block">Nombre de serveurs</label>
              <Input
                type="number"
                min="0"
                value={inputs.servers}
                onChange={(e) => handleInputChange('servers', e.target.value)}
                className="bg-slate-700/50 border-white/10 text-white"
              />
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-2 block">Nombre d'utilisateurs</label>
              <Input
                type="number"
                min="0"
                value={inputs.users}
                onChange={(e) => handleInputChange('users', e.target.value)}
                className="bg-slate-700/50 border-white/10 text-white"
              />
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-2 block">Période (années)</label>
              <Input
                type="number"
                min="1"
                max="10"
                value={inputs.years}
                onChange={(e) => handleInputChange('years', e.target.value)}
                className="bg-slate-700/50 border-white/10 text-white"
              />
            </div>
          </div>
        </motion.div>

        {/* Résultats principaux */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-6 h-6 text-red-400" />
              <h3 className="text-lg font-semibold text-white">Coûts Propriétaires</h3>
            </div>
            <p className="text-3xl font-bold text-red-400 mb-1">
              {costs.proprietary.total.toLocaleString('fr-FR')} €
            </p>
            <p className="text-sm text-slate-400">par an</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <Server className="w-6 h-6 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Coûts Libres</h3>
            </div>
            <p className="text-3xl font-bold text-blue-400 mb-1">
              {costs.libre.total.toLocaleString('fr-FR')} €
            </p>
            <p className="text-sm text-slate-400">par an</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <TrendingDown className="w-6 h-6 text-emerald-400" />
              <h3 className="text-lg font-semibold text-white">Économies</h3>
            </div>
            <p className="text-3xl font-bold text-emerald-400 mb-1">
              {costs.annualSavings.toLocaleString('fr-FR')} €
            </p>
            <p className="text-sm text-slate-400">
              {costs.savingsPercentage}% par an • {costs.totalSavings.toLocaleString('fr-FR')} € sur {inputs.years} ans
            </p>
          </motion.div>
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Graphique en barres */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-slate-800/50 rounded-2xl border border-white/10 p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              Comparaison détaillée (par an)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={costs.comparisonData}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  formatter={(value) => `${value.toLocaleString('fr-FR')} €`}
                />
                <Legend />
                <Bar dataKey="Propriétaire" fill="#ef4444" />
                <Bar dataKey="Libre" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Graphique en camembert */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-slate-800/50 rounded-2xl border border-white/10 p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              Répartition des économies
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={costs.pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {costs.pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  formatter={(value) => `${value.toLocaleString('fr-FR')} €`}
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Évolution dans le temps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-slate-800/50 rounded-2xl border border-white/10 p-6 mb-8"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-emerald-400" />
            Évolution des coûts sur {inputs.years} ans
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={costs.yearlyEvolution}>
              <XAxis dataKey="année" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                formatter={(value) => `${value.toLocaleString('fr-FR')} €`}
              />
              <Legend />
              <Line type="monotone" dataKey="Propriétaire" stroke="#ef4444" strokeWidth={2} />
              <Line type="monotone" dataKey="Libre" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="Économies" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Détails des coûts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Coûts Propriétaires (détail)</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Licences Windows</span>
                <span className="text-white font-medium">{costs.proprietary.windows.toLocaleString('fr-FR')} €</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Licences Office</span>
                <span className="text-white font-medium">{costs.proprietary.office.toLocaleString('fr-FR')} €</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Licences serveurs</span>
                <span className="text-white font-medium">{costs.proprietary.servers.toLocaleString('fr-FR')} €</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Support technique</span>
                <span className="text-white font-medium">{costs.proprietary.support.toLocaleString('fr-FR')} €</span>
              </div>
              <div className="border-t border-red-500/30 pt-3 mt-3 flex justify-between">
                <span className="text-white font-semibold">Total annuel</span>
                <span className="text-red-400 font-bold text-lg">{costs.proprietary.total.toLocaleString('fr-FR')} €</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Coûts Libres (détail)</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Linux</span>
                <span className="text-emerald-400 font-medium">0 € (gratuit)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">LibreOffice</span>
                <span className="text-emerald-400 font-medium">0 € (gratuit)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Support serveurs</span>
                <span className="text-white font-medium">{costs.libre.servers.toLocaleString('fr-FR')} €</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Formation/Support</span>
                <span className="text-white font-medium">{costs.libre.support.toLocaleString('fr-FR')} €</span>
              </div>
              <div className="border-t border-blue-500/30 pt-3 mt-3 flex justify-between">
                <span className="text-white font-semibold">Total annuel</span>
                <span className="text-blue-400 font-bold text-lg">{costs.libre.total.toLocaleString('fr-FR')} €</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            onClick={exportToPDF}
            className="bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            Exporter le rapport
          </Button>
          <Button
            onClick={() => {
              const comparison = {
                ...inputs,
                ...costs,
                date: new Date().toISOString()
              };
              localStorage.setItem('nird-saved-comparison', JSON.stringify(comparison));
              setSavedComparison(comparison);
            }}
            className="bg-white/10 hover:bg-white/20 flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            Sauvegarder cette comparaison
          </Button>
        </motion.div>

        {savedComparison && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center"
          >
            <p className="text-emerald-400">Comparaison sauvegardée !</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

