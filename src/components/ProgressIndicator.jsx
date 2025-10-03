
'use client';

import { useApp } from '@/context/AppContext';
import { STEPS } from '@/utils/constants';
import { useEffect, useState } from 'react';

export default function ProgressIndicator() {
  const { state } = useApp();
  const [animate, setAnimate] = useState(false);
  
  const steps = [
    { key: STEPS.TEMPLATE, label: 'Template', icon: '📋' },
    { key: STEPS.INPUTS, label: 'Details', icon: '✏️' },
    { key: STEPS.EMAILS, label: 'Emails', icon: '✉️' },
    { key: STEPS.SCHEDULE, label: 'Schedule', icon: '📅' },
    { key: STEPS.REVIEW, label: 'Review', icon: '✓' }
  ];

  const currentIndex = steps.findIndex(s => s.key === state.currentStep);

  // Trigger animation when step changes
  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 600);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  return (
    <div className="mb-12 bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Steps Container */}
        <div className="relative">
          {/* SVG Lines */}
          <svg 
            className="absolute top-5 left-0 w-full h-1" 
            style={{ zIndex: 0 }}
          >
            {/* Background line */}
            <line
              x1="5%"
              y1="0"
              x2="95%"
              y2="0"
              stroke="#E5E7EB"
              strokeWidth="2"
            />
            
            {/* Animated progress line */}
            <line
              x1="5%"
              y1="0"
              x2={`${5 + (currentIndex * 22.5)}%`}
              y2="0"
              stroke="url(#blueGradient)"
              strokeWidth="3"
              strokeLinecap="round"
              className={animate ? 'transition-all duration-500 ease-out' : ''}
            />
            
            {/* Gradient definition */}
            <defs>
              <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#2563EB" />
              </linearGradient>
            </defs>
            
            {/* Animated pulse at the end of progress */}
            {currentIndex < steps.length - 1 && (
              <circle
                cx={`${5 + (currentIndex * 22.5)}%`}
                cy="0"
                r="3"
                fill="#2563EB"
              >
                <animate
                  attributeName="r"
                  from="3"
                  to="6"
                  dur="1s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  from="1"
                  to="0"
                  dur="1s"
                  repeatCount="indefinite"
                />
              </circle>
            )}
          </svg>

          {/* Step Circles and Labels */}
          <div className="relative flex justify-between items-start" style={{ zIndex: 1 }}>
            {steps.map((step, idx) => {
              const isCompleted = idx < currentIndex;
              const isCurrent = idx === currentIndex;
              const isFuture = idx > currentIndex;

              return (
                <div key={step.key} className="flex flex-col items-center" style={{ width: '80px' }}>
                  {/* Circle */}
                  <div
                    className={`
                      relative w-10 h-10 rounded-full flex items-center justify-center
                      font-semibold text-sm transition-all duration-300 mb-3
                      ${isCompleted 
                        ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg scale-100' 
                        : isCurrent 
                        ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-xl scale-110 ring-4 ring-blue-100' 
                        : 'bg-gray-100 text-gray-400 scale-95'
                      }
                    `}
                  >
                    {isCompleted ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span>{step.icon}</span>
                    )}
                    
                    {/* Pulse animation for current step */}
                    {isCurrent && (
                      <span className="absolute inset-0 rounded-full bg-blue-600 opacity-75 animate-ping" />
                    )}
                  </div>

                  {/* Label */}
                  <span
                    className={`
                      text-xs font-medium text-center transition-all duration-300
                      ${isCurrent 
                        ? 'text-blue-700 scale-105' 
                        : isCompleted 
                        ? 'text-gray-700' 
                        : 'text-gray-400'
                      }
                    `}
                  >
                    {step.label}
                  </span>

                  {/* Step number */}
                  <span className="text-[10px] text-gray-400 mt-1">
                    Step {idx + 1}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Progress Percentage */}
        <div className="mt-6 flex items-center justify-center gap-2">
          <div className="h-1.5 flex-1 bg-gray-100 rounded-full overflow-hidden max-w-md">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentIndex + 1) / steps.length) * 100}%` }}
            />
          </div>
          <span className="text-sm font-medium text-gray-600 min-w-[60px] text-right">
            {Math.round(((currentIndex + 1) / steps.length) * 100)}%
          </span>
        </div>

        {/* Step Description */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            {currentIndex === 0 && "Choose a template to get started"}
            {currentIndex === 1 && "Tell us about your company and prospect"}
            {currentIndex === 2 && "Create or generate your email content"}
            {currentIndex === 3 && "Set when each email should be sent"}
            {currentIndex === 4 && "Review everything before starting"}
          </p>
        </div>
      </div>
    </div>
  );
}