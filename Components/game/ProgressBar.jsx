import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Lock } from 'lucide-react';

const chapters = [
  { id: 1, name: 'Diagnostic', icon: '🔍' },
  { id: 2, name: 'Découverte', icon: '💡' },
  { id: 3, name: 'Action', icon: '⚡' },
  { id: 4, name: 'Résultat', icon: '🏆' }
];

export default function ProgressBar({ currentChapter, completedChapters = [] }) {
  return (
    <div className="w-full bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
      <div className="flex items-center justify-between relative">
        {/* Progress line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-700 -translate-y-1/2 z-0 mx-8" />
        <motion.div
          className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-emerald-500 to-blue-500 -translate-y-1/2 z-0 ml-8"
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(0, (currentChapter - 1) / (chapters.length - 1) * 100 - 10)}%` }}
          transition={{ duration: 0.5 }}
        />

        {chapters.map((chapter) => {
          const isCompleted = completedChapters.includes(chapter.id);
          const isCurrent = chapter.id === currentChapter;
          const isLocked = chapter.id > currentChapter && !isCompleted;

          return (
            <motion.div
              key={chapter.id}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: chapter.id * 0.1 }}
              className="relative z-10 flex flex-col items-center"
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all ${
                  isCompleted
                    ? 'bg-gradient-to-r from-emerald-500 to-blue-500 shadow-lg shadow-emerald-500/30'
                    : isCurrent
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 shadow-lg shadow-orange-500/30 animate-pulse'
                    : 'bg-slate-700'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-6 h-6 text-white" />
                ) : isLocked ? (
                  <Lock className="w-5 h-5 text-slate-500" />
                ) : (
                  <span>{chapter.icon}</span>
                )}
              </div>
              <span className={`mt-2 text-xs font-medium ${
                isCurrent ? 'text-white' : 'text-slate-400'
              }`}>
                {chapter.name}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}