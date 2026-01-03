/**
 * Interactive Simulation Exercise Component
 * Renders interactive simulations with variable controls and dynamic explanations
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import type { InteractiveSimulationExercise as SimulationExerciseType } from '../../types/exercises';

interface Props {
  exercise: SimulationExerciseType;
  onComplete: () => void;
}

// Helper to evaluate simple conditions
function evaluateCondition(condition: string, variables: Record<string, number | string | boolean>): boolean {
  try {
    // Simple condition evaluation - supports basic comparisons
    const parts = condition.split(/\s*(>=|<=|>|<|===|==|!==|!=)\s*/);
    if (parts.length === 3) {
      const [varName, operator, value] = parts;
      const varValue = variables[varName.trim()];
      const compareValue = isNaN(Number(value)) ? value.trim() : Number(value);
      
      switch (operator) {
        case '>=': return Number(varValue) >= Number(compareValue);
        case '<=': return Number(varValue) <= Number(compareValue);
        case '>': return Number(varValue) > Number(compareValue);
        case '<': return Number(varValue) < Number(compareValue);
        case '===':
        case '==': return varValue === compareValue;
        case '!==':
        case '!=': return varValue !== compareValue;
        default: return false;
      }
    }
    return false;
  } catch {
    return false;
  }
}

// Variable Control Component
interface VariableControlProps {
  variable: SimulationExerciseType['variables'][0];
  value: number | string | boolean;
  onChange: (value: number | string | boolean) => void;
}

