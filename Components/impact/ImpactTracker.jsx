import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { 
  Zap, Recycle, Monitor, Leaf, Server, Save, TrendingDown, Award,
  Plus, Calendar, Building
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';

const formFields = [
  { id: 'server_consumption_kwh', label: 'Consommation serveurs (kWh)', icon: Server, type: 'number', placeholder: '0' },
  { id: 'devices_recycled', label: 'Appareils recyclés', icon: Recycle, type: 'number', placeholder: '0' },
  { id: 'devices_extended_life', label: 'Appareils prolongés', icon: Monitor, type: 'number', placeholder: '0' },
  { id: 'linux_devices', label: 'Postes Linux', icon: Monitor, type: 'number', placeholder: '0' },
  { id: 'total_devices', label: 'Total postes', icon: Monitor, type: 'number', placeholder: '0' },
];

export default function ImpactTracker({ onDataSaved }) {
  const [formData, setFormData] = useState({
    establishment_name: '',
    month: new Date().toISOString().slice(0, 7),
    server_consumption_kwh: '',
    devices_recycled: '',
    devices_extended_life: '',
    free_software_percentage: 50,
    linux_devices: '',
    total_devices: '',
    notes: ''
  });

  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      // Calculate estimated CO2 saved (convert empty strings to 0)
      const devicesRecycled = Number(data.devices_recycled) || 0;
      const devicesExtended = Number(data.devices_extended_life) || 0;
      const linuxDevices = Number(data.linux_devices) || 0;
      
      const co2_saved_kg = 
        (devicesRecycled * 150) + // ~150kg CO2 par appareil non produit
        (devicesExtended * 50) + // ~50kg CO2 par année de vie prolongée
        (linuxDevices * 20); // ~20kg CO2 économisé par poste Linux vs Windows
      
      return base44.entities.ImpactData.create({ ...data, co2_saved_kg });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['impact-data'] });
      if (onDataSaved) onDataSaved();
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Convertir les chaînes vides en 0 pour l'envoi
    const dataToSave = {
      ...formData,
      server_consumption_kwh: Number(formData.server_consumption_kwh) || 0,
      devices_recycled: Number(formData.devices_recycled) || 0,
      devices_extended_life: Number(formData.devices_extended_life) || 0,
      linux_devices: Number(formData.linux_devices) || 0,
      total_devices: Number(formData.total_devices) || 0
    };
    saveMutation.mutate(dataToSave);
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNumberChange = (field, e) => {
    const inputValue = e.target.value;
    // Si le champ est vide, on met une chaîne vide (pas 0)
    if (inputValue === '') {
      updateField(field, '');
    } else {
      // Convertir en nombre, ou garder 0 si invalide
      const numValue = parseInt(inputValue, 10);
      updateField(field, isNaN(numValue) ? '' : numValue);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 rounded-2xl border border-white/10 p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-center">
          <Leaf className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Suivi d'impact NIRD</h2>
          <p className="text-sm text-slate-400">Enregistre les données de ton établissement</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Establishment & Month */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-sm text-slate-400 mb-2">
              <Building className="w-4 h-4" />
              Établissement
            </label>
            <Input
              value={formData.establishment_name}
              onChange={(e) => updateField('establishment_name', e.target.value)}
              placeholder="Nom de l'établissement"
              className="bg-slate-700/50 border-white/10 text-white"
              required
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm text-slate-400 mb-2">
              <Calendar className="w-4 h-4" />
              Mois
            </label>
            <Input
              type="month"
              value={formData.month}
              onChange={(e) => updateField('month', e.target.value)}
              className="bg-slate-700/50 border-white/10 text-white"
              required
            />
          </div>
        </div>

        {/* Numeric fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {formFields.map(field => (
            <div key={field.id}>
              <label className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                <field.icon className="w-4 h-4" />
                {field.label}
              </label>
              <Input
                type="number"
                min="0"
                value={formData[field.id] === 0 ? '' : (formData[field.id] || '')}
                onChange={(e) => handleNumberChange(field.id, e)}
                onFocus={(e) => {
                  // Si la valeur est 0 ou vide, sélectionner tout pour permettre de taper directement
                  if (e.target.value === '0' || e.target.value === '') {
                    e.target.select();
                  }
                }}
                placeholder={field.placeholder}
                className="bg-slate-700/50 border-white/10 text-white"
              />
            </div>
          ))}
        </div>

        {/* Free software slider */}
        <div>
          <label className="flex items-center justify-between text-sm text-slate-400 mb-3">
            <span className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Logiciels libres utilisés
            </span>
            <span className="text-emerald-400 font-semibold">{formData.free_software_percentage}%</span>
          </label>
          <Slider
            value={[formData.free_software_percentage]}
            onValueChange={([value]) => updateField('free_software_percentage', value)}
            max={100}
            step={5}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>0% (Propriétaire)</span>
            <span>100% (Libre)</span>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="text-sm text-slate-400 mb-2 block">Notes (optionnel)</label>
          <Textarea
            value={formData.notes}
            onChange={(e) => updateField('notes', e.target.value)}
            placeholder="Observations, actions réalisées..."
            className="bg-slate-700/50 border-white/10 text-white min-h-20"
          />
        </div>

        {/* Estimated impact preview */}
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
          <h3 className="text-sm font-medium text-emerald-400 mb-2 flex items-center gap-2">
            <TrendingDown className="w-4 h-4" />
            Impact estimé ce mois
          </h3>
          <p className="text-2xl font-bold text-white">
            ~{((Number(formData.devices_recycled) || 0) * 150) + ((Number(formData.devices_extended_life) || 0) * 50) + ((Number(formData.linux_devices) || 0) * 20)} kg CO₂
            <span className="text-sm font-normal text-slate-400 ml-2">économisés</span>
          </p>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-emerald-500 to-blue-500"
          disabled={saveMutation.isPending}
        >
          <Save className="w-4 h-4 mr-2" />
          {saveMutation.isPending ? 'Enregistrement...' : 'Enregistrer les données'}
        </Button>
      </form>
    </motion.div>
  );
}