import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Swords, UserCheck, ArrowRight, UserPlus, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';

export default function MultiplayerSetup({ onSessionReady, onCancel }) {
  const [step, setStep] = useState('choose'); // choose, create, join
  const [mode, setMode] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [sessionCode, setSessionCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generateSessionCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  };

  const createSessionMutation = useMutation({
    mutationFn: async (data) => {
      const session = await base44.entities.MultiplayerSession.create(data);
      return session;
    },
    onSuccess: (session) => {
      onSessionReady(session, playerName, true);
    },
    onError: (err) => {
      setError('Erreur lors de la création de la session');
      setIsLoading(false);
    }
  });

  const handleCreateSession = async () => {
    if (!playerName.trim()) {
      setError('Entrez votre nom');
      return;
    }
    setError('');
    setIsLoading(true);
    
    const code = generateSessionCode();
    createSessionMutation.mutate({
      session_code: code,
      host_name: playerName.trim(),
      mode: mode,
      status: 'waiting',
      players: [{ name: playerName.trim(), joined_at: new Date().toISOString(), is_ready: false }],
      current_scenario: 0,
      max_players: 4
    });
  };

  const handleJoinSession = async () => {
    if (!playerName.trim()) {
      setError('Entrez votre nom');
      return;
    }
    if (!sessionCode.trim() || sessionCode.length !== 6) {
      setError('Code de session invalide');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      const sessions = await base44.entities.MultiplayerSession.filter({ 
        session_code: sessionCode.toUpperCase() 
      });
      
      if (sessions.length === 0) {
        setError('Session introuvable');
        setIsLoading(false);
        return;
      }

      const session = sessions[0];
      
      if (session.status !== 'waiting') {
        setError('Cette partie a déjà commencé');
        setIsLoading(false);
        return;
      }

      if (session.players.length >= session.max_players) {
        setError('Session complète');
        setIsLoading(false);
        return;
      }

      if (session.players.some(p => p.name === playerName.trim())) {
        setError('Ce nom est déjà pris');
        setIsLoading(false);
        return;
      }

      // Add player to session
      const updatedPlayers = [
        ...session.players,
        { name: playerName.trim(), joined_at: new Date().toISOString(), is_ready: false }
      ];

      await base44.entities.MultiplayerSession.update(session.id, { players: updatedPlayers });
      
      onSessionReady({ ...session, players: updatedPlayers }, playerName.trim(), false);
    } catch (err) {
      setError('Erreur de connexion');
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-lg mx-auto"
    >
      {/* Step: Choose Mode */}
      {step === 'choose' && (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 text-purple-400 text-sm font-medium mb-4">
              <Users className="w-4 h-4" />
              Mode Multijoueur
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Choisissez votre mode</h2>
            <p className="text-slate-400">Jouez avec vos collègues ou amis</p>
          </div>

          <div className="grid gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { setMode('competition'); setStep('create'); }}
              className="bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-2xl p-6 text-left hover:border-red-500/50 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                  <Swords className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">Compétition</h3>
                  <p className="text-sm text-slate-400">
                    Affrontez vos adversaires ! Chacun joue les mêmes scénarios et le meilleur score gagne.
                  </p>
                  <div className="flex items-center gap-2 mt-3 text-red-400 text-sm">
                    <span>2-4 joueurs</span>
                    <span>•</span>
                    <span>Classement final</span>
                  </div>
                </div>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { setMode('collaboration'); setStep('create'); }}
              className="bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 rounded-2xl p-6 text-left hover:border-emerald-500/50 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center">
                  <UserCheck className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">Collaboration</h3>
                  <p className="text-sm text-slate-400">
                    Travaillez ensemble ! Discutez et comparez vos choix pour trouver les meilleures solutions.
                  </p>
                  <div className="flex items-center gap-2 mt-3 text-emerald-400 text-sm">
                    <span>2-4 joueurs</span>
                    <span>•</span>
                    <span>Score d'équipe</span>
                  </div>
                </div>
              </div>
            </motion.button>
          </div>

          <Button
            variant="ghost"
            onClick={onCancel}
            className="w-full text-slate-400 hover:text-white"
          >
            Retour au solo
          </Button>
        </div>
      )}

      {/* Step: Create or Join */}
      {step === 'create' && (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4 ${
              mode === 'competition' 
                ? 'bg-red-500/20 text-red-400' 
                : 'bg-emerald-500/20 text-emerald-400'
            }`}>
              {mode === 'competition' ? <Swords className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
              {mode === 'competition' ? 'Compétition' : 'Collaboration'}
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Rejoindre une partie</h2>
          </div>

          <div>
            <label className="text-sm text-slate-400 mb-2 block">Votre nom</label>
            <Input
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Entrez votre pseudo"
              className="bg-slate-800/50 border-white/10 text-white"
              maxLength={20}
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <div className="grid gap-3">
            <Button
              onClick={handleCreateSession}
              disabled={isLoading}
              className={`w-full ${
                mode === 'competition'
                  ? 'bg-gradient-to-r from-red-500 to-orange-500'
                  : 'bg-gradient-to-r from-emerald-500 to-blue-500'
              }`}
            >
              {isLoading ? 'Création...' : 'Créer une partie'}
              <UserPlus className="w-4 h-4 ml-2" />
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-900 text-slate-500">ou</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Input
                value={sessionCode}
                onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
                placeholder="Code de session"
                className="bg-slate-800/50 border-white/10 text-white font-mono tracking-widest text-center"
                maxLength={6}
              />
              <Button
                onClick={handleJoinSession}
                disabled={isLoading}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                Rejoindre
              </Button>
            </div>
          </div>

          <Button
            variant="ghost"
            onClick={() => setStep('choose')}
            className="w-full text-slate-400 hover:text-white"
          >
            ← Changer de mode
          </Button>
        </div>
      )}
    </motion.div>
  );
}