const VariableControl: React.FC<VariableControlProps> = ({ variable, value, onChange }) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme.isDark;

  if (variable.type === 'slider') {
    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label 
            className="text-sm font-medium"
            style={{ color: currentTheme.colors.text }}
          >
            {variable.label}
          </label>
          <span 
            className="text-sm font-mono"
            style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}
          >
            {value as number}
          </span>
        </div>
        <input
          type="range"
          min={variable.min ?? 0}
          max={variable.max ?? 100}
          step={variable.step ?? 1}
          value={value as number}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, ${currentTheme.colors.primary} 0%, ${currentTheme.colors.primary} ${((value as number - (variable.min ?? 0)) / ((variable.max ?? 100) - (variable.min ?? 0))) * 100}%, ${isDark ? currentTheme.colors.border : '#e5e7eb'} ${((value as number - (variable.min ?? 0)) / ((variable.max ?? 100) - (variable.min ?? 0))) * 100}%, ${isDark ? currentTheme.colors.border : '#e5e7eb'} 100%)`,
          }}
        />
      </div>
    );
  }

  if (variable.type === 'toggle') {
    return (
      <div className="flex items-center justify-between">
        <label 
          className="text-sm font-medium"
          style={{ color: currentTheme.colors.text }}
        >
          {variable.label}
        </label>
        <button
          onClick={() => onChange(!value)}
          className={`relative w-12 h-6 rounded-full transition-colors ${value ? '' : ''}`}
          style={{
            backgroundColor: value ? currentTheme.colors.primary : (isDark ? currentTheme.colors.border : '#d1d5db'),
          }}
          role="switch"
          aria-checked={value as boolean}
        >
          <span
            className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${value ? 'translate-x-7' : 'translate-x-1'}`}
          />
        </button>
      </div>
    );
  }

  if (variable.type === 'select' && variable.options) {
    return (
      <div className="space-y-2">
        <label 
          className="text-sm font-medium block"
          style={{ color: currentTheme.colors.text }}
        >
          {variable.label}
        </label>
        <select
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 rounded-lg text-sm transition-colors focus-ring"
          style={{
            backgroundColor: isDark ? currentTheme.colors.surfaceHover : 'white',
            color: currentTheme.colors.text,
            border: `1px solid ${isDark ? currentTheme.colors.border : '#e5e7eb'}`,
          }}
        >
          {variable.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return null;
};

// Wave simulation renderer
function renderWaveSimulation(
  ctx: CanvasRenderingContext2D, 
  canvas: HTMLCanvasElement, 
  variables: Record<string, number | string | boolean>,
  primaryColor: string
) {
  const amplitude = (variables.amplitude as number) || 50;
  const frequency = (variables.frequency as number) || 2;
  const speed = (variables.speed as number) || 1;
  
  ctx.strokeStyle = primaryColor;
  ctx.lineWidth = 3;
  ctx.beginPath();
  
  const time = Date.now() / 1000 * speed;
  
  for (let x = 0; x < canvas.width; x++) {
    const y = canvas.height / 2 + amplitude * Math.sin((x / canvas.width) * frequency * Math.PI * 2 + time);
    if (x === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  
  ctx.stroke();
}

// Network simulation renderer
function renderNetworkSimulation(
  ctx: CanvasRenderingContext2D, 
  canvas: HTMLCanvasElement, 
  variables: Record<string, number | string | boolean>,
  primaryColor: string
) {
  const nodes = (variables.nodes as number) || 5;
  const connections = (variables.connections as number) || 3;
  
  // Generate node positions
  const nodePositions: { x: number; y: number }[] = [];
  for (let i = 0; i < nodes; i++) {
    const angle = (i / nodes) * Math.PI * 2;
    const radius = Math.min(canvas.width, canvas.height) * 0.35;
    nodePositions.push({
      x: canvas.width / 2 + Math.cos(angle) * radius,
      y: canvas.height / 2 + Math.sin(angle) * radius,
    });
  }
  
  // Draw connections
  ctx.strokeStyle = `${primaryColor}40`;
  ctx.lineWidth = 2;
  for (let i = 0; i < nodes; i++) {
    for (let j = 0; j < Math.min(connections, nodes - 1); j++) {
      const targetIdx = (i + j + 1) % nodes;
      ctx.beginPath();
      ctx.moveTo(nodePositions[i].x, nodePositions[i].y);
      ctx.lineTo(nodePositions[targetIdx].x, nodePositions[targetIdx].y);
      ctx.stroke();
    }
  }
  
  // Draw nodes
  ctx.fillStyle = primaryColor;
  nodePositions.forEach((pos) => {
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 12, 0, Math.PI * 2);
    ctx.fill();
  });
}

// Probability simulation renderer
function renderProbabilitySimulation(
  ctx: CanvasRenderingContext2D, 
  canvas: HTMLCanvasElement, 
  variables: Record<string, number | string | boolean>,
  primaryColor: string
) {
  const probability = (variables.probability as number) || 50;
  const samples = (variables.samples as number) || 100;
  
  // Draw bar chart
  const barWidth = canvas.width * 0.3;
  const maxHeight = canvas.height * 0.7;
  const successHeight = (probability / 100) * maxHeight;
  const failureHeight = ((100 - probability) / 100) * maxHeight;
  
  // Success bar
  ctx.fillStyle = primaryColor;
  ctx.fillRect(
    canvas.width * 0.25 - barWidth / 2,
    canvas.height - 30 - successHeight,
    barWidth,
    successHeight
  );
  
  // Failure bar
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(
    canvas.width * 0.75 - barWidth / 2,
    canvas.height - 30 - failureHeight,
    barWidth,
    failureHeight
  );
  
  // Labels
  ctx.fillStyle = '#6b7280';
  ctx.font = '14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`Success: ${probability}%`, canvas.width * 0.25, canvas.height - 10);
  ctx.fillText(`Failure: ${100 - probability}%`, canvas.width * 0.75, canvas.height - 10);
  ctx.fillText(`Samples: ${samples}`, canvas.width / 2, 20);
}

export const InteractiveSimulation: React.FC<Props> = ({ exercise, onComplete }) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme.isDark;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const [variables, setVariables] = useState<Record<string, number | string | boolean>>({});
  const [activeExplanation, setActiveExplanation] = useState<string>('');

  // Initialize variables from exercise definition
  useEffect(() => {
    const initial: Record<string, number | string | boolean> = {};
    exercise.variables.forEach((v) => {
      initial[v.name] = v.defaultValue;
    });
    setVariables(initial);
  }, [exercise]);

  // Update explanation based on current variable values
  useEffect(() => {
    for (const exp of exercise.explanations) {
      const result = evaluateCondition(exp.condition, variables);
      if (result) {
        setActiveExplanation(exp.text);
        return;
      }
    }
    setActiveExplanation('');
  }, [variables, exercise.explanations]);

  // Render simulation
  const renderSimulation = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set background
    ctx.fillStyle = isDark ? currentTheme.colors.surfaceHover || '#1f2937' : '#f9fafb';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Render based on simulation type
    switch (exercise.simulationType) {
      case 'wave':
        renderWaveSimulation(ctx, canvas, variables, currentTheme.colors.primary);
        break;
      case 'network':
        renderNetworkSimulation(ctx, canvas, variables, currentTheme.colors.primary);
        break;
      case 'probability':
        renderProbabilitySimulation(ctx, canvas, variables, currentTheme.colors.primary);
        break;
      default:
        // Default visualization
        ctx.fillStyle = currentTheme.colors.primary;
        ctx.font = '16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Simulation visualization', canvas.width / 2, canvas.height / 2);
    }
  }, [exercise.simulationType, variables, currentTheme, isDark]);

  // Animation loop for wave simulation
  useEffect(() => {
    if (exercise.simulationType === 'wave') {
      const animate = () => {
        renderSimulation();
        animationRef.current = requestAnimationFrame(animate);
      };
      animate();
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    } else {
      renderSimulation();
    }
  }, [renderSimulation, exercise.simulationType]);

  const handleVariableChange = (name: string, value: number | string | boolean) => {
    setVariables((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Canvas for visualization */}
      <div
        className="relative rounded-xl overflow-hidden"
        style={{ backgroundColor: isDark ? currentTheme.colors.surfaceHover : '#f9fafb' }}
      >
        <canvas
          ref={canvasRef}
          width={exercise.canvasWidth || 600}
          height={exercise.canvasHeight || 300}
          className="w-full"
        />
      </div>

      {/* Variable controls */}
      <div 
        className="p-4 rounded-xl space-y-4"
        style={{
          backgroundColor: isDark ? currentTheme.colors.surface : 'white',
          border: `1px solid ${isDark ? currentTheme.colors.border : '#e5e7eb'}`,
        }}
      >
        <h4 
          className="text-sm font-semibold"
          style={{ color: currentTheme.colors.text }}
        >
          Adjust Variables
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exercise.variables.map((variable) => (
            <VariableControl
              key={variable.name}
              variable={variable}
              value={variables[variable.name]}
              onChange={(value) => handleVariableChange(variable.name, value)}
            />
          ))}
        </div>
      </div>

      {/* Dynamic explanation */}
      {activeExplanation && (
        <div
          className="p-4 rounded-xl animate-fade-in"
          style={{ 
            backgroundColor: isDark ? `${currentTheme.colors.primary}15` : '#faf5ff',
            border: `1px solid ${isDark ? `${currentTheme.colors.primary}30` : '#e9d5ff'}`,
          }}
        >
          <div className="flex items-start gap-3">
            <svg 
              className="w-5 h-5 mt-0.5 flex-shrink-0"
              style={{ color: currentTheme.colors.primary }}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <p 
              className="text-sm"
              style={{ color: currentTheme.colors.text }}
            >
              {activeExplanation}
            </p>
          </div>
        </div>
      )}

      {/* Complete button */}
      <button
        onClick={onComplete}
        className="w-full py-3 rounded-xl font-medium text-white transition-colors"
        style={{ backgroundColor: currentTheme.colors.primary }}
      >
        Complete Simulation
      </button>
    </div>
  );
};

export default InteractiveSimulation;
