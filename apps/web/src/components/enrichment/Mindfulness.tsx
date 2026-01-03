/**
 * Mindfulness Moments Component
 * Guided mindfulness exercises for prenatal connection
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { getMindfulnessForDate, getAllMindfulnessExercises, getMindfulnessByType } from '../../data/enrichment/mindfulness';
import type { MindfulnessExercise, MindfulnessType } from '../../types/daily';

const typeLabels: Record<MindfulnessType, string> = {
  breathing: 'Breathing',
  'body-scan': 'Body Scan',
  gratitude: 'Gratitude',
  visualization: 'Visualization',
  connection: 'Baby Connection',
};

const typeIcons: Record<MindfulnessType, React.ReactNode> = {
  breathing: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
    </svg>
  ),
  'body-scan': (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  gratitude: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  visualization: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
  connection: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
};

interface ExercisePlayerProps {
  exercise: MindfulnessExercise;
  onComplete: () => void;
  onClose: () => void;
}

const ExercisePlayer: React.FC<ExercisePlayerProps> = ({ exercise, onComplete, onClose }) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme.isDark;
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(exercise.duration);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');

  const stepDuration = Math.floor(exercise.duration / exercise.instructions.length);

  // Timer effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isPlaying && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          const newTime = prev - 1;
          
          // Update current step based on time
          const elapsed = exercise.duration - newTime;
          const newStep = Math.min(
            Math.floor(elapsed / stepDuration),
            exercise.instructions.length - 1
          );
          if (newStep !== currentStep) {
            setCurrentStep(newStep);
          }
          
          return newTime;
        });
      }, 1000);
    } else if (timeRemaining === 0) {
      onComplete();
    }

    return () => clearInterval(interval);
  }, [isPlaying, timeRemaining, exercise.duration, exercise.instructions.length, stepDuration, currentStep, onComplete]);

  // Breathing animation effect
  useEffect(() => {
    if (!isPlaying || exercise.type !== 'breathing') return;

    const breathCycle = () => {
      setBreathPhase('inhale');
      setTimeout(() => setBreathPhase('hold'), 4000);
      setTimeout(() => setBreathPhase('exhale'), 6000);
    };

    breathCycle();
    const interval = setInterval(breathCycle, 12000);
    return () => clearInterval(interval);
  }, [isPlaying, exercise.type]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((exercise.duration - timeRemaining) / exercise.duration) * 100;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
    >
      <div 
        className="w-full max-w-lg rounded-2xl overflow-hidden"
        style={{
          backgroundColor: isDark ? currentTheme.colors.surface : 'white',
        }}
      >
        {/* Header */}
        <div 
          className="p-4 flex items-center justify-between"
          style={{ 
            background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`,
          }}
        >
          <div className="flex items-center gap-2 text-white">
            {typeIcons[exercise.type]}
            <span className="font-medium">{exercise.title}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 transition-colors text-white"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress bar */}
        <div 
          className="h-1"
          style={{ backgroundColor: isDark ? currentTheme.colors.border : '#e5e7eb' }}
        >
          <div 
            className="h-full transition-all duration-1000"
            style={{ 
              width: `${progress}%`,
              backgroundColor: currentTheme.colors.primary,
            }}
          />
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Breathing circle animation */}
          {exercise.type === 'breathing' && isPlaying && (
            <div className="flex justify-center mb-6">
              <div 
                className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-[4000ms] ${
                  breathPhase === 'inhale' ? 'scale-100' : breathPhase === 'hold' ? 'scale-100' : 'scale-75'
                }`}
                style={{
                  backgroundColor: `${currentTheme.colors.primary}20`,
                  border: `3px solid ${currentTheme.colors.primary}`,
                }}
              >
                <span 
                  className="text-sm font-medium capitalize"
                  style={{ color: currentTheme.colors.primary }}
                >
                  {breathPhase}
                </span>
              </div>
            </div>
          )}

          {/* Timer */}
          <div className="text-center mb-6">
            <span 
              className="text-4xl font-bold"
              style={{ color: currentTheme.colors.text }}
            >
              {formatTime(timeRemaining)}
            </span>
          </div>

          {/* Current instruction */}
          <div 
            className="p-4 rounded-xl mb-6 text-center"
            style={{
              backgroundColor: isDark ? currentTheme.colors.surfaceHover : '#f9fafb',
            }}
          >
            <p 
              className="text-sm leading-relaxed"
              style={{ color: currentTheme.colors.text }}
            >
              {exercise.instructions[currentStep]}
            </p>
          </div>

          {/* Step indicators */}
          <div className="flex justify-center gap-1 mb-6">
            {exercise.instructions.map((_, idx) => (
              <div
                key={idx}
                className="w-2 h-2 rounded-full transition-colors"
                style={{
                  backgroundColor: idx <= currentStep 
                    ? currentTheme.colors.primary 
                    : isDark ? currentTheme.colors.border : '#e5e7eb',
                }}
              />
            ))}
          </div>

          {/* Baby connection note */}
          {exercise.babyConnection && (
            <div 
              className="p-3 rounded-lg mb-6"
              style={{
                backgroundColor: isDark ? `${currentTheme.colors.primary}15` : '#faf5ff',
                border: `1px solid ${isDark ? `${currentTheme.colors.primary}30` : '#e9d5ff'}`,
              }}
            >
              <p 
                className="text-xs text-center"
                style={{ color: isDark ? currentTheme.colors.textMuted : '#7c3aed' }}
              >
                {exercise.babyConnection}
              </p>
            </div>
          )}

          {/* Controls */}
          <div className="flex justify-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-6 py-3 rounded-xl font-medium transition-colors"
              style={{
                backgroundColor: currentTheme.colors.primary,
                color: 'white',
              }}
            >
              {isPlaying ? 'Pause' : 'Start'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ExerciseCardProps {
  exercise: MindfulnessExercise;
  onStart: () => void;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, onStart }) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme.isDark;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: isDark ? currentTheme.colors.surface : 'white',
        border: `1px solid ${isDark ? currentTheme.colors.border : '#e5e7eb'}`,
      }}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span 
              className="p-2 rounded-lg"
              style={{ 
                backgroundColor: isDark ? `${currentTheme.colors.primary}20` : '#f3e8ff',
                color: currentTheme.colors.primary,
              }}
            >
              {typeIcons[exercise.type]}
            </span>
            <div>
              <h3 
                className="font-semibold"
                style={{ color: currentTheme.colors.text }}
              >
                {exercise.title}
              </h3>
              <span 
                className="text-xs"
                style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}
              >
                {typeLabels[exercise.type]} • {formatDuration(exercise.duration)}
              </span>
            </div>
          </div>
        </div>

        {/* Preview of instructions */}
        <p 
          className="text-sm mb-3 line-clamp-2"
          style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}
        >
          {exercise.instructions[0]}
        </p>

        {/* Baby connection preview */}
        {exercise.babyConnection && (
          <div 
            className="p-2 rounded-lg mb-3"
            style={{
              backgroundColor: isDark ? `${currentTheme.colors.primary}10` : '#faf5ff',
            }}
          >
            <p 
              className="text-xs line-clamp-2"
              style={{ color: isDark ? currentTheme.colors.textMuted : '#7c3aed' }}
            >
              {exercise.babyConnection}
            </p>
          </div>
        )}

        {/* Start button */}
        <button
          onClick={onStart}
          className="w-full py-2.5 rounded-lg text-sm font-medium transition-colors"
          style={{
            backgroundColor: currentTheme.colors.primary,
            color: 'white',
          }}
        >
          Begin Exercise
        </button>
      </div>
    </div>
  );
};

