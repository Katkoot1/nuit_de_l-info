import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import { Leaf, Recycle, Monitor, Zap, TrendingUp, Award } from 'lucide-react';

const COLORS = ['#10b981', '#3b82f6', '#f97316', '#8b5cf6'];

export default function ImpactVisualization({ data = [] }) {
  // Calculate totals
  const totals = data.reduce((acc, item) => ({
    co2_saved: acc.co2_saved + (item.co2_saved_kg || 0),
    devices_recycled: acc.devices_recycled + (item.devices_recycled || 0),
    devices_extended: acc.devices_extended + (item.devices_extended_life || 0),
    linux_devices: acc.linux_devices + (item.linux_devices || 0),
    total_devices: acc.total_devices + (item.total_devices || 0),
    free_software_avg: acc.free_software_avg + (item.free_software_percentage || 0)
  }), { co2_saved: 0, devices_recycled: 0, devices_extended: 0, linux_devices: 0, total_devices: 0, free_software_avg: 0 });

  const avgFreeSoftware = data.length > 0 ? Math.round(totals.free_software_avg / data.length) : 0;
  const linuxPercentage = totals.total_devices > 0 ? Math.round((totals.linux_devices / totals.total_devices) * 100) : 0;

  // Prepare chart data
  const chartData = data.slice(-6).map(item => ({
    month: item.month?.slice(5) || '',
    co2: item.co2_saved_kg || 0,
    recycled: item.devices_recycled || 0,
    libre: item.free_software_percentage || 0
  }));

  const pieData = [
    { name: 'Linux', value: totals.linux_devices },
    { name: 'Autres', value: Math.max(0, totals.total_devices - totals.linux_devices) }
  ];

  // Calculate eco-score (0-100)
  const ecoScore = Math.min(100, Math.round(
    (avgFreeSoftware * 0.3) +
    (linuxPercentage * 0.3) +
    (Math.min(totals.devices_recycled * 5, 20)) +
    (Math.min(totals.devices_extended * 5, 20))
  ));

  const stats = [
    { label: 'CO₂ économisé', value: `${totals.co2_saved} kg`, icon: Leaf, color: 'text-emerald-400' },
    { label: 'Appareils recyclés', value: totals.devices_recycled, icon: Recycle, color: 'text-blue-400' },
    { label: 'Vies prolongées', value: totals.devices_extended, icon: Monitor, color: 'text-orange-400' },
    { label: 'Logiciels libres', value: `${avgFreeSoftware}%`, icon: Zap, color: 'text-purple-400' }
  ];

  if (data.length === 0) {
    return (
      <div className="bg-slate-800/50 rounded-2xl border border-white/10 p-8 text-center">
        <TrendingUp className="w-12 h-12 text-slate-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">Aucune donnée</h3>
        <p className="text-slate-400">Commence à enregistrer des données pour voir ton impact !</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Eco-Score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Score Éco-Impact</h3>
            <p className="text-sm text-slate-400">Performance environnementale globale</p>
          </div>
          <div className="relative">
            <svg className="w-24 h-24 -rotate-90">
              <circle cx="48" cy="48" r="40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
              <circle 
                cx="48" cy="48" r="40" fill="none" 
                stroke="url(#gradient)" strokeWidth="8"
                strokeDasharray={`${ecoScore * 2.51} 251`}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="gradient">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">{ecoScore}</span>
            </div>
          </div>
        </div>
        {ecoScore >= 80 && (
          <div className="mt-4 flex items-center gap-2 text-amber-400">
            <Award className="w-5 h-5" />
            <span className="text-sm font-medium">Éligible au badge Éco-Champion !</span>
          </div>
        )}
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
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

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* CO2 evolution */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-slate-800/50 rounded-2xl border border-white/10 p-4"
        >
          <h3 className="text-sm font-medium text-white mb-4">Évolution CO₂ économisé</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorCo2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                labelStyle={{ color: '#fff' }}
              />
              <Area type="monotone" dataKey="co2" stroke="#10b981" fill="url(#colorCo2)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Linux vs Others pie */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-slate-800/50 rounded-2xl border border-white/10 p-4"
        >
          <h3 className="text-sm font-medium text-white mb-4">Répartition des postes</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}

export function calculateEcoScore(data) {
  if (!data || data.length === 0) return 0;
  
  const totals = data.reduce((acc, item) => ({
    devices_recycled: acc.devices_recycled + (item.devices_recycled || 0),
    devices_extended: acc.devices_extended + (item.devices_extended_life || 0),
    linux_devices: acc.linux_devices + (item.linux_devices || 0),
    total_devices: acc.total_devices + (item.total_devices || 0),
    free_software_avg: acc.free_software_avg + (item.free_software_percentage || 0)
  }), { devices_recycled: 0, devices_extended: 0, linux_devices: 0, total_devices: 0, free_software_avg: 0 });

  const avgFreeSoftware = Math.round(totals.free_software_avg / data.length);
  const linuxPercentage = totals.total_devices > 0 ? Math.round((totals.linux_devices / totals.total_devices) * 100) : 0;

  return Math.min(100, Math.round(
    (avgFreeSoftware * 0.3) +
    (linuxPercentage * 0.3) +
    (Math.min(totals.devices_recycled * 5, 20)) +
    (Math.min(totals.devices_extended * 5, 20))
  ));
}