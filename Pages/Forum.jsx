import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { 
  MessageSquare, Plus, ThumbsUp, MessageCircle, Search, Filter,
  Lightbulb, HelpCircle, Share2, Award, ArrowLeft, X, Send, User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { addPoints, POINTS_CONFIG, LevelUpPopup, PointsPopup } from '@/components/game/GamificationSystem.jsx';
import { ExtendedBadgePopup } from '@/components/game/ExtendedBadgeDisplay.jsx';
import { AISummaryBadge, AISuggestionsPanel, autoCategorize, getTagConfig } from '@/components/ai/AIResourceAnalyzer.jsx';
import { calculateReputation, ReputationBadge, UsefulButton, checkReputationBadges, getReputationLevel } from '@/components/forum/ReputationSystem.jsx';

const categories = [
  { id: 'all', label: 'Tous', icon: MessageSquare, color: 'bg-slate-500' },
  { id: 'experience', label: 'Expériences', icon: Award, color: 'bg-emerald-500' },
  { id: 'question', label: 'Questions', icon: HelpCircle, color: 'bg-blue-500' },
  { id: 'resource', label: 'Ressources', icon: Share2, color: 'bg-purple-500' },
  { id: 'best-practice', label: 'Bonnes pratiques', icon: Lightbulb, color: 'bg-amber-500' },
  { id: 'suggestion', label: 'Suggestions', icon: Lightbulb, color: 'bg-pink-500' }
];

const categoryLabels = {
  'experience': { label: 'Expérience', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  'question': { label: 'Question', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  'resource': { label: 'Ressource', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  'best-practice': { label: 'Bonne pratique', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  'suggestion': { label: 'Suggestion', color: 'bg-pink-500/20 text-pink-400 border-pink-500/30' }
};

export default function Forum() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewPost, setShowNewPost] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'experience', author_name: '' });
  const [newReply, setNewReply] = useState({ content: '', author_name: '' });
  const [aiTags, setAiTags] = useState([]);
  const [isAutoCategorizng, setIsAutoCategorizng] = useState(false);
  const [levelUpInfo, setLevelUpInfo] = useState(null);
  const [pointsPopup, setPointsPopup] = useState(null);
  const [newBadge, setNewBadge] = useState(null);

  const queryClient = useQueryClient();
  
  const trackForumActivity = (type, points, reason) => {
    const result = addPoints(points, reason);
    setPointsPopup({ points, reason });
    setTimeout(() => setPointsPopup(null), 2000);
    
    if (result.levelUp) {
      setTimeout(() => setLevelUpInfo(result.newLevel), 500);
    }
    
    // Track weekly stats
    const stats = JSON.parse(localStorage.getItem('nird-stats') || '{}');
    const currentWeek = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
    stats.weeklyStats = stats.weeklyStats || {};
    stats.weeklyStats[currentWeek] = stats.weeklyStats[currentWeek] || {};
    stats.weeklyStats[currentWeek].weekly_forum_posts = (stats.weeklyStats[currentWeek].weekly_forum_posts || 0) + 1;
    
    // Check forum badges
    const totalPosts = (stats.forumPosts || 0) + (type === 'post' ? 1 : 0);
    const totalReplies = (stats.forumReplies || 0) + (type === 'reply' ? 1 : 0);
    stats.forumPosts = totalPosts;
    stats.forumReplies = totalReplies;
    
    const badges = JSON.parse(localStorage.getItem('nird-badges') || '[]');
    
    // First post badge
    if (type === 'post' && totalPosts === 1 && !badges.includes('first-post')) {
      badges.push('first-post');
      localStorage.setItem('nird-badges', JSON.stringify(badges));
      setTimeout(() => setNewBadge('first-post'), 1000);
    }
    
    // Super moderator badge (10+ contributions)
    if (totalPosts + totalReplies >= 10 && !badges.includes('super-moderator')) {
      badges.push('super-moderator');
      localStorage.setItem('nird-badges', JSON.stringify(badges));
      setTimeout(() => setNewBadge('super-moderator'), 1000);
    }
    
    localStorage.setItem('nird-stats', JSON.stringify(stats));
  };

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['forum-posts'],
    queryFn: async () => {
      const result = await base44.entities.ForumPost.list('-created_date');
      return result || [];
    }
  });

  const { data: replies = [] } = useQuery({
    queryKey: ['forum-replies', selectedPost?.id],
    queryFn: () => base44.entities.ForumReply.filter({ post_id: selectedPost?.id }, '-created_date'),
    enabled: !!selectedPost
  });

  const { data: allReplies = [] } = useQuery({
    queryKey: ['all-forum-replies'],
    queryFn: async () => {
      const result = await base44.entities.ForumReply.list('-created_date');
      return result || [];
    }
  });

  const createPostMutation = useMutation({
    mutationFn: (data) => base44.entities.ForumPost.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum-posts'] });
      setShowNewPost(false);
      setNewPost({ title: '', content: '', category: 'experience', author_name: '' });
      trackForumActivity('post', POINTS_CONFIG.forum_post, 'Nouveau post forum');
    }
  });

  const createReplyMutation = useMutation({
    mutationFn: async (data) => {
      await base44.entities.ForumReply.create(data);
      await base44.entities.ForumPost.update(selectedPost.id, { 
        replies_count: (selectedPost.replies_count || 0) + 1 
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum-replies'] });
      queryClient.invalidateQueries({ queryKey: ['forum-posts'] });
      setNewReply({ content: '', author_name: '' });
      trackForumActivity('reply', POINTS_CONFIG.forum_reply, 'Réponse forum');
    }
  });

  const likePostMutation = useMutation({
    mutationFn: (post) => base44.entities.ForumPost.update(post.id, { likes: (post.likes || 0) + 1 }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum-posts'] });
      // Vérifier badges de réputation
      const newBadges = checkReputationBadges(selectedPost?.author_name, posts, allReplies);
      if (newBadges.length > 0) {
        setTimeout(() => setNewBadge(newBadges[0]), 500);
      }
    }
  });

  const markUsefulMutation = useMutation({
    mutationFn: (post) => base44.entities.ForumPost.update(post.id, { 
      useful_count: (post.useful_count || 0) + 1,
      marked_useful: true 
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum-posts'] });
      addPoints(5, 'Vote utile');
      const newBadges = checkReputationBadges(selectedPost?.author_name, posts, allReplies);
      if (newBadges.length > 0) {
        setTimeout(() => setNewBadge(newBadges[0]), 500);
      }
    }
  });

  const likeReplyMutation = useMutation({
    mutationFn: (reply) => base44.entities.ForumReply.update(reply.id, { likes: (reply.likes || 0) + 1 }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['forum-replies'] })
  });

  const markHelpfulMutation = useMutation({
    mutationFn: (reply) => base44.entities.ForumReply.update(reply.id, { 
      helpful_count: (reply.helpful_count || 0) + 1,
      marked_helpful: true 
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum-replies'] });
      queryClient.invalidateQueries({ queryKey: ['all-forum-replies'] });
      addPoints(5, 'Réponse aidante');
      const newBadges = checkReputationBadges(selectedPost?.author_name, posts, allReplies);
      if (newBadges.length > 0) {
        setTimeout(() => setNewBadge(newBadges[0]), 500);
      }
    }
  });

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSubmitPost = (e) => {
    e.preventDefault();
    if (newPost.title && newPost.content && newPost.author_name) {
      createPostMutation.mutate(newPost);
    }
  };

  const handleSubmitReply = (e) => {
    e.preventDefault();
    if (newReply.content && newReply.author_name) {
      createReplyMutation.mutate({ ...newReply, post_id: selectedPost.id });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to={createPageUrl('Home')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Accueil</span>
            </Link>
            <h1 className="text-xl font-bold text-white">Forum NIRD</h1>
            <Button
              onClick={() => setShowNewPost(true)}
              className="bg-gradient-to-r from-emerald-500 to-blue-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouveau post
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* AI Suggestions */}
        <div className="mb-6">
          <AISuggestionsPanel userPosts={[]} forumPosts={posts} />
        </div>

        {/* Search and filters */}
        <div className="mb-8">
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Rechercher dans le forum..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 bg-slate-800/50 border-white/10 text-white placeholder:text-slate-400"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map(cat => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                    selectedCategory === cat.id
                      ? `${cat.color} text-white`
                      : 'bg-slate-800/50 text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Posts list */}
        {isLoading ? (
          <div className="text-center text-slate-400 py-12">Chargement...</div>
        ) : filteredPosts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <MessageSquare className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Aucun post trouvé</h3>
            <p className="text-slate-400 mb-6">Sois le premier à partager ton expérience !</p>
            <Button onClick={() => setShowNewPost(true)} className="bg-gradient-to-r from-emerald-500 to-blue-500">
              <Plus className="w-4 h-4 mr-2" />
              Créer un post
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedPost(post)}
                className="bg-slate-800/50 rounded-2xl border border-white/10 p-5 cursor-pointer hover:border-white/20 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-center text-white font-bold">
                    {post.author_name?.charAt(0).toUpperCase() || 'A'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-1 rounded-full border ${categoryLabels[post.category]?.color}`}>
                        {categoryLabels[post.category]?.label}
                      </span>
                      <span className="text-xs text-slate-500">{post.author_name}</span>
                      <ReputationBadge reputation={calculateReputation(post.author_name, posts, allReplies)} />
                    </div>
                    <h3 className="font-semibold text-white mb-2 line-clamp-1">{post.title}</h3>
                    <p className="text-sm text-slate-400 line-clamp-2">{post.content}</p>
                    <div className="flex items-center gap-4 mt-3 text-slate-500 text-sm">
                      <button 
                        onClick={(e) => { e.stopPropagation(); likePostMutation.mutate(post); }}
                        className="flex items-center gap-1 hover:text-emerald-400 transition-colors"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        {post.likes || 0}
                      </button>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        {post.replies_count || 0}
                      </span>
                      {(post.useful_count || 0) > 0 && (
                        <span className="flex items-center gap-1 text-emerald-400">
                          ✓ Utile ({post.useful_count})
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* New post modal */}
      <AnimatePresence>
        {showNewPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowNewPost(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-slate-800 rounded-3xl p-6 max-w-lg w-full border border-white/20 max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Nouveau post</h2>
                <button onClick={() => setShowNewPost(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitPost} className="space-y-4">
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Ton nom</label>
                  <Input
                    value={newPost.author_name}
                    onChange={(e) => setNewPost({ ...newPost, author_name: e.target.value })}
                    placeholder="Comment veux-tu t'appeler ?"
                    className="bg-slate-700/50 border-white/10 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Catégorie</label>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.slice(1).map(cat => {
                      const Icon = cat.icon;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setNewPost({ ...newPost, category: cat.id })}
                          className={`flex items-center gap-2 p-3 rounded-xl transition-all ${
                            newPost.category === cat.id
                              ? `${cat.color} text-white`
                              : 'bg-slate-700/50 text-slate-400 hover:text-white'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {cat.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Titre</label>
                  <Input
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    placeholder="Un titre accrocheur..."
                    className="bg-slate-700/50 border-white/10 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Message</label>
                  <Textarea
                    value={newPost.content}
                    onChange={async (e) => {
                      const content = e.target.value;
                      setNewPost({ ...newPost, content });
                      // Auto-categorize when content is substantial
                      if (content.length > 50 && !isAutoCategorizng) {
                        setIsAutoCategorizng(true);
                        const result = await autoCategorize(content);
                        if (result.category) {
                          setNewPost(prev => ({ ...prev, category: result.category }));
                          setAiTags(result.suggestedTags || []);
                        }
                        setIsAutoCategorizng(false);
                      }
                    }}
                    placeholder="Partage ton expérience, pose ta question..."
                    className="bg-slate-700/50 border-white/10 text-white min-h-32"
                    required
                  />
                  {aiTags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      <span className="text-xs text-slate-400">Tags suggérés :</span>
                      {aiTags.map(tag => {
                        const config = getTagConfig(tag);
                        return (
                          <span key={tag} className={`px-2 py-0.5 rounded text-xs border ${config.color}`}>
                            {config.label}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>

                <Button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-blue-500" disabled={createPostMutation.isPending || isAutoCategorizng}>
                  {createPostMutation.isPending ? 'Publication...' : 'Publier'}
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Level up popup */}
      {levelUpInfo && (
        <LevelUpPopup level={levelUpInfo} onClose={() => setLevelUpInfo(null)} />
      )}

      {/* Points popup */}
      <AnimatePresence>
        {pointsPopup && <PointsPopup {...pointsPopup} />}
      </AnimatePresence>

      {/* Badge popup */}
      {newBadge && (
        <ExtendedBadgePopup badge={newBadge} onClose={() => setNewBadge(null)} />
      )}

      {/* Post detail modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPost(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-slate-800 rounded-3xl p-6 max-w-2xl w-full border border-white/20 max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                    {selectedPost.author_name?.charAt(0).toUpperCase() || 'A'}
                  </div>
                  <div>
                    <p className="font-medium text-white">{selectedPost.author_name}</p>
                    <span className={`text-xs px-2 py-1 rounded-full border ${categoryLabels[selectedPost.category]?.color}`}>
                      {categoryLabels[selectedPost.category]?.label}
                    </span>
                  </div>
                </div>
                <button onClick={() => setSelectedPost(null)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <h2 className="text-2xl font-bold text-white mb-4">{selectedPost.title}</h2>
              <p className="text-slate-300 mb-6 whitespace-pre-wrap">{selectedPost.content}</p>

              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10 flex-wrap">
                <button 
                  onClick={() => likePostMutation.mutate(selectedPost)}
                  className="flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  <ThumbsUp className="w-5 h-5" />
                  {selectedPost.likes || 0} j'aime
                </button>
                <UsefulButton 
                  count={selectedPost.useful_count || 0}
                  isUseful={selectedPost.marked_useful}
                  onMark={() => markUsefulMutation.mutate(selectedPost)}
                />
                <AISummaryBadge post={selectedPost} />
              </div>

              {/* Replies */}
              <div className="mb-6">
                <h3 className="font-semibold text-white mb-4">
                  Réponses ({replies.length})
                </h3>
                
                {replies.length === 0 ? (
                  <p className="text-slate-400 text-center py-4">Aucune réponse pour le moment</p>
                ) : (
                  <div className="space-y-4">
                    {replies.map(reply => (
                      <div key={reply.id} className="bg-slate-700/30 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-white text-sm">
                            {reply.author_name?.charAt(0).toUpperCase() || 'A'}
                          </div>
                          <span className="text-sm text-slate-300">{reply.author_name}</span>
                          <ReputationBadge reputation={calculateReputation(reply.author_name, posts, allReplies)} />
                        </div>
                        <p className="text-slate-300 text-sm mb-3">{reply.content}</p>
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => likeReplyMutation.mutate(reply)}
                            className="flex items-center gap-1 text-xs text-slate-400 hover:text-emerald-400 transition-colors"
                          >
                            <ThumbsUp className="w-3 h-3" />
                            {reply.likes || 0}
                          </button>
                          <UsefulButton 
                            count={reply.helpful_count || 0}
                            isUseful={reply.marked_helpful}
                            onMark={() => markHelpfulMutation.mutate(reply)}
                            label="Aidant"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Reply form */}
              <form onSubmit={handleSubmitReply} className="space-y-3">
                <Input
                  value={newReply.author_name}
                  onChange={(e) => setNewReply({ ...newReply, author_name: e.target.value })}
                  placeholder="Ton nom"
                  className="bg-slate-700/50 border-white/10 text-white"
                  required
                />
                <div className="flex gap-2">
                  <Textarea
                    value={newReply.content}
                    onChange={(e) => setNewReply({ ...newReply, content: e.target.value })}
                    placeholder="Ta réponse..."
                    className="bg-slate-700/50 border-white/10 text-white flex-1 min-h-20"
                    required
                  />
                  <Button type="submit" className="bg-gradient-to-r from-emerald-500 to-blue-500" disabled={createReplyMutation.isPending}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}