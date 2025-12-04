import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { 
  ArrowLeft, Building, Users, Leaf, Target, Trophy, TrendingUp,
  BarChart3, Calendar, Award, CheckCircle, Clock
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import { calculateEcoScore } from '@/components/impact/ImpactVisualization.jsx';
import { getCurrentWeekChallenges } from '@/components/game/GamificationSystem.jsx';

const COLORS = ['#10b981', '#3b82f6', '#f97316', '#8b5cf6', '#ec4899'];

export default function EstablishmentDashboard() {
  const [selectedEstablishment, setSelectedEstablishment] = useState('all');

  const { data: impactData = [] } = useQuery({
    queryKey: ['impact-data'],
    queryFn: () => base44.entities.ImpactData.list('-created_date')
  });

  const { data: forumPosts = [] } = useQuery({
    queryKey: ['forum-posts'],
    queryFn: () => base44.entities.ForumPost.list('-created_date')
  });

  // Get unique establishments
  const establishments = [...new Set(impactData.map(d => d.establishment_name).filter(Boolean))];
  
  // Filter data by establishment
  const filteredData = selectedEstablishment === 'all' 
    ? impactData 
    : impactData.filter(d => d.establishment_name === selectedEstablishment);

  // Calculate aggregated stats
  const stats = filteredData.reduce((acc, item) => ({
    totalCO2: acc.totalCO2 + (item.co2_saved_kg || 0),
    totalRecycled: acc.totalRecycled + (item.devices_recycled || 0),
    totalExtended: acc.totalExtended + (item.devices_extended_life || 0),
    totalLinux: acc.totalLinux + (item.linux_devices || 0),
    totalDevices: acc.totalDevices + (item.total_devices || 0),
    avgFreeSoftware: acc.avgFreeSoftware + (item.free_software_percentage || 0),
    entries: acc.entries + 1
  }), { totalCO2: 0, totalRecycled: 0, totalExtended: 0, totalLinux: 0, totalDevices: 0, avgFreeSoftware: 0, entries: 0 });

  const avgFreeSoftware = stats.entries > 0 ? Math.round(stats.avgFreeSoftware / stats.entries) : 0;
  const linuxPercentage = stats.totalDevices > 0 ? Math.round((stats.totalLinux / stats.totalDevices) * 100) : 0;
  const ecoScore = calculateEcoScore(filteredData);

  // Monthly evolution data
  const monthlyData = filteredData.reduce((acc, item) => {
    const month = item.month || 'N/A';
    if (!acc[month]) {
      acc[month] = { month, co2: 0, recycled: 0, libre: 0, count: 0 };
    }
    acc[month].co2 += item.co2_saved_kg || 0;
    acc[month].recycled += item.devices_recycled || 0;
    acc[month].libre += item.free_software_percentage || 0;
    acc[month].count += 1;
    return acc;
  }, {});

  const chartData = Object.values(monthlyData)
    .map(d => ({ ...d, libre: Math.round(d.libre / d.count) }))
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-6);

  // Establishment comparison data
  const establishmentComparison = establishments.map(name => {
    const estData = impactData.filter(d => d.establishment_name === name);
    const total = estData.reduce((sum, d) => sum + (d.co2_saved_kg || 0), 0);
    return { name: name.slice(0, 15), co2: total };
  }).sort((a, b) => b.co2 - a.co2).slice(0, 5);

  // Weekly challenges
  const challenges = getCurrentWeekChallenges();

  // Objectives
  const objectives = [
    { label: '100% logiciels libres', current: avgFreeSoftware, target: 100, icon: '🐧' },
    { label: '50 appareils recyclés', current: stats.totalRecycled, target: 50, icon: '♻️' },
    { label: '1000 kg CO₂ économisés', current: stats.totalCO2, target: 1000, icon: '🌍' },
    { label: '80% postes Linux', current: linuxPercentage, target: 80, icon: '💻' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to={createPageUrl('Profile')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Profil</span>
            </Link>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Building className="w-5 h-5 text-blue-400" />
              Tableau de bord
            </h1>
            <select
              value={selectedEstablishment}
              onChange={(e) => setSelectedEstablishment(e.target.value)}
              className="bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="all">Tous les établissements</option>
              {establishments.map(est => (
                <option key={est} value={est}>{est}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Global Score */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 rounded-2xl p-6"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold text-white mb-2">
                {selectedEstablishment === 'all' ? 'Impact Collectif' : selectedEstablishment}
              </h2>
              <p className="text-slate-400">
                {establishments.length} établissement{establishments.length > 1 ? 's' : ''} • {stats.entries} entrées
              </p>
            </div>
            <div className="flex items-center gap-8">
              <div className="text-center">
                <p className="text-4xl font-bold text-emerald-400">{stats.totalCO2}</p>
                <p className="text-sm text-slate-400">kg CO₂ économisés</p>
              </div>
              <div className="relative">
                <svg className="w-24 h-24 -rotate-90">
                  <circle cx="48" cy="48" r="40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                  <circle 
                    cx="48" cy="48" r="40" fill="none" 
                    stroke="url(#dashGradient)" strokeWidth="8"
                    strokeDasharray={`${ecoScore * 2.51} 251`}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="dashGradient">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-white">{ecoScore}</span>
                  <span className="text-xs text-slate-400">Score</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Appareils recyclés', value: stats.totalRecycled, icon: Leaf, color: 'text-emerald-400' },
            { label: 'Vies prolongées', value: stats.totalExtended, icon: TrendingUp, color: 'text-blue-400' },
            { label: 'Postes Linux', value: `${linuxPercentage}%`, icon: BarChart3, color: 'text-orange-400' },
            { label: 'Logiciels libres', value: `${avgFreeSoftware}%`, icon: Trophy, color: 'text-purple-400' }
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-slate-800/50 rounded-xl p-4 border border-white/10"
            >
              <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-slate-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* CO2 Evolution */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-slate-800/50 rounded-2xl border border-white/10 p-4"
          >
            <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Évolution mensuelle CO₂
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorCo2Dash" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickFormatter={v => v.slice(5)} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="co2" stroke="#10b981" fill="url(#colorCo2Dash)" name="CO₂ (kg)" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Establishment Comparison */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-slate-800/50 rounded-2xl border border-white/10 p-4"
          >
            <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
              <Building className="w-4 h-4 text-blue-400" />
              Top établissements
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={establishmentComparison} layout="vertical">
                <XAxis type="number" stroke="#64748b" fontSize={12} />
                <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={10} width={80} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                <Bar dataKey="co2" fill="#3b82f6" radius={[0, 4, 4, 0]} name="CO₂ (kg)" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Objectives & Challenges */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Objectives */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-slate-800/50 rounded-2xl border border-white/10 p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-orange-400" />
              Objectifs collectifs
            </h3>
            <div className="space-y-4">
              {objectives.map((obj, i) => {
                const progress = Math.min(100, Math.round((obj.current / obj.target) * 100));
                const isComplete = progress >= 100;
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="flex items-center gap-2 text-sm text-white">
                        <span>{obj.icon}</span>
                        {obj.label}
                      </span>
                      <span className={`text-sm font-medium ${isComplete ? 'text-emerald-400' : 'text-slate-400'}`}>
                        {obj.current}/{obj.target}
                      </span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${isComplete ? 'bg-emerald-500' : 'bg-gradient-to-r from-blue-500 to-purple-500'}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Active Challenges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-slate-800/50 rounded-2xl border border-white/10 p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              Défis en cours
            </h3>
            <div className="space-y-3">
              {challenges.slice(0, 3).map((challenge, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-xl">
                  <span className="text-2xl">{challenge.icon}</span>
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm">{challenge.title}</p>
                    <p className="text-xs text-slate-400">{challenge.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span className="text-xs text-slate-500">+{challenge.reward} pts</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Community Activity */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-slate-800/50 rounded-2xl border border-white/10 p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            Activité communautaire récente
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {forumPosts.slice(0, 3).map((post, i) => (
              <Link
                key={post.id}
                to={createPageUrl('Forum')}
                className="p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-colors"
              >
                <p className="text-white font-medium text-sm line-clamp-2">{post.title}</p>
                <p className="text-xs text-slate-400 mt-2">{post.author_name}</p>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}