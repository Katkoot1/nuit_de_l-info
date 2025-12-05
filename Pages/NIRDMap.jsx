import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Filter, Search, Building, Users, Leaf, 
  TrendingUp, Mail, MessageSquare, ArrowLeft, X,
  GraduationCap, School, Award
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix pour les icônes Leaflet avec Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Données d'exemple d'établissements avec coordonnées GPS réelles
const establishments = [
  {
    id: 1,
    name: 'Lycée Victor Hugo',
    type: 'lycée',
    region: 'Hauts-de-France',
    city: 'Bruay-la-Buissière',
    coordinates: [50.4814, 2.5458], // [lat, lng]
    engagementLevel: 'avancé',
    freeSoftwarePercentage: 78,
    linuxDevices: 110,
    totalDevices: 150,
    co2Saved: 4500,
    experience: 'Migration réussie vers Linux sur 78% des postes. Les élèves participent activement à la maintenance.',
    contact: 'contact@lycee-victor-hugo.fr',
    badges: ['pionnier', 'ecologie', 'formation']
  },
  {
    id: 2,
    name: 'Collège Jean Jaurès',
    type: 'collège',
    region: 'Île-de-France',
    city: 'Paris',
    coordinates: [48.8566, 2.3522],
    engagementLevel: 'intermédiaire',
    freeSoftwarePercentage: 55,
    linuxDevices: 45,
    totalDevices: 90,
    co2Saved: 2800,
    experience: 'Début de migration en cours. Formation des équipes techniques. Premiers retours très positifs.',
    contact: 'contact@college-jean-jaures.fr',
    badges: ['debutant', 'ecologie']
  },
  {
    id: 3,
    name: 'Lycée Carnot',
    type: 'lycée',
    region: 'Hauts-de-France',
    city: 'Bruay-la-Buissière',
    coordinates: [50.4833, 2.5500],
    engagementLevel: 'avancé',
    freeSoftwarePercentage: 85,
    linuxDevices: 200,
    totalDevices: 235,
    co2Saved: 6800,
    experience: 'Établissement pionnier du projet NIRD. 85% de logiciels libres. Ateliers de réparation avec les élèves.',
    contact: 'contact@lycee-carnot.fr',
    badges: ['pionnier', 'ecologie', 'formation', 'expert']
  },
  {
    id: 4,
    name: 'Collège Henri Wallon',
    type: 'collège',
    region: 'Nouvelle-Aquitaine',
    city: 'Bordeaux',
    coordinates: [44.8378, -0.5792],
    engagementLevel: 'avancé',
    freeSoftwarePercentage: 70,
    linuxDevices: 85,
    totalDevices: 120,
    co2Saved: 3200,
    experience: '100% logiciels libres depuis 2 ans. Économies significatives et satisfaction des utilisateurs.',
    contact: 'contact@college-henri-wallon.fr',
    badges: ['pionnier', 'ecologie', 'expert']
  },
  {
    id: 5,
    name: 'Lycée Marie Curie',
    type: 'lycée',
    region: 'Auvergne-Rhône-Alpes',
    city: 'Lyon',
    coordinates: [45.7640, 4.8357],
    engagementLevel: 'intermédiaire',
    freeSoftwarePercentage: 45,
    linuxDevices: 60,
    totalDevices: 130,
    co2Saved: 2100,
    experience: 'Migration progressive. Formation des enseignants en cours. Support de la région.',
    contact: 'contact@lycee-marie-curie.fr',
    badges: ['debutant']
  },
  {
    id: 6,
    name: 'Collège Voltaire',
    type: 'collège',
    region: 'Provence-Alpes-Côte d\'Azur',
    city: 'Marseille',
    coordinates: [43.2965, 5.3698],
    engagementLevel: 'débutant',
    freeSoftwarePercentage: 25,
    linuxDevices: 20,
    totalDevices: 80,
    co2Saved: 800,
    experience: 'Premiers pas vers le libre. Tests sur quelques postes. Recherche de partenaires pour formation.',
    contact: 'contact@college-voltaire.fr',
    badges: ['debutant']
  },
  {
    id: 7,
    name: 'Lycée Pasteur',
    type: 'lycée',
    region: 'Occitanie',
    city: 'Toulouse',
    coordinates: [43.6047, 1.4442],
    engagementLevel: 'intermédiaire',
    freeSoftwarePercentage: 60,
    linuxDevices: 95,
    totalDevices: 160,
    co2Saved: 3800,
    experience: 'Migration bien avancée. Collaboration avec d\'autres établissements de la région.',
    contact: 'contact@lycee-pasteur.fr',
    badges: ['ecologie', 'formation']
  },
  {
    id: 8,
    name: 'Collège Rousseau',
    type: 'collège',
    region: 'Grand Est',
    city: 'Strasbourg',
    coordinates: [48.5734, 7.7521],
    engagementLevel: 'avancé',
    freeSoftwarePercentage: 75,
    linuxDevices: 70,
    totalDevices: 95,
    co2Saved: 2900,
    experience: 'Excellente expérience avec Linux Mint. Les élèves apprécient la stabilité et la rapidité.',
    contact: 'contact@college-rousseau.fr',
    badges: ['pionnier', 'ecologie']
  }
];

