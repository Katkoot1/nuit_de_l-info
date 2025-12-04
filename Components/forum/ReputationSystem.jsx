import React from 'react';
import { motion } from 'framer-motion';
import { Star, TrendingUp, Award, CheckCircle } from 'lucide-react';

// Points de réputation par action
export const REPUTATION_POINTS = {
  post_liked: 2,
  reply_liked: 2,
  post_marked_useful: 10,
  reply_marked_helpful: 15,
  suggestion_accepted: 20
};

// Calculer la réputation d'un utilisateur
export function calculateReputation(authorName, posts = [], replies = []) {
  let reputation = 0;
  
  // Points des posts
  const userPosts = posts.filter(p => p.author_name === authorName);
  userPosts.forEach(post => {
    reputation += (post.likes || 0) * REPUTATION_POINTS.post_liked;
    reputation += (post.useful_count || 0) * REPUTATION_POINTS.post_marked_useful;
  });
  
  // Points des réponses
  const userReplies = replies.filter(r => r.author_name === authorName);
  userReplies.forEach(reply => {
    reputation += (reply.likes || 0) * REPUTATION_POINTS.reply_liked;
    reputation += (reply.helpful_count || 0) * REPUTATION_POINTS.reply_marked_helpful;
  });
  
  return reputation;
}

// Obtenir le niveau de réputation
export function getReputationLevel(reputation) {
  if (reputation >= 500) return { level: 'Légende', color: 'from-amber-400 to-yellow-500', icon: '👑' };
  if (reputation >= 200) return { level: 'Expert·e', color: 'from-purple-400 to-pink-500', icon: '💎' };
  if (reputation >= 100) return { level: 'Confirmé·e', color: 'from-blue-400 to-cyan-500', icon: '⭐' };
  if (reputation >= 50) return { level: 'Actif·ve', color: 'from-emerald-400 to-teal-500', icon: '🌱' };
  return { level: 'Nouveau·elle', color: 'from-slate-400 to-slate-500', icon: '🔰' };
}

// Vérifier et attribuer les badges de réputation
export function checkReputationBadges(authorName, posts = [], replies = [], stats = {}) {
  const badges = JSON.parse(localStorage.getItem('nird-badges') || '[]');
  const newBadges = [];
  
  const userPosts = posts.filter(p => p.author_name === authorName);
  const userReplies = replies.filter(r => r.author_name === authorName);
  
  // Mentor NIRD : 10+ réponses marquées comme utiles
  const helpfulReplies = userReplies.filter(r => (r.helpful_count || 0) >= 1).length;
  if (helpfulReplies >= 10 && !badges.includes('mentor-nird')) {
    badges.push('mentor-nird');
    newBadges.push('mentor-nird');
  }
  
  // Boutique à idées : 5+ suggestions
  const suggestions = userPosts.filter(p => p.category === 'suggestion').length;
  if (suggestions >= 5 && !badges.includes('idea-factory')) {
    badges.push('idea-factory');
    newBadges.push('idea-factory');
  }
  
  // Étoile de la Réputation : 100 points
  const reputation = calculateReputation(authorName, posts, replies);
  if (reputation >= 100 && !badges.includes('reputation-star')) {
    badges.push('reputation-star');
    newBadges.push('reputation-star');
  }
  
  // Voix de Confiance : 3+ posts utiles
  const usefulPosts = userPosts.filter(p => (p.useful_count || 0) >= 1).length;
  if (usefulPosts >= 3 && !badges.includes('trusted-voice')) {
    badges.push('trusted-voice');
    newBadges.push('trusted-voice');
  }
  
  // Entraide : 5+ personnes aidées
  if (helpfulReplies >= 5 && !badges.includes('helpful')) {
    badges.push('helpful');
    newBadges.push('helpful');
  }
  
  if (newBadges.length > 0) {
    localStorage.setItem('nird-badges', JSON.stringify(badges));
  }
  
  return newBadges;
}

// Badge de réputation affiché à côté du nom
export function ReputationBadge({ reputation, size = 'sm' }) {
  const level = getReputationLevel(reputation);
  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1'
  };
  
  return (
    <span className={`inline-flex items-center gap-1 rounded-full bg-gradient-to-r ${level.color} text-white font-medium ${sizes[size]}`}>
      <span>{level.icon}</span>
      <span>{reputation}</span>
    </span>
  );
}

// Bouton "Marquer comme utile"
export function UsefulButton({ count = 0, isUseful, onMark, label = 'Utile' }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onMark}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
        isUseful || count > 0
          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
          : 'bg-slate-700/50 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10'
      }`}
    >
      <CheckCircle className="w-4 h-4" />
      <span>{label}</span>
      {count > 0 && <span className="ml-1 bg-emerald-500/30 px-1.5 rounded">{count}</span>}
    </motion.button>
  );
}

// Carte de profil de réputation
export function ReputationCard({ authorName, posts = [], replies = [] }) {
  const reputation = calculateReputation(authorName, posts, replies);
  const level = getReputationLevel(reputation);
  const userPosts = posts.filter(p => p.author_name === authorName);
  const userReplies = replies.filter(r => r.author_name === authorName);
  
  const stats = [
    { label: 'Posts', value: userPosts.length },
    { label: 'Réponses', value: userReplies.length },
    { label: 'Likes reçus', value: userPosts.reduce((sum, p) => sum + (p.likes || 0), 0) + userReplies.reduce((sum, r) => sum + (r.likes || 0), 0) },
    { label: 'Votes utiles', value: userPosts.reduce((sum, p) => sum + (p.useful_count || 0), 0) + userReplies.reduce((sum, r) => sum + (r.helpful_count || 0), 0) }
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 rounded-xl border border-white/10 p-4"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${level.color} flex items-center justify-center text-2xl`}>
          {level.icon}
        </div>
        <div>
          <p className="font-semibold text-white">{authorName}</p>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-0.5 rounded-full bg-gradient-to-r ${level.color} text-white`}>
              {level.level}
            </span>
            <span className="text-slate-400 text-xs">{reputation} pts</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        {stats.map(stat => (
          <div key={stat.label} className="text-center">
            <p className="text-lg font-bold text-white">{stat.value}</p>
            <p className="text-xs text-slate-400">{stat.label}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}