import React, { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, TrendingUp, MessageCircle, Target, Bell } from 'lucide-react';
import { EXTENDED_BADGES } from '@/components/game/GamificationSystem.jsx';

// Notification Context
const NotificationContext = createContext();

export function useNotifications() {
  return useContext(NotificationContext);
}

// Notification types config
const notificationTypes = {
  badge: {
    icon: Trophy,
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-500/20',
    borderColor: 'border-amber-500/30'
  },
  levelUp: {
    icon: TrendingUp,
    color: 'from-emerald-500 to-blue-500',
    bgColor: 'bg-emerald-500/20',
    borderColor: 'border-emerald-500/30'
  },
  forumReply: {
    icon: MessageCircle,
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-500/20',
    borderColor: 'border-purple-500/30'
  },
  challenge: {
    icon: Target,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-500/30'
  }
};

// Single notification component
function NotificationToast({ notification, onDismiss }) {
  const config = notificationTypes[notification.type] || notificationTypes.badge;
  const Icon = config.icon;

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(notification.id);
    }, 5000);
    return () => clearTimeout(timer);
  }, [notification.id, onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.8 }}
      className={`${config.bgColor} ${config.borderColor} border backdrop-blur-lg rounded-2xl p-4 shadow-xl max-w-sm w-full cursor-pointer`}
      onClick={() => onDismiss(notification.id)}
    >
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${config.color} flex items-center justify-center flex-shrink-0`}>
          {notification.emoji ? (
            <span className="text-xl">{notification.emoji}</span>
          ) : (
            <Icon className="w-5 h-5 text-white" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-white text-sm">{notification.title}</h4>
          <p className="text-slate-300 text-xs mt-0.5 line-clamp-2">{notification.message}</p>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onDismiss(notification.id); }}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

// Notification Provider
export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [lastCheckedWeek, setLastCheckedWeek] = useState(null);

  // Check for new weekly challenges on mount
  useEffect(() => {
    const currentWeek = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
    const savedLastWeek = localStorage.getItem('nird-last-challenge-week');
    
    if (savedLastWeek && parseInt(savedLastWeek) < currentWeek) {
      // New week, new challenges!
      addNotification({
        type: 'challenge',
        title: 'Nouveaux défis disponibles !',
        message: 'De nouveaux défis hebdomadaires t\'attendent. Consulte ton profil !',
        emoji: '🎯'
      });
    }
    
    localStorage.setItem('nird-last-challenge-week', currentWeek.toString());
  }, []);

  // Check for unread forum replies
  useEffect(() => {
    const checkForumReplies = () => {
      const lastCheck = localStorage.getItem('nird-last-forum-check');
      const myPosts = JSON.parse(localStorage.getItem('nird-my-posts') || '[]');
      
      // This would normally check the server, but for now we'll track locally
      localStorage.setItem('nird-last-forum-check', Date.now().toString());
    };
    
    checkForumReplies();
  }, []);

  const addNotification = (notification) => {
    const id = Date.now() + Math.random();
    setNotifications(prev => [...prev, { ...notification, id }]);
    
    // Store in localStorage for persistence
    const stored = JSON.parse(localStorage.getItem('nird-notifications') || '[]');
    stored.push({ ...notification, id, timestamp: Date.now(), read: false });
    localStorage.setItem('nird-notifications', JSON.stringify(stored.slice(-50))); // Keep last 50
  };

  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const notifyBadge = (badgeId) => {
    const badge = EXTENDED_BADGES[badgeId];
    if (badge) {
      addNotification({
        type: 'badge',
        title: 'Nouveau badge débloqué !',
        message: badge.name,
        emoji: badge.icon
      });
    }
  };

  const notifyLevelUp = (level) => {
    addNotification({
      type: 'levelUp',
      title: `Niveau ${level.level} atteint !`,
      message: `Tu es maintenant ${level.name}`,
      emoji: level.icon
    });
  };

  const notifyForumReply = (postTitle, authorName) => {
    addNotification({
      type: 'forumReply',
      title: 'Nouvelle réponse',
      message: `${authorName} a répondu à "${postTitle}"`,
      emoji: '💬'
    });
  };

  const notifyChallenge = () => {
    addNotification({
      type: 'challenge',
      title: 'Nouveaux défis !',
      message: 'De nouveaux défis hebdomadaires sont disponibles',
      emoji: '🎯'
    });
  };

  return (
    <NotificationContext.Provider value={{ 
      addNotification, 
      notifyBadge, 
      notifyLevelUp, 
      notifyForumReply,
      notifyChallenge 
    }}>
      {children}
      
      {/* Notification container */}
      <div className="fixed top-4 right-4 z-[100] space-y-2 pointer-events-none">
        <AnimatePresence>
          {notifications.map(notification => (
            <div key={notification.id} className="pointer-events-auto">
              <NotificationToast
                notification={notification}
                onDismiss={dismissNotification}
              />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
}

// Notification Bell (for header)
export function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('nird-notifications') || '[]');
    const unread = stored.filter(n => !n.read);
    setUnreadCount(unread.length);
    setNotifications(stored.slice(-10).reverse());
  }, []);

  const markAllRead = () => {
    const stored = JSON.parse(localStorage.getItem('nird-notifications') || '[]');
    const updated = stored.map(n => ({ ...n, read: true }));
    localStorage.setItem('nird-notifications', JSON.stringify(updated));
    setUnreadCount(0);
    setNotifications(updated.slice(-10).reverse());
  };

  return (
    <>
      {/* Mobile: Fixed button */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <button
          onClick={() => { setShowDropdown(!showDropdown); if (!showDropdown) markAllRead(); }}
          className="relative p-3 bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors border border-white/10 shadow-lg"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Desktop: Inline button */}
      <div className="hidden md:block relative">
        <button
          onClick={() => { setShowDropdown(!showDropdown); if (!showDropdown) markAllRead(); }}
          className="relative p-2 text-slate-400 hover:text-white transition-colors"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </div>

      <AnimatePresence>
        {showDropdown && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40 bg-black/50 md:bg-transparent" 
              onClick={() => setShowDropdown(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="fixed md:absolute right-4 md:right-0 top-16 md:top-full md:mt-2 w-[calc(100%-2rem)] md:w-80 max-w-sm bg-slate-900 border border-white/20 rounded-2xl shadow-2xl overflow-hidden z-50"
            >
              <div className="p-4 border-b border-white/10 bg-slate-800">
                <h3 className="font-bold text-white">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-slate-400">
                    <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Aucune notification</p>
                  </div>
                ) : (
                  notifications.map((notif, i) => {
                    const config = notificationTypes[notif.type] || notificationTypes.badge;
                    return (
                      <div
                        key={i}
                        className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors ${!notif.read ? 'bg-emerald-500/10' : ''}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-xl ${config.bgColor} flex items-center justify-center flex-shrink-0`}>
                            <span className="text-xl">{notif.emoji}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-semibold">{notif.title}</p>
                            <p className="text-slate-300 text-sm mt-1">{notif.message}</p>
                            {notif.timestamp && (
                              <p className="text-slate-500 text-xs mt-2">
                                {new Date(notif.timestamp).toLocaleDateString('fr-FR', { 
                                  day: 'numeric', 
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}