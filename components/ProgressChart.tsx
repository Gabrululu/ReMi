'use client';

import React, { useState, useEffect } from 'react';

interface ProgressData {
  label: string;
  value: number;
  maxValue: number;
  color: string;
  icon: string;
}

interface ProgressChartProps {
  data: ProgressData[];
  title: string;
  type?: 'bar' | 'radial' | 'line';
  animate?: boolean;
}

export function ProgressChart({ data, title, type = 'bar', animate = true }: ProgressChartProps) {
  const [animatedValues, setAnimatedValues] = useState<number[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    if (animate) {
      // Animate values from 0 to actual values
      const animationDuration = 1000;
      const steps = 60;
      const stepDuration = animationDuration / steps;

      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        
        setAnimatedValues(
          data.map(item => Math.floor(item.value * progress))
        );

        if (currentStep >= steps) {
          clearInterval(interval);
          setAnimatedValues(data.map(item => item.value));
        }
      }, stepDuration);

      return () => clearInterval(interval);
    } else {
      setAnimatedValues(data.map(item => item.value));
    }
  }, [data, animate]);

  const renderBarChart = () => (
    <div className="space-y-4">
      {data.map((item, index) => {
        const percentage = (animatedValues[index] / item.maxValue) * 100;
        const isHovered = hoveredIndex === index;
        
        return (
          <div
            key={index}
            className="group"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {item.label}
                </span>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-gray-900 dark:text-white">
                  {animatedValues[index]}/{item.maxValue}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {Math.round(percentage)}%
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className="h-3 rounded-full transition-all duration-500 ease-out relative"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: item.color
                  }}
                >
                  {/* Animated fill effect */}
                  {isHovered && (
                    <div 
                      className="absolute inset-0 opacity-30"
                      style={{
                        background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)`,
                        animation: 'shimmer 1.5s infinite'
                      }}
                    />
                  )}
                </div>
              </div>
              
              {/* Hover tooltip */}
              {isHovered && (
                <div 
                  className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg z-10"
                  style={{ backgroundColor: item.color }}
                >
                  {item.label}: {animatedValues[index]}/{item.maxValue}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderRadialChart = () => (
    <div className="grid grid-cols-2 gap-4">
      {data.map((item, index) => {
        const percentage = (animatedValues[index] / item.maxValue) * 100;
        const radius = 40;
        const circumference = 2 * Math.PI * radius;
        const strokeDasharray = circumference;
        const strokeDashoffset = circumference - (percentage / 100) * circumference;
        
        return (
          <div
            key={index}
            className="text-center group"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="relative inline-block">
              <svg width="100" height="100" className="transform -rotate-90">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke="#E5E7EB"
                  strokeWidth="8"
                  fill="transparent"
                  className="dark:stroke-gray-700"
                />
                {/* Progress circle */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke={item.color}
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              
              {/* Center content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg">{item.icon}</span>
                <span className="text-xs font-bold text-gray-900 dark:text-white">
                  {Math.round(percentage)}%
                </span>
              </div>
            </div>
            
            <div className="mt-2">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {item.label}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {animatedValues[index]}/{item.maxValue}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderLineChart = () => (
    <div className="relative">
      <svg width="100%" height="200" className="overflow-visible">
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((y, i) => (
          <line
            key={i}
            x1="0"
            y1={200 - (y / 100) * 160}
            x2="100%"
            y2={200 - (y / 100) * 160}
            stroke="#E5E7EB"
            strokeWidth="1"
            className="dark:stroke-gray-700"
          />
        ))}
        
        {/* Data line */}
        <polyline
          points={data.map((item, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = 200 - ((animatedValues[index] / item.maxValue) * 160);
            return `${x}%,${y}`;
          }).join(' ')}
          fill="none"
          stroke={data[0]?.color || '#3B82F6'}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-1000 ease-out"
        />
        
        {/* Data points */}
        {data.map((item, index) => {
          const x = (index / (data.length - 1)) * 100;
          const y = 200 - ((animatedValues[index] / item.maxValue) * 160);
          const isHovered = hoveredIndex === index;
          
          return (
            <g key={index}>
              <circle
                cx={`${x}%`}
                cy={y}
                r={isHovered ? 8 : 6}
                fill={item.color}
                stroke="white"
                strokeWidth="2"
                className="transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
              
              {/* Hover tooltip */}
              {isHovered && (
                <foreignObject
                  x={`${x}%`}
                  y={y - 40}
                  width="120"
                  height="30"
                  className="transform -translate-x-1/2"
                >
                  <div className="bg-gray-900 dark:bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg">
                    {item.label}: {animatedValues[index]}/{item.maxValue}
                  </div>
                </foreignObject>
              )}
            </g>
          );
        })}
      </svg>
      
      {/* X-axis labels */}
      <div className="flex justify-between mt-2">
        {data.map((item, index) => (
          <div key={index} className="text-xs text-gray-500 dark:text-gray-400 text-center">
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h3>
      
      {type === 'bar' && renderBarChart()}
      {type === 'radial' && renderRadialChart()}
      {type === 'line' && renderLineChart()}
    </div>
  );
} 