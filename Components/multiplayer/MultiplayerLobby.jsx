import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Copy, Check, Crown, UserPlus, Play, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function MultiplayerLobby({ session, playerName, onStart, onLeave }) {
  const [copied, setCopied] = useState(false);
  const queryClient = useQueryClient();

  const { data: currentSession, refetch } = useQuery({
    queryKey: ['session', session?.id],
    queryFn: () => base44.entities.MultiplayerSession.filter({ id: session?.id }),
    enabled: !!session?.id,
    refetchInterval: 2000, // Poll every 2 seconds
    select: (data) => data[0]
  });

  const updateSessionMutation = useMutation({
    mutationFn: (data) => base44.entities.MultiplayerSession.update(session.id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['session', session?.id] })
  });

  const displaySession = currentSession || session;
  const players = displaySession?.players || [];
  const isHost = displaySession?.host_name === playerName;

  const copyCode = () => {
    navigator.clipboard.writeText(displaySession?.session_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleReady = () => {
    const updatedPlayers = players.map(p => 
      p.name === playerName ? { ...p, is_ready: !p.is_ready } : p
    );
    updateSessionMutation.mutate({ players: updatedPlayers });
  };

  const startGame = () => {
    if (players.length >= 2 && players.every(p => p.is_ready)) {
      updateSessionMutation.mutate({ status: 'playing' });
      onStart();
    }
  };

  const currentPlayer = players.find(p => p.name === playerName);
  const allReady = players.length >= 2 && players.every(p => p.is_ready);

  useEffect(() => {
    if (currentSession?.status === 'playing' && !isHost) {
      onStart();
    }
  }, [currentSession?.status]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-slate-800/50 rounded-3xl border border-white/10 p-6 max-w-md w-full"
    >
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 text-purple-400 text-sm font-medium mb-4">
          <Users className="w-4 h-4" />
          {displaySession?.mode === 'competition' ? 'Mode Compétition' : 'Mode Collaboration'}
        </div>
        <h2 className="text-2xl font-bold text-white">Salon d'attente</h2>
      </div>

      {/* Session Code */}
      <div className="bg-slate-700/50 rounded-xl p-4 mb-6">
        <p className="text-sm text-slate-400 mb-2">Code de la session</p>
        <div className="flex items-center gap-2">
          <code className="flex-1 text-2xl font-mono font-bold text-emerald-400 tracking-wider">
            {displaySession?.session_code}
          </code>
          <Button
            variant="ghost"
            size="sm"
            onClick={copyCode}
            className="text-slate-400 hover:text-white"
          >
            {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Players List */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-slate-400">Joueurs ({players.length}/{displaySession?.max_players || 4})</p>
          <Button variant="ghost" size="sm" onClick={() => refetch()} className="text-slate-400">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
        <div className="space-y-2">
          {players.map((player, idx) => (
            <motion.div
              key={player.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`flex items-center gap-3 p-3 rounded-xl ${
                player.is_ready ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-slate-700/50'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                {player.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white">{player.name}</span>
                  {player.name === displaySession?.host_name && (
                    <Crown className="w-4 h-4 text-amber-400" />
                  )}
                </div>
                <span className={`text-xs ${player.is_ready ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {player.is_ready ? 'Prêt' : 'En attente'}
                </span>
              </div>
              {player.name === playerName && (
                <span className="text-xs text-slate-500">(vous)</span>
              )}
            </motion.div>
          ))}

          {/* Empty slots */}
          {Array.from({ length: (displaySession?.max_players || 4) - players.length }).map((_, idx) => (
            <div
              key={`empty-${idx}`}
              className="flex items-center gap-3 p-3 rounded-xl border-2 border-dashed border-slate-700"
            >
              <div className="w-10 h-10 rounded-full bg-slate-700/50 flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-slate-500" />
              </div>
              <span className="text-slate-500 text-sm">En attente d'un joueur...</span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <Button
          onClick={toggleReady}
          className={`w-full ${
            currentPlayer?.is_ready 
              ? 'bg-slate-600 hover:bg-slate-500' 
              : 'bg-emerald-600 hover:bg-emerald-500'
          }`}
        >
          {currentPlayer?.is_ready ? 'Annuler' : 'Je suis prêt !'}
        </Button>

        {isHost && (
          <Button
            onClick={startGame}
            disabled={!allReady}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 disabled:opacity-50"
          >
            <Play className="w-4 h-4 mr-2" />
            Lancer la partie ({players.length} joueurs)
          </Button>
        )}

        <Button
          variant="ghost"
          onClick={onLeave}
          className="w-full text-slate-400 hover:text-white"
        >
          Quitter le salon
        </Button>
      </div>

      {!allReady && players.length >= 2 && (
        <p className="text-center text-sm text-slate-500 mt-4">
          Tous les joueurs doivent être prêts pour commencer
        </p>
      )}
    </motion.div>
  );
}