const regions = ['Toutes', ...new Set(establishments.map(e => e.region))];
const types = ['Tous', 'lycée', 'collège'];
const engagementLevels = ['Tous', 'débutant', 'intermédiaire', 'avancé'];

// Composant pour centrer la carte sur les établissements
function MapCenter({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [map, center, zoom]);
  return null;
}

// Créer des icônes personnalisées selon le niveau d'engagement
const createCustomIcon = (level) => {
  const colors = {
    'avancé': '#10b981',
    'intermédiaire': '#3b82f6',
    'débutant': '#f97316'
  };
  
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${colors[level] || '#6b7280'}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

export default function NIRDMap() {
  const [selectedEstablishment, setSelectedEstablishment] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [filters, setFilters] = useState({
    region: 'Toutes',
    type: 'Tous',
    engagementLevel: 'Tous',
    search: ''
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const filteredEstablishments = useMemo(() => {
    if (!establishments || establishments.length === 0) {
      return [];
    }
    return establishments.filter(est => {
      if (filters.region !== 'Toutes' && est.region !== filters.region) return false;
      if (filters.type !== 'Tous' && est.type !== filters.type) return false;
      if (filters.engagementLevel !== 'Tous' && est.engagementLevel !== filters.engagementLevel) return false;
      if (filters.search && !est.name.toLowerCase().includes(filters.search.toLowerCase()) && 
          !est.city.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    });
  }, [filters]);

  // Calculer le centre de la carte basé sur les établissements filtrés
  const mapCenter = useMemo(() => {
    if (filteredEstablishments.length === 0) {
      return [46.6034, 1.8883]; // Centre de la France
    }
    const avgLat = filteredEstablishments.reduce((sum, e) => sum + e.coordinates[0], 0) / filteredEstablishments.length;
    const avgLng = filteredEstablishments.reduce((sum, e) => sum + e.coordinates[1], 0) / filteredEstablishments.length;
    return [avgLat, avgLng];
  }, [filteredEstablishments]);

  const getEngagementColor = (level) => {
    switch(level) {
      case 'avancé': return 'bg-emerald-500';
      case 'intermédiaire': return 'bg-blue-500';
      case 'débutant': return 'bg-orange-500';
      default: return 'bg-slate-500';
    }
  };

  const getEngagementLabel = (level) => {
    switch(level) {
      case 'avancé': return 'Avancé';
      case 'intermédiaire': return 'Intermédiaire';
      case 'débutant': return 'Débutant';
      default: return level;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to={createPageUrl('Home')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Accueil</span>
            </Link>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <MapPin className="w-6 h-6 text-emerald-400" />
              Carte des Établissements NIRD
            </h1>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-800/50 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <Building className="w-4 h-4" />
              <span className="text-sm">Établissements</span>
            </div>
            <p className="text-2xl font-bold text-white">{establishments.length}</p>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <Users className="w-4 h-4" />
              <span className="text-sm">Régions</span>
            </div>
            <p className="text-2xl font-bold text-white">{regions.length - 1}</p>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <Leaf className="w-4 h-4" />
              <span className="text-sm">CO₂ économisé</span>
            </div>
            <p className="text-2xl font-bold text-emerald-400">
              {establishments.reduce((sum, e) => sum + e.co2Saved, 0).toLocaleString('fr-FR')} kg
            </p>
          </div>
        </div>

        {/* Filtres */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 rounded-2xl border border-white/10 p-6 mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-white">Filtres</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm text-slate-400 mb-2 block">Recherche</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  placeholder="Nom ou ville..."
                  className="bg-slate-700/50 border-white/10 text-white pl-10"
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-2 block">Région</label>
              <select
                value={filters.region}
                onChange={(e) => setFilters({ ...filters, region: e.target.value })}
                className="w-full px-4 py-2 bg-slate-700/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {regions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-2 block">Type</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="w-full px-4 py-2 bg-slate-700/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {types.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-2 block">Niveau d'engagement</label>
              <select
                value={filters.engagementLevel}
                onChange={(e) => setFilters({ ...filters, engagementLevel: e.target.value })}
                className="w-full px-4 py-2 bg-slate-700/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {engagementLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>
          <p className="text-sm text-slate-400 mt-4">
            {filteredEstablishments.length} établissement{filteredEstablishments.length > 1 ? 's' : ''} trouvé{filteredEstablishments.length > 1 ? 's' : ''}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Carte */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-800/50 rounded-2xl border border-white/10 p-6 relative overflow-hidden"
              style={{ minHeight: '600px' }}
            >
              <h3 className="text-lg font-semibold text-white mb-4">Carte de France</h3>
              
              {/* Carte Leaflet */}
              {isClient ? (
                <div className="relative w-full" style={{ height: '550px', borderRadius: '12px', overflow: 'hidden' }}>
                  <MapContainer
                    center={mapCenter}
                    zoom={filteredEstablishments.length === 1 ? 12 : filteredEstablishments.length > 0 ? 6 : 6}
                    style={{ height: '100%', width: '100%', zIndex: 1 }}
                    className="rounded-lg"
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapCenter center={mapCenter} zoom={filteredEstablishments.length === 1 ? 12 : filteredEstablishments.length > 0 ? 6 : 6} />
                    
                    {filteredEstablishments.map(est => (
                      <Marker
                        key={est.id}
                        position={est.coordinates}
                        icon={createCustomIcon(est.engagementLevel)}
                        eventHandlers={{
                          click: () => setSelectedEstablishment(est),
                        }}
                      >
                        <Popup>
                          <div className="text-sm">
                            <h4 className="font-semibold text-slate-900 mb-1">{est.name}</h4>
                            <p className="text-slate-600 mb-2">{est.city}, {est.region}</p>
                            <div className="flex items-center gap-2 mb-2">
                              <div className={`w-3 h-3 rounded-full ${getEngagementColor(est.engagementLevel)}`} />
                              <span className="text-xs text-slate-600">{getEngagementLabel(est.engagementLevel)}</span>
                            </div>
                            <p className="text-xs text-slate-500">
                              {est.freeSoftwarePercentage}% logiciels libres • {est.linuxDevices} postes Linux
                            </p>
                            <button
                              onClick={() => setSelectedEstablishment(est)}
                              className="mt-2 w-full px-3 py-1 bg-emerald-500 text-white rounded text-xs hover:bg-emerald-600 transition-colors"
                            >
                              Voir les détails
                            </button>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                </div>
              ) : (
                <div className="relative w-full flex items-center justify-center" style={{ height: '550px', borderRadius: '12px', backgroundColor: '#1e293b' }}>
                  <p className="text-slate-400">Chargement de la carte...</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Liste des établissements */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Établissements ({filteredEstablishments.length})</h3>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {filteredEstablishments.map(est => (
                <motion.button
                  key={est.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => setSelectedEstablishment(est)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    selectedEstablishment?.id === est.id
                      ? 'bg-emerald-500/20 border-emerald-500/50'
                      : 'bg-slate-800/50 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-white text-sm">{est.name}</h4>
                      <p className="text-xs text-slate-400">{est.city}, {est.region}</p>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${getEngagementColor(est.engagementLevel)}`} />
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <GraduationCap className="w-3 h-3" />
                      {est.type}
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {est.freeSoftwarePercentage}%
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal de détail */}
        <AnimatePresence>
          {selectedEstablishment && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedEstablishment(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-slate-800 rounded-2xl p-6 max-w-2xl w-full border border-white/20 max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{selectedEstablishment.name}</h2>
                    <p className="text-slate-400">{selectedEstablishment.city}, {selectedEstablishment.region}</p>
                  </div>
                  <button
                    onClick={() => setSelectedEstablishment(null)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-700/50 rounded-xl p-4">
                    <p className="text-sm text-slate-400 mb-1">Type</p>
                    <p className="text-white font-semibold capitalize">{selectedEstablishment.type}</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-xl p-4">
                    <p className="text-sm text-slate-400 mb-1">Niveau d'engagement</p>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getEngagementColor(selectedEstablishment.engagementLevel)}`} />
                      <p className="text-white font-semibold">{getEngagementLabel(selectedEstablishment.engagementLevel)}</p>
                    </div>
                  </div>
                  <div className="bg-slate-700/50 rounded-xl p-4">
                    <p className="text-sm text-slate-400 mb-1">Logiciels libres</p>
                    <p className="text-white font-semibold">{selectedEstablishment.freeSoftwarePercentage}%</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-xl p-4">
                    <p className="text-sm text-slate-400 mb-1">CO₂ économisé</p>
                    <p className="text-emerald-400 font-semibold">{selectedEstablishment.co2Saved.toLocaleString('fr-FR')} kg</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-blue-400" />
                    Retour d'expérience
                  </h3>
                  <p className="text-slate-300">{selectedEstablishment.experience}</p>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Badges</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedEstablishment.badges.map(badge => (
                      <span
                        key={badge}
                        className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm capitalize"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={() => window.location.href = `mailto:${selectedEstablishment.contact}`}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Contacter
                  </Button>
                  <Button
                    onClick={() => {
                      // Rediriger vers le forum avec un filtre
                      window.location.href = createPageUrl('Forum');
                    }}
                    className="flex-1 bg-white/10 hover:bg-white/20 flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Voir sur le forum
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

