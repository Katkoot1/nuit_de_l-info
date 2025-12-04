import React from 'react';
import { motion } from 'framer-motion';

export default function SchoolView({ transformationLevel = 0, className = '' }) {
  // transformationLevel: 0 = before, 100 = fully transformed
  const isTransformed = transformationLevel > 50;

  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 400 300" className="w-full h-auto">
        {/* Sky */}
        <defs>
          <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={isTransformed ? '#0ea5e9' : '#64748b'} />
            <stop offset="100%" stopColor={isTransformed ? '#bae6fd' : '#94a3b8'} />
          </linearGradient>
          <linearGradient id="grassGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={isTransformed ? '#22c55e' : '#6b7280'} />
            <stop offset="100%" stopColor={isTransformed ? '#16a34a' : '#4b5563'} />
          </linearGradient>
        </defs>

        {/* Background */}
        <rect width="400" height="300" fill="url(#skyGradient)" />
        
        {/* Sun or Cloud */}
        <motion.circle
          cx="350"
          cy="50"
          r="30"
          fill={isTransformed ? '#fbbf24' : '#9ca3af'}
          animate={{ 
            scale: isTransformed ? [1, 1.1, 1] : 1,
            opacity: isTransformed ? 1 : 0.5
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Ground */}
        <rect y="220" width="400" height="80" fill="url(#grassGradient)" />

        {/* Main Building */}
        <motion.g
          animate={{ 
            fill: isTransformed ? '#f8fafc' : '#e2e8f0'
          }}
        >
          {/* Building body */}
          <rect x="100" y="120" width="200" height="100" fill={isTransformed ? '#f8fafc' : '#d1d5db'} stroke="#475569" strokeWidth="2" />
          
          {/* Roof */}
          <polygon points="100,120 200,60 300,120" fill={isTransformed ? '#10b981' : '#6b7280'} stroke="#475569" strokeWidth="2" />
          
          {/* Door */}
          <rect x="175" y="170" width="50" height="50" fill={isTransformed ? '#3b82f6' : '#4b5563'} />
          
          {/* Windows */}
          <rect x="120" y="140" width="35" height="30" fill={isTransformed ? '#bfdbfe' : '#9ca3af'} stroke="#475569" />
          <rect x="245" y="140" width="35" height="30" fill={isTransformed ? '#bfdbfe' : '#9ca3af'} stroke="#475569" />
          <rect x="120" y="180" width="35" height="30" fill={isTransformed ? '#bfdbfe' : '#9ca3af'} stroke="#475569" />
          <rect x="245" y="180" width="35" height="30" fill={isTransformed ? '#bfdbfe' : '#9ca3af'} stroke="#475569" />
        </motion.g>

        {/* Solar panels (only when transformed) */}
        {transformationLevel > 30 && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: transformationLevel / 100 }}
          >
            <rect x="130" y="75" width="30" height="20" fill="#1e40af" stroke="#1e3a8a" />
            <rect x="170" y="75" width="30" height="20" fill="#1e40af" stroke="#1e3a8a" />
            <rect x="210" y="85" width="30" height="20" fill="#1e40af" stroke="#1e3a8a" />
          </motion.g>
        )}

        {/* Trees (more when transformed) */}
        <motion.g>
          {/* Left tree */}
          <rect x="45" y="180" width="10" height="40" fill="#854d0e" />
          <circle cx="50" cy="170" r="25" fill={isTransformed ? '#22c55e' : '#6b7280'} />
          
          {/* Right tree */}
          <rect x="345" y="180" width="10" height="40" fill="#854d0e" />
          <circle cx="350" cy="170" r="25" fill={isTransformed ? '#22c55e' : '#6b7280'} />
        </motion.g>

        {/* Additional trees when transformed */}
        {transformationLevel > 50 && (
          <motion.g
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <rect x="20" y="190" width="8" height="30" fill="#854d0e" />
            <circle cx="24" cy="180" r="18" fill="#22c55e" />
            
            <rect x="370" y="190" width="8" height="30" fill="#854d0e" />
            <circle cx="374" cy="180" r="18" fill="#22c55e" />
          </motion.g>
        )}

        {/* Linux penguin mascot (when transformed) */}
        {transformationLevel > 70 && (
          <motion.g
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <ellipse cx="330" cy="210" rx="15" ry="20" fill="#1e293b" />
            <ellipse cx="330" cy="200" rx="12" ry="12" fill="#1e293b" />
            <ellipse cx="330" cy="205" rx="8" ry="10" fill="#f8fafc" />
            <circle cx="326" cy="198" r="2" fill="#1e293b" />
            <circle cx="334" cy="198" r="2" fill="#1e293b" />
            <polygon points="330,202 327,206 333,206" fill="#f97316" />
          </motion.g>
        )}

        {/* Cloud of pollution (before transformation) */}
        {transformationLevel < 30 && (
          <motion.g
            animate={{ x: [0, 10, 0], opacity: [0.5, 0.7, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <ellipse cx="80" cy="80" rx="30" ry="15" fill="#64748b" opacity="0.6" />
            <ellipse cx="100" cy="70" rx="25" ry="12" fill="#64748b" opacity="0.6" />
            <ellipse cx="60" cy="70" rx="20" ry="10" fill="#64748b" opacity="0.6" />
          </motion.g>
        )}

        {/* Recycling bins (when transformed) */}
        {transformationLevel > 60 && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <rect x="310" y="200" width="12" height="18" fill="#22c55e" />
            <rect x="325" y="200" width="12" height="18" fill="#3b82f6" />
            <rect x="340" y="200" width="12" height="18" fill="#eab308" />
          </motion.g>
        )}

        {/* Flag */}
        <line x1="200" y1="60" x2="200" y2="35" stroke="#475569" strokeWidth="2" />
        <motion.rect
          x="200"
          y="35"
          width="25"
          height="15"
          fill={isTransformed ? '#10b981' : '#ef4444'}
          animate={{ scaleX: [1, 0.9, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </svg>

      {/* Transformation level indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-slate-700 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-emerald-500 to-blue-500"
          initial={{ width: 0 }}
          animate={{ width: `${transformationLevel}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
}