import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Monitor, Server, Wifi, Cloud, Database, Zap, 
  ArrowRight, ArrowLeft, CheckCircle2, TrendingUp, 
  Download, Leaf, AlertCircle, Lightbulb, BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Facteurs d'émission (kg CO2e par unité/an)
const EMISSION_FACTORS = {
  desktop: 275, // kg CO2e par poste desktop/an
  laptop: 154, // kg CO2e par laptop/an
  tablet: 30, // kg CO2e par tablette/an
  smartphone: 29, // kg CO2e par smartphone/an
  server: 1000, // kg CO2e par serveur/an (moyenne)
  network: 25, // kg CO2e par équipement réseau/an
  cloudStorage: 0.1, // kg CO2e par GB/an
  dataTransfer: 0.05, // kg CO2e par GB transféré
  printer: 50, // kg CO2e par imprimante/an
  screen: 75, // kg CO2e par écran supplémentaire/an
};

// Questions guidées
const QUESTIONS = [
  {
    id: 'establishment',
    title: 'Informations de base',
    icon: Monitor,
    fields: [
      {
        id: 'establishment_name',
        label: 'Nom de l\'établissement',
        type: 'text',
        placeholder: 'Ex: École élémentaire Jean Dupont',
        required: true
      },
      {
        id: 'establishment_type',
        label: 'Type d\'établissement',
        type: 'select',
        options: [
          { value: 'primary', label: 'École primaire' },
          { value: 'middle', label: 'Collège' },
          { value: 'high', label: 'Lycée' },
          { value: 'university', label: 'Université' },
          { value: 'other', label: 'Autre' }
        ],
        required: true
      },
      {
        id: 'num_students',
        label: 'Nombre d\'élèves/étudiants',
        type: 'number',
        placeholder: '0',
        required: true
      },
      {
        id: 'num_staff',
        label: 'Nombre de personnel',
        type: 'number',
        placeholder: '0',
        required: true
      }
    ]
  },
  {
    id: 'devices',
    title: 'Équipements informatiques',
    icon: Monitor,
    fields: [
      {
        id: 'num_desktops',
        label: 'Nombre de postes de travail fixes',
        type: 'number',
        placeholder: '0',
        icon: Monitor,
        help: 'Ordinateurs de bureau fixes'
      },
      {
        id: 'num_laptops',
        label: 'Nombre d\'ordinateurs portables',
        type: 'number',
        placeholder: '0',
        icon: Monitor,
        help: 'Laptops et notebooks'
      },
      {
        id: 'num_tablets',
        label: 'Nombre de tablettes',
        type: 'number',
        placeholder: '0',
        icon: Monitor,
        help: 'Tablettes tactiles'
      },
      {
        id: 'num_smartphones',
        label: 'Nombre de smartphones',
        type: 'number',
        placeholder: '0',
        icon: Monitor,
        help: 'Téléphones intelligents pour l\'établissement'
      },
      {
        id: 'num_screens',
        label: 'Nombre d\'écrans supplémentaires',
        type: 'number',
        placeholder: '0',
        icon: Monitor,
        help: 'Écrans additionnels (projecteurs, écrans externes)'
      },
      {
        id: 'num_printers',
        label: 'Nombre d\'imprimantes',
        type: 'number',
        placeholder: '0',
        icon: Monitor,
        help: 'Imprimantes et scanners'
      }
    ]
  },
  {
    id: 'infrastructure',
    title: 'Infrastructure serveur et réseau',
    icon: Server,
    fields: [
      {
        id: 'num_servers',
        label: 'Nombre de serveurs',
        type: 'number',
        placeholder: '0',
        icon: Server,
        help: 'Serveurs physiques ou virtuels'
      },
      {
        id: 'server_usage_hours',
        label: 'Heures d\'utilisation serveurs/jour',
        type: 'number',
        placeholder: '24',
        icon: Server,
        help: 'Nombre d\'heures par jour (24 pour serveurs toujours allumés)'
      },
      {
        id: 'num_network_devices',
        label: 'Équipements réseau',
        type: 'number',
        placeholder: '0',
        icon: Wifi,
        help: 'Routeurs, switches, points d\'accès WiFi'
      },
      {
        id: 'cloud_storage_gb',
        label: 'Stockage cloud (GB)',
        type: 'number',
        placeholder: '0',
        icon: Cloud,
        help: 'Espace de stockage cloud utilisé'
      },
      {
        id: 'monthly_data_transfer_gb',
        label: 'Transfert de données mensuel (GB)',
        type: 'number',
        placeholder: '0',
        icon: Database,
        help: 'Données transférées chaque mois'
      }
    ]
  },
  {
    id: 'energy',
    title: 'Consommation énergétique',
    icon: Zap,
    fields: [
      {
        id: 'annual_electricity_kwh',
        label: 'Consommation électrique annuelle (kWh)',
        type: 'number',
        placeholder: '0',
        icon: Zap,
        help: 'Si disponible, sinon laissez vide pour estimation'
      },
      {
        id: 'renewable_energy_percentage',
        label: '% d\'énergie renouvelable',
        type: 'number',
        placeholder: '0',
        icon: Leaf,
        help: 'Pourcentage d\'électricité provenant de sources renouvelables',
        max: 100
      }
    ]
  }
];

