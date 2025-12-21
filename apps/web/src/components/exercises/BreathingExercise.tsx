import React, { useState, useEffect, useRef } from 'react';
import type { BreathingExercise as BreathingExerciseType, BreathingResponseData } from '../../types/exercises';
import { Wind, PartyPopper } from 'lucide-react';

interface BreathingExerciseProps {
  exercise: BreathingExerciseType;
  onAnswer: (data: BreathingResponseData) => void;
  onComplete: () => void;
}

type BreathingPhase = 'idle' | 'inhale' | 'hold' | 'exhale';

/**
 * BreathingExercise Component
 * 
 * Renders an animated breathing guide with timing indicators.
 * 
 * Requirements:
 * - 2.5: Display animated breathing guide with inhale/hold/exhale timing indicators
 */
export const BreathingExercise: React.FC<BreathingExerciseProps> = ({
  exercise,
  onAnswer,
  onComplete,
}) => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<BreathingPhase>('idle');
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [timeInPhase, setTimeInPhase] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const startTimeRef = useRef<number>(0);
  const animationRef = useRef<number | null>(null);

  const { pattern, cycles } = exercise;
  const totalCycleTime = pattern.inhale + pattern.hold + pattern.exhale;

  const getPhaseLabel = (p: BreathingPhase): string => {
    switch (p) {
      case 'inhale': return 'Breathe In';
      case 'hold': return 'Hold';
      case 'exhale': return 'Breathe Out';
      default: return 'Ready';
    }
  };

  const getPhaseDuration = (p: BreathingPhase): number => {
    switch (p) {
      case 'inhale': return pattern.inhale;
      case 'hold': return pattern.hold;
      case 'exhale': return pattern.exhale;
      default: return 0;
    }
  };

  const getCircleScale = (): number => {
    if (phase === 'idle') return 0.6;
    const duration = getPhaseDuration(phase);
    const progress = duration > 0 ? timeInPhase / duration : 0;
    
    switch (phase) {
      case 'inhale':
        return 0.6 + (0.4 * progress); // 0.6 -> 1.0
      case 'hold':
        return 1.0;
      case 'exhale':
        return 1.0 - (0.4 * progress); // 1.0 -> 0.6
      default:
        return 0.6;
    }
  };

  useEffect(() => {
    if (!isActive) return;

    const tick = () => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      setTotalDuration(elapsed);

      // Calculate current cycle and phase
      const cycleTime = elapsed % totalCycleTime;
      const currentCycle = Math.floor(elapsed / totalCycleTime);

      if (currentCycle >= cycles) {
        // Exercise complete
        setIsActive(false);
        setCyclesCompleted(cycles);
        onAnswer({
          cyclesCompleted: cycles,
          totalDuration: elapsed,
        });
        return;
      }

      setCyclesCompleted(currentCycle);

      // Determine current phase
      if (cycleTime < pattern.inhale) {
        setPhase('inhale');
        setTimeInPhase(cycleTime);
      } else if (cycleTime < pattern.inhale + pattern.hold) {
        setPhase('hold');
        setTimeInPhase(cycleTime - pattern.inhale);
      } else {
        setPhase('exhale');
        setTimeInPhase(cycleTime - pattern.inhale - pattern.hold);
      }

      animationRef.current = requestAnimationFrame(tick);
    };

    animationRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, cycles, pattern, totalCycleTime, onAnswer]);

  const handleStart = () => {
    setIsActive(true);
    setPhase('inhale');
    setCyclesCompleted(0);
    setTimeInPhase(0);
    setTotalDuration(0);
    startTimeRef.current = Date.now();
  };

  const handleStop = () => {
    setIsActive(false);
    setPhase('idle');
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    onAnswer({
      cyclesCompleted,
      totalDuration,
    });
  };

  const isComplete = cyclesCompleted >= cycles && !isActive;

  return (
    <div className="space-y-6">
      {/* Introduction */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <Wind className="w-8 h-8 text-blue-500" />
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Breathing Exercise</h4>
            <p className="text-gray-600">
              Follow the animated circle to guide your breathing. 
              {pattern.inhale}s inhale, {pattern.hold}s hold, {pattern.exhale}s exhale.
            </p>
          </div>
        </div>
      </div>

      {/* Breathing circle */}
      <div className="flex flex-col items-center py-8">
        <div className="relative w-48 h-48 flex items-center justify-center">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-4 border-purple-100" />
          
          {/* Animated circle */}
          <div
            className={`rounded-full transition-all duration-300 ease-in-out flex items-center justify-center ${
              phase === 'inhale' ? 'bg-blue-400' :
              phase === 'hold' ? 'bg-purple-400' :
              phase === 'exhale' ? 'bg-pink-400' :
              'bg-gray-300'
            }`}
            style={{
              width: `${getCircleScale() * 100}%`,
              height: `${getCircleScale() * 100}%`,
            }}
          >
            <span className="text-white font-medium text-lg">
              {getPhaseLabel(phase)}
            </span>
          </div>
        </div>

        {/* Phase timer */}
        {isActive && (
          <div className="mt-4 text-center">
            <div className="text-3xl font-bold text-purple-600">
              {Math.ceil(getPhaseDuration(phase) - timeInPhase)}
            </div>
            <div className="text-sm text-gray-500">seconds</div>
          </div>
        )}
      </div>

      {/* Progress */}
      <div className="bg-gray-50 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Progress</span>
          <span className="text-sm font-medium text-purple-600">
            {cyclesCompleted} / {cycles} cycles
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(cyclesCompleted / cycles) * 100}%` }}
          />
        </div>
      </div>

      {/* Prompts */}
      {exercise.prompts.length > 0 && (
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
          <h4 className="font-medium text-amber-800 mb-2">While you breathe...</h4>
          <ul className="space-y-1">
            {exercise.prompts.map((prompt, index) => (
              <li key={index} className="text-amber-700 text-sm flex items-start gap-2">
                <span>•</span>
                <span>{prompt}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Completion message */}
      {isComplete && (
        <div className="bg-green-50 rounded-xl p-4 border border-green-200">
          <div className="flex items-start gap-3">
            <PartyPopper className="w-8 h-8 text-green-600" />
            <div>
              <p className="font-medium text-green-800">Wonderful!</p>
              <p className="text-green-700 text-sm">
                You completed {cycles} breathing cycles. Take a moment to notice how you feel.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-center gap-3">
        {!isActive && !isComplete && (
          <button
            onClick={handleStart}
            className="px-8 py-3 rounded-xl font-medium bg-purple-500 text-white hover:bg-purple-600 button-interactive"
          >
            Start Breathing
          </button>
        )}
        {isActive && (
          <button
            onClick={handleStop}
            className="px-8 py-3 rounded-xl font-medium bg-gray-500 text-white hover:bg-gray-600 button-interactive"
          >
            Stop Early
          </button>
        )}
        {isComplete && (
          <button
            onClick={onComplete}
            className="px-8 py-3 rounded-xl font-medium bg-purple-500 text-white hover:bg-purple-600 button-interactive"
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
};

export default BreathingExercise;
