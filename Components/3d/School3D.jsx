import React from 'react';
import { motion } from 'framer-motion';

export default function School3D({ transformationLevel = 0, className = "" }) {
  const isTransformed = transformationLevel > 50;
  
  return (
    <div className={`w-full h-full relative overflow-hidden ${className}`}>
      {/* Sky gradient */}
      <div 
        className="absolute inset-0 transition-all duration-500"
        style={{
          background: isTransformed 
            ? 'linear-gradient(to bottom, #0ea5e9, #bae6fd)' 
            : 'linear-gradient(to bottom, #64748b, #94a3b8)'
        }}
      />
      
      {/* Sun */}
      <motion.div
        animate={{ 
          scale: isTransformed ? [1, 1.1, 1] : 1,
          opacity: isTransformed ? 1 : 0.5
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute top-8 right-12 w-16 h-16 rounded-full"
        style={{ background: isTransformed ? '#fbbf24' : '#9ca3af' }}
      />
      
      {/* Ground */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-24 transition-colors duration-500"
        style={{ background: isTransformed ? '#22c55e' : '#6b7280' }}
      />
      
      {/* Main building - 3D isometric style - centered with more space */}
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 left-1/2 -translate-x-1/2 z-0"
        style={{ perspective: '1000px' }}
      >
        {/* Building container with proper alignment */}
        <div className="relative w-48">
          {/* Roof - positioned above the building, aligned with building width */}
          <div 
            className="absolute -top-12 left-0 w-48 h-14 transition-colors duration-500 z-10"
            style={{ 
              background: isTransformed ? '#10b981' : '#6b7280',
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
            }}
          />
          
          {/* Building base */}
          <div 
            className="relative w-48 h-32 transition-colors duration-500"
            style={{ 
              background: isTransformed ? '#f8fafc' : '#d1d5db',
              transform: 'rotateX(10deg) rotateY(-15deg)',
              transformStyle: 'preserve-3d',
              boxShadow: '10px 10px 30px rgba(0,0,0,0.3)'
            }}
          >
            {/* Windows */}
            <div className="absolute top-4 left-4 w-8 h-6 rounded-sm transition-colors duration-500" 
                 style={{ background: isTransformed ? '#bfdbfe' : '#9ca3af' }} />
            <div className="absolute top-4 right-4 w-8 h-6 rounded-sm transition-colors duration-500" 
                 style={{ background: isTransformed ? '#bfdbfe' : '#9ca3af' }} />
            <div className="absolute bottom-8 left-4 w-8 h-6 rounded-sm transition-colors duration-500" 
                 style={{ background: isTransformed ? '#bfdbfe' : '#9ca3af' }} />
            <div className="absolute bottom-8 right-4 w-8 h-6 rounded-sm transition-colors duration-500" 
                 style={{ background: isTransformed ? '#bfdbfe' : '#9ca3af' }} />
            
            {/* Door */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-14 rounded-t-lg transition-colors duration-500"
                 style={{ background: isTransformed ? '#3b82f6' : '#4b5563' }} />
          </div>
          
          {/* Solar panels - positioned on roof */}
          {transformationLevel > 30 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute -top-8 left-8 flex gap-2 z-20"
            >
              <div className="w-6 h-4 bg-blue-800 rounded-sm" />
              <div className="w-6 h-4 bg-blue-800 rounded-sm" />
            </motion.div>
          )}
        </div>
      </motion.div>
      
      {/* Trees - positioned far from building using percentages */}
      <motion.div
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        className="absolute bottom-20 flex flex-col items-center justify-end"
        style={{ left: '5%' }}
      >
        {/* Foliage - on top */}
        <div 
          className="w-16 h-16 rounded-full mb-0 transition-colors duration-500"
          style={{ background: isTransformed ? '#22c55e' : '#6b7280' }}
        />
        {/* Trunk - below foliage */}
        <div className="w-4 h-12 bg-amber-800 -mt-2" />
      </motion.div>
      
      <motion.div
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
        className="absolute bottom-20 flex flex-col items-center justify-end"
        style={{ right: '5%' }}
      >
        {/* Foliage - on top */}
        <div 
          className="w-16 h-16 rounded-full mb-0 transition-colors duration-500"
          style={{ background: isTransformed ? '#22c55e' : '#6b7280' }}
        />
        {/* Trunk - below foliage */}
        <div className="w-4 h-12 bg-amber-800 -mt-2" />
      </motion.div>
      
      {/* Extra trees when transformed - positioned at edges */}
      {transformationLevel > 50 && (
        <>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1, y: [0, -2, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="absolute bottom-20 flex flex-col items-center justify-end"
            style={{ left: '1%' }}
          >
            {/* Foliage - on top */}
            <div className="w-10 h-10 rounded-full mb-0 bg-green-500" />
            {/* Trunk - below foliage */}
            <div className="w-3 h-8 bg-amber-800 -mt-1" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1, y: [0, -2, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.3 }}
            className="absolute bottom-20 flex flex-col items-center justify-end"
            style={{ right: '1%' }}
          >
            {/* Foliage - on top */}
            <div className="w-10 h-10 rounded-full mb-0 bg-green-500" />
            {/* Trunk - below foliage */}
            <div className="w-3 h-8 bg-amber-800 -mt-1" />
          </motion.div>
        </>
      )}
      
      {/* Linux penguin - positioned far left from building */}
      {transformationLevel > 70 && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0, y: [0, -3, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute bottom-20 text-3xl sm:text-4xl z-10"
          style={{ left: '15%' }}
        >
          🐧
        </motion.div>
      )}
      
      {/* Recycle bins - positioned far left from building */}
      {transformationLevel > 60 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-20 flex gap-1 z-10"
          style={{ left: '12%' }}
        >
          <div className="w-4 h-6 rounded-sm bg-green-500" />
          <div className="w-4 h-6 rounded-sm bg-blue-500" />
          <div className="w-4 h-6 rounded-sm bg-yellow-500" />
        </motion.div>
      )}
      
      {/* Pollution cloud (before) - moved away from building */}
      {transformationLevel < 30 && (
        <motion.div
          animate={{ x: [0, 10, 0], opacity: [0.5, 0.7, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute top-16 left-8 sm:left-12"
        >
          <div className="w-16 h-8 rounded-full bg-slate-500/60" />
          <div className="w-12 h-6 rounded-full bg-slate-500/60 -mt-3 ml-4" />
        </motion.div>
      )}
      
      {/* Transformation level indicator */}
      <div className="absolute bottom-2 left-2 right-2 h-2 bg-black/20 rounded-full overflow-hidden">
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