export default function CarbonFootprintCalculator() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [results, setResults] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const updateField = (fieldId, value) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  const nextStep = () => {
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const calculateFootprint = () => {
    setIsCalculating(true);
    
    // Calcul de l'empreinte par catégorie
    const calculations = {
      devices: 0,
      infrastructure: 0,
      energy: 0,
      total: 0
    };

    // Équipements
    calculations.devices = 
      (Number(formData.num_desktops || 0) * EMISSION_FACTORS.desktop) +
      (Number(formData.num_laptops || 0) * EMISSION_FACTORS.laptop) +
      (Number(formData.num_tablets || 0) * EMISSION_FACTORS.tablet) +
      (Number(formData.num_smartphones || 0) * EMISSION_FACTORS.smartphone) +
      (Number(formData.num_screens || 0) * EMISSION_FACTORS.screen) +
      (Number(formData.num_printers || 0) * EMISSION_FACTORS.printer);

    // Infrastructure
    const serverHours = Number(formData.server_usage_hours || 24);
    const serverMultiplier = serverHours / 24; // Facteur d'utilisation
    calculations.infrastructure = 
      (Number(formData.num_servers || 0) * EMISSION_FACTORS.server * serverMultiplier) +
      (Number(formData.num_network_devices || 0) * EMISSION_FACTORS.network) +
      (Number(formData.cloud_storage_gb || 0) * EMISSION_FACTORS.cloudStorage) +
      (Number(formData.monthly_data_transfer_gb || 0) * 12 * EMISSION_FACTORS.dataTransfer);

    // Énergie (si fournie, sinon estimation basée sur équipements)
    const renewablePercentage = Number(formData.renewable_energy_percentage || 0);
    const renewableFactor = 1 - (renewablePercentage / 100);

    if (formData.annual_electricity_kwh) {
      // Facteur d'émission électrique français moyen: ~0.05 kg CO2e/kWh
      calculations.energy = Number(formData.annual_electricity_kwh) * 0.05 * renewableFactor;
    } else {
      // Estimation: 20% de plus que la consommation des équipements
      calculations.energy = (calculations.devices + calculations.infrastructure) * 0.2 * renewableFactor;
    }

    calculations.total = calculations.devices + calculations.infrastructure + calculations.energy;

    // Comparaisons et benchmarks
    const totalPeople = Number(formData.num_students || 0) + Number(formData.num_staff || 0);
    const footprintPerPerson = totalPeople > 0 ? calculations.total / totalPeople : 0;
    
    // Benchmark moyen: ~150 kg CO2e/personne/an pour le numérique éducatif
    const benchmarkAverage = 150;
    const benchmarkGood = 100;
    const benchmarkExcellent = 50;

    // Calcul du score (sur 100)
    let score = 100;
    if (footprintPerPerson > benchmarkAverage) {
      score = Math.max(0, 100 - ((footprintPerPerson - benchmarkAverage) / benchmarkAverage * 50));
    } else if (footprintPerPerson < benchmarkExcellent) {
      score = Math.min(100, 100 + ((benchmarkExcellent - footprintPerPerson) / benchmarkExcellent * 20));
    }

    // Recommandations
    const recommendations = generateRecommendations(formData, calculations, footprintPerPerson);

    setResults({
      ...calculations,
      footprintPerPerson,
      benchmarkAverage,
      benchmarkGood,
      benchmarkExcellent,
      score: Math.round(score),
      recommendations,
      formData: { ...formData }
    });

    setIsCalculating(false);
  };

  const generateRecommendations = (data, calculations, perPerson) => {
    const recs = [];

    // Recommandations basées sur les équipements
    if (Number(data.num_desktops || 0) > Number(data.num_laptops || 0)) {
      recs.push({
        priority: 'high',
        category: 'Équipements',
        title: 'Privilégier les ordinateurs portables',
        description: 'Les laptops consomment ~40% moins d\'énergie que les postes fixes. Privilégiez les portables pour les nouveaux achats.',
        impact: 'Réduction estimée: 15-20% de l\'empreinte équipements'
      });
    }

    if (Number(data.num_servers || 0) > 0 && Number(data.server_usage_hours || 24) === 24) {
      recs.push({
        priority: 'high',
        category: 'Infrastructure',
        title: 'Optimiser l\'utilisation des serveurs',
        description: 'Mettre en place des politiques d\'extinction automatique ou migrer vers le cloud avec mutualisation.',
        impact: 'Réduction estimée: 30-50% de l\'empreinte serveurs'
      });
    }

    if (Number(data.renewable_energy_percentage || 0) < 50) {
      recs.push({
        priority: 'medium',
        category: 'Énergie',
        title: 'Passer à une énergie renouvelable',
        description: 'Choisir un fournisseur d\'électricité verte pour réduire significativement l\'empreinte carbone.',
        impact: 'Réduction estimée: jusqu\'à 100% de l\'empreinte énergétique'
      });
    }

    if (Number(data.cloud_storage_gb || 0) > 1000) {
      recs.push({
        priority: 'medium',
        category: 'Données',
        title: 'Nettoyer le stockage cloud',
        description: 'Supprimer les fichiers inutilisés et optimiser le stockage pour réduire la consommation énergétique.',
        impact: 'Réduction estimée: 10-15% de l\'empreinte infrastructure'
      });
    }

    if (calculations.devices > calculations.total * 0.5) {
      recs.push({
        priority: 'medium',
        category: 'Équipements',
        title: 'Prolonger la durée de vie des équipements',
        description: 'Allonger la durée d\'utilisation des appareils (5-6 ans au lieu de 3-4 ans) réduit l\'empreinte de fabrication.',
        impact: 'Réduction estimée: 20-30% de l\'empreinte équipements'
      });
    }

    if (perPerson > 150) {
      recs.push({
        priority: 'high',
        category: 'Global',
        title: 'Audit complet nécessaire',
        description: 'Votre empreinte est supérieure à la moyenne. Un audit détaillé permettrait d\'identifier les sources principales.',
        impact: 'Réduction potentielle: 20-40% avec actions ciblées'
      });
    }

    // Recommandation générique si peu de données
    if (recs.length === 0) {
      recs.push({
        priority: 'low',
        category: 'Général',
        title: 'Continuer à mesurer et améliorer',
        description: 'Maintenir un suivi régulier de votre empreinte carbone et mettre en place des actions d\'amélioration continue.',
        impact: 'Amélioration continue'
      });
    }

    return recs;
  };

  const exportToPDF = async () => {
    const reportElement = document.getElementById('carbon-footprint-report');
    if (!reportElement) return;

    try {
      const canvas = await html2canvas(reportElement, {
        scale: 2,
        backgroundColor: '#0f172a',
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const fileName = `empreinte-carbone-${formData.establishment_name?.replace(/\s+/g, '-') || 'rapport'}-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Erreur lors de l\'export PDF:', error);
      alert('Erreur lors de l\'export PDF. Veuillez réessayer.');
    }
  };

  const currentQuestion = QUESTIONS[currentStep];
  const isLastStep = currentStep === QUESTIONS.length - 1;
  const canProceed = currentQuestion.fields.every(field => 
    !field.required || formData[field.id]
  );

  if (results) {
    return <ResultsView results={results} onReset={() => { setResults(null); setCurrentStep(0); setFormData({}); }} onExportPDF={exportToPDF} />;
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/50 rounded-2xl border border-white/10 p-6"
      >
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold text-white">Calculateur d'empreinte carbone</h2>
            <span className="text-sm text-slate-400">
              Étape {currentStep + 1} / {QUESTIONS.length}
            </span>
          </div>
          <div className="w-full bg-slate-700/50 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / QUESTIONS.length) * 100}%` }}
              className="bg-gradient-to-r from-emerald-500 to-blue-500 h-2 rounded-full"
            />
          </div>
        </div>

        {/* Question form */}
        <form onSubmit={(e) => { e.preventDefault(); isLastStep ? calculateFootprint() : nextStep(); }}>
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-center">
                <currentQuestion.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">{currentQuestion.title}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion.fields.map(field => (
                <div key={field.id} className={field.type === 'select' ? 'md:col-span-2' : ''}>
                  <label className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                    {field.icon && <field.icon className="w-4 h-4" />}
                    {field.label}
                    {field.required && <span className="text-red-400">*</span>}
                  </label>
                  
                  {field.type === 'select' ? (
                    <select
                      value={formData[field.id] || ''}
                      onChange={(e) => updateField(field.id, e.target.value)}
                      className="w-full px-4 py-2 bg-slate-700/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required={field.required}
                    >
                      <option value="">Sélectionner...</option>
                      {field.options.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  ) : (
                    <Input
                      type={field.type}
                      value={formData[field.id] || ''}
                      onChange={(e) => updateField(field.id, e.target.value)}
                      placeholder={field.placeholder}
                      min={0}
                      max={field.max}
                      className="bg-slate-700/50 border-white/10 text-white"
                      required={field.required}
                    />
                  )}

                  {field.help && (
                    <p className="text-xs text-slate-500 mt-1">{field.help}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between gap-4">
            <Button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="bg-slate-700 hover:bg-slate-600 text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Précédent
            </Button>

            <Button
              type="submit"
              disabled={!canProceed || isCalculating}
              className="bg-gradient-to-r from-emerald-500 to-blue-500"
            >
              {isCalculating ? (
                'Calcul en cours...'
              ) : isLastStep ? (
                <>
                  Calculer l'empreinte
                  <Zap className="w-4 h-4 ml-2" />
                </>
              ) : (
                <>
                  Suivant
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function ResultsView({ results, onReset, onExportPDF }) {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Bon';
    if (score >= 40) return 'Moyen';
    return 'À améliorer';
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Report content for PDF export */}
      <div id="carbon-footprint-report" className="bg-slate-900 p-8 space-y-8">
        {/* Header */}
        <div className="text-center border-b border-white/10 pb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-center">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Rapport d'Empreinte Carbone</h1>
          </div>
          <p className="text-slate-400">
            {results.formData.establishment_name || 'Établissement'} - {new Date().toLocaleDateString('fr-FR')}
          </p>
        </div>

        {/* Score and Total */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-2xl p-6 border border-emerald-500/30"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Score NIRD</h3>
              <BarChart3 className="w-5 h-5 text-emerald-400" />
            </div>
            <div className={`text-5xl font-bold ${getScoreColor(results.score)} mb-2`}>
              {results.score}/100
            </div>
            <p className="text-slate-400">{getScoreLabel(results.score)}</p>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-800/50 rounded-2xl p-6 border border-white/10"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Empreinte totale</h3>
              <Leaf className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-5xl font-bold text-white mb-2">
              {Math.round(results.total)} <span className="text-2xl">kg CO₂e</span>
            </div>
            <p className="text-slate-400">par an</p>
          </motion.div>
        </div>

        {/* Breakdown by category */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800/50 rounded-2xl p-6 border border-white/10"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            Répartition par catégorie
          </h3>
          <div className="space-y-4">
            <CategoryBar 
              label="Équipements informatiques" 
              value={results.devices} 
              total={results.total}
              color="from-blue-500 to-cyan-500"
            />
            <CategoryBar 
              label="Infrastructure (serveurs, réseau)" 
              value={results.infrastructure} 
              total={results.total}
              color="from-purple-500 to-pink-500"
            />
            <CategoryBar 
              label="Consommation énergétique" 
              value={results.energy} 
              total={results.total}
              color="from-yellow-500 to-orange-500"
            />
          </div>
        </motion.div>

        {/* Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-800/50 rounded-2xl p-6 border border-white/10"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            Comparaison avec les benchmarks
          </h3>
          <div className="space-y-4">
            <ComparisonBar 
              label="Votre empreinte" 
              value={results.footprintPerPerson} 
              unit="kg CO₂e/personne"
              color="from-emerald-500 to-blue-500"
            />
            <ComparisonBar 
              label="Moyenne secteur" 
              value={results.benchmarkAverage} 
              unit="kg CO₂e/personne"
              color="from-yellow-500 to-orange-500"
            />
            <ComparisonBar 
              label="Objectif bon niveau" 
              value={results.benchmarkGood} 
              unit="kg CO₂e/personne"
              color="from-blue-500 to-cyan-500"
            />
            <ComparisonBar 
              label="Objectif excellent" 
              value={results.benchmarkExcellent} 
              unit="kg CO₂e/personne"
              color="from-emerald-400 to-green-500"
            />
          </div>
          <div className="mt-4 p-4 bg-slate-700/30 rounded-xl">
            <p className="text-sm text-slate-300">
              {results.footprintPerPerson > results.benchmarkAverage ? (
                <>
                  <AlertCircle className="w-4 h-4 inline mr-2 text-yellow-400" />
                  Votre empreinte est supérieure à la moyenne. Des actions d'amélioration sont recommandées.
                </>
              ) : results.footprintPerPerson < results.benchmarkExcellent ? (
                <>
                  <CheckCircle2 className="w-4 h-4 inline mr-2 text-emerald-400" />
                  Félicitations ! Votre empreinte est excellente. Continuez sur cette voie !
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 inline mr-2 text-blue-400" />
                  Votre empreinte est dans la moyenne. Des améliorations sont possibles.
                </>
              )}
            </p>
          </div>
        </motion.div>

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-800/50 rounded-2xl p-6 border border-white/10"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-400" />
            Recommandations
          </h3>
          <div className="space-y-4">
            {results.recommendations.map((rec, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl border ${
                  rec.priority === 'high' 
                    ? 'bg-red-500/10 border-red-500/30' 
                    : rec.priority === 'medium'
                    ? 'bg-yellow-500/10 border-yellow-500/30'
                    : 'bg-blue-500/10 border-blue-500/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    rec.priority === 'high' 
                      ? 'bg-red-500/20' 
                      : rec.priority === 'medium'
                      ? 'bg-yellow-500/20'
                      : 'bg-blue-500/20'
                  }`}>
                    <AlertCircle className={`w-4 h-4 ${
                      rec.priority === 'high' 
                        ? 'text-red-400' 
                        : rec.priority === 'medium'
                        ? 'text-yellow-400'
                        : 'text-blue-400'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-white">{rec.title}</h4>
                      <span className={`text-xs px-2 py-1 rounded ${
                        rec.priority === 'high' 
                          ? 'bg-red-500/20 text-red-400' 
                          : rec.priority === 'medium'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {rec.category}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mb-2">{rec.description}</p>
                    <p className="text-xs text-emerald-400 font-medium">{rec.impact}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-4">
        <Button
          onClick={onReset}
          className="flex-1 bg-slate-700 hover:bg-slate-600 text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Nouveau calcul
        </Button>
        <Button
          onClick={onExportPDF}
          className="flex-1 bg-gradient-to-r from-emerald-500 to-blue-500"
        >
          <Download className="w-4 h-4 mr-2" />
          Exporter en PDF
        </Button>
      </div>
    </div>
  );
}

function CategoryBar({ label, value, total, color }) {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-slate-300">{label}</span>
        <span className="text-sm font-semibold text-white">{Math.round(value)} kg CO₂e ({Math.round(percentage)}%)</span>
      </div>
      <div className="w-full bg-slate-700/50 rounded-full h-3">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          className={`bg-gradient-to-r ${color} h-3 rounded-full`}
        />
      </div>
    </div>
  );
}

function ComparisonBar({ label, value, unit, color }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-slate-300">{label}</span>
        <span className="text-sm font-semibold text-white">{Math.round(value)} {unit}</span>
      </div>
      <div className="w-full bg-slate-700/50 rounded-full h-4">
        <div
          style={{ width: `${Math.min((value / 200) * 100, 100)}%` }}
          className={`bg-gradient-to-r ${color} h-4 rounded-full`}
        />
      </div>
    </div>
  );
}


