import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Home, User, MessageSquare, BookOpen, Leaf } from 'lucide-react';
import { NotificationProvider, NotificationBell } from '@/components/notifications/NotificationSystem.jsx';

export default function Layout({ children, currentPageName }) {
  // Pages that should not show navigation
  const hideNavPages = [];
  const showNav = !hideNavPages.includes(currentPageName);

  return (
    <NotificationProvider>
    <div className="min-h-screen bg-slate-900">
      {/* Global Navigation */}
      {showNav && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-lg border-t border-white/10 px-4 py-2 md:top-0 md:bottom-auto md:border-t-0 md:border-b">
          <div className="max-w-4xl mx-auto flex items-center justify-around md:justify-end md:gap-6">
            <div className="hidden md:block mr-auto">
              <NotificationBell />
            </div>
            <Link
              to={createPageUrl('Home')}
              className={`flex flex-col md:flex-row items-center gap-1 md:gap-2 px-3 py-2 rounded-xl transition-colors ${
                currentPageName === 'Home' ? 'text-emerald-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-xs md:text-sm">Accueil</span>
            </Link>
            <Link
              to={createPageUrl('Chapter1')}
              className={`flex flex-col md:flex-row items-center gap-1 md:gap-2 px-3 py-2 rounded-xl transition-colors ${
                currentPageName?.startsWith('Chapter') || currentPageName === 'SimulationGame' ? 'text-emerald-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              <span className="text-xs md:text-sm">Jeux</span>
            </Link>
            <Link
              to={createPageUrl('Forum')}
              className={`flex flex-col md:flex-row items-center gap-1 md:gap-2 px-3 py-2 rounded-xl transition-colors ${
                currentPageName === 'Forum' ? 'text-purple-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              <span className="text-xs md:text-sm">Forum</span>
            </Link>
            <Link
              to={createPageUrl('ImpactTracker')}
              className={`flex flex-col md:flex-row items-center gap-1 md:gap-2 px-3 py-2 rounded-xl transition-colors ${
                currentPageName === 'ImpactTracker' ? 'text-emerald-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Leaf className="w-5 h-5" />
              <span className="text-xs md:text-sm">Impact</span>
            </Link>
            <Link
              to={createPageUrl('Profile')}
              className={`flex flex-col md:flex-row items-center gap-1 md:gap-2 px-3 py-2 rounded-xl transition-colors ${
                currentPageName === 'Profile' ? 'text-amber-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="text-xs md:text-sm">Profil</span>
            </Link>
          </div>
        </nav>
      )}
      
      <style>{`
        :root {
          --nird-green: #10b981;
          --nird-blue: #3b82f6;
          --nird-orange: #f97316;
        }
        
        * {
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.2) transparent;
        }
        
        *::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        
        *::-webkit-scrollbar-track {
          background: transparent;
        }
        
        *::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.2);
          border-radius: 3px;
        }
        
        *::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.3);
        }
        
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
          cursor: pointer;
        }
        
        input[type="range"]::-webkit-slider-track {
          background: rgba(255,255,255,0.1);
          height: 8px;
          border-radius: 4px;
        }
        
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          margin-top: -4px;
          background: linear-gradient(to right, #10b981, #3b82f6);
          height: 16px;
          width: 16px;
          border-radius: 50%;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        }
        
        input[type="range"]::-moz-range-track {
          background: rgba(255,255,255,0.1);
          height: 8px;
          border-radius: 4px;
        }
        
        input[type="range"]::-moz-range-thumb {
          background: linear-gradient(to right, #10b981, #3b82f6);
          height: 16px;
          width: 16px;
          border-radius: 50%;
          border: none;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        }
      `}</style>
      <div className={showNav ? 'pb-20 md:pb-0 md:pt-16' : ''}>
        {children}
      </div>
    </div>
    </NotificationProvider>
  );
}