export const Mindfulness: React.FC<{ compact?: boolean; refreshKey?: number }> = ({ compact, refreshKey }) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme.isDark;
  const [filter, setFilter] = useState<'today' | MindfulnessType | 'all'>('all');
  const [activeExercise, setActiveExercise] = useState<MindfulnessExercise | null>(null);

  const todaysExercise = useMemo(() => getMindfulnessForDate(new Date()), []);
  const allExercises = useMemo(() => getAllMindfulnessExercises(), []);

  const [randomExercise, setRandomExercise] = useState<MindfulnessExercise | null>(null);

  React.useEffect(() => {
    if (!refreshKey) {
        setRandomExercise(null);
        return;
    }
    setRandomExercise([...allExercises].sort(() => 0.5 - Math.random())[0]);
  }, [refreshKey, allExercises]);

  const displayExercises = useMemo(() => {
    if (compact) {
        return (refreshKey && randomExercise) ? [randomExercise] : (todaysExercise ? [todaysExercise] : []);
    }
    if (filter === 'today') {
      return allExercises; // Override 'today' to 'all'
    } else if (filter === 'all') {
      return allExercises;
    } else {
      return getMindfulnessByType(filter);
    }
  }, [filter, todaysExercise, compact, allExercises, refreshKey, randomExercise]);

  const types: MindfulnessType[] = ['breathing', 'body-scan', 'gratitude', 'visualization', 'connection'];

  const handleComplete = useCallback(() => {
    setActiveExercise(null);
  }, []);

  return (
    <div className="space-y-6">
      {/* Filter tabs - Hidden in compact mode */}
      {!compact && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hidden">
          <button
            onClick={() => setFilter('all')}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
            style={{
              backgroundColor: filter === 'all' 
                ? currentTheme.colors.primary 
                : isDark ? currentTheme.colors.surface : 'white',
              color: filter === 'all' ? 'white' : currentTheme.colors.text,
              border: filter === 'all' 
                ? 'none' 
                : `1px solid ${isDark ? currentTheme.colors.border : '#e5e7eb'}`,
            }}
          >
            All Exercises
          </button>
          
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
              style={{
                backgroundColor: filter === type 
                  ? currentTheme.colors.primary 
                  : isDark ? currentTheme.colors.surface : 'white',
                color: filter === type ? 'white' : currentTheme.colors.text,
                border: filter === type 
                  ? 'none' 
                  : `1px solid ${isDark ? currentTheme.colors.border : '#e5e7eb'}`,
              }}
            >
              {typeLabels[type]}
            </button>
          ))}
        </div>
      )}

      {/* Results count - Hidden in compact mode */}
      {!compact && (
        <p 
          className="text-sm"
          style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}
        >
          {displayExercises.length} exercise{displayExercises.length !== 1 ? 's' : ''}
        </p>
      )}

      {/* Exercise cards */}
      <div className={`grid gap-4 ${compact ? 'grid-cols-1' : 'md:grid-cols-2'}`}>
        {displayExercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            onStart={() => setActiveExercise(exercise)}
          />
        ))}
      </div>

      {displayExercises.length === 0 && (
        <div 
          className="text-center py-12 rounded-2xl"
          style={{
            backgroundColor: isDark ? currentTheme.colors.surface : 'white',
            border: `1px solid ${isDark ? currentTheme.colors.border : '#e5e7eb'}`,
          }}
        >
          <p style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}>
            No exercises available
          </p>
        </div>
      )}

      {/* Exercise player modal */}
      {activeExercise && (
        <ExercisePlayer
          exercise={activeExercise}
          onComplete={handleComplete}
          onClose={() => setActiveExercise(null)}
        />
      )}
    </div>
  );
};

export default Mindfulness;
