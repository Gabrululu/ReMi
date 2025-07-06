'use client';

import React, { useState, useEffect } from 'react';

interface AnimatedBadgeProps {
  icon: string;
  title: string;
  description: string;
  color: string;
  isUnlocked: boolean;
  progress?: number;
  maxProgress?: number;
  onClick?: () => void;
}

export function AnimatedBadge({ 
  icon, 
  title, 
  description, 
  color, 
  isUnlocked, 
  progress, 
  maxProgress, 
  onClick 
}: AnimatedBadgeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, vx: number, vy: number}>>([]);

  useEffect(() => {
    if (isHovered && isUnlocked) {
      // Create particles on hover
      const newParticles = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: 50,
        y: 50,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4
      }));
      setParticles(newParticles);

      // Animate particles
      const interval = setInterval(() => {
        setParticles(prev => 
          prev.map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy
          })).filter(p => p.x > 0 && p.x < 100 && p.y > 0 && p.y < 100)
        );
      }, 50);

      return () => clearInterval(interval);
    } else {
      setParticles([]);
    }
  }, [isHovered, isUnlocked]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      const style = document.createElement('style');
      style.textContent = `
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `;
      document.head.appendChild(style);
      return () => {
        document.head.removeChild(style);
      };
    }
  }, []);

  const progressPercentage = progress && maxProgress ? (progress / maxProgress) * 100 : 0;

  return (
    <div
      className={`relative group cursor-pointer transition-all duration-300 ${
        isUnlocked 
          ? 'transform hover:scale-105 hover:rotate-1' 
          : 'opacity-75 filter grayscale'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Particle effects */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute w-1 h-1 rounded-full pointer-events-none"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            backgroundColor: color,
            boxShadow: `0 0 4px ${color}`,
            animation: 'pulse 1s infinite'
          }}
        />
      ))}

      {/* Badge container */}
      <div className={`
        relative bg-white dark:bg-gray-800 border-2 rounded-xl p-4 text-center
        transition-all duration-300 transform
        ${isUnlocked 
          ? 'border-current shadow-lg hover:shadow-xl' 
          : 'border-gray-300 dark:border-gray-600'
        }
        ${isHovered && isUnlocked ? 'animate-pulse' : ''}
      `} style={{ borderColor: isUnlocked ? color : undefined }}>
        
        {/* Glow effect */}
        {isUnlocked && (
          <div 
            className="absolute inset-0 rounded-xl opacity-20 blur-sm"
            style={{ backgroundColor: color }}
          />
        )}

        {/* Icon */}
        <div className={`
          text-4xl mb-3 transition-all duration-300
          ${isUnlocked ? 'animate-bounce' : ''}
          ${isHovered && isUnlocked ? 'scale-110' : ''}
        `}>
          {icon}
        </div>

        {/* Title */}
        <h4 className={`
          font-bold text-sm mb-2 transition-colors duration-300
          ${isUnlocked ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}
        `}>
          {title}
        </h4>

        {/* Description */}
        <p className={`
          text-xs transition-colors duration-300
          ${isUnlocked ? 'text-gray-600 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'}
        `}>
          {description}
        </p>

        {/* Progress bar */}
        {progress !== undefined && maxProgress !== undefined && (
          <div className="mt-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {progress}/{maxProgress}
              </span>
              <span className="text-xs font-medium text-gray-900 dark:text-white">
                {Math.round(progressPercentage)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className="h-2 rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${progressPercentage}%`,
                  backgroundColor: isUnlocked ? color : '#9CA3AF'
                }}
              >
                {/* Animated progress fill */}
                {isUnlocked && (
                  <div 
                    className="h-full w-full opacity-30"
                    style={{
                      background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)`,
                      animation: 'shimmer 2s infinite'
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Unlock indicator */}
        {isUnlocked && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
            <span className="text-white text-xs">✓</span>
          </div>
        )}

        {/* Hover effect overlay */}
        {isHovered && isUnlocked && (
          <div 
            className="absolute inset-0 rounded-xl opacity-10"
            style={{ backgroundColor: color }}
          />
        )}
      </div>
    </div>
  );
} 