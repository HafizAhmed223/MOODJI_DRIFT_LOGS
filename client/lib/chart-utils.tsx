import React from 'react';
import { DriftLogEntry } from './drift-data';

// Enhanced tooltip content component
export const CustomTooltip = ({ 
  active, 
  payload, 
  label, 
  type = 'default',
  formatValue,
  showUnit = true 
}: {
  active?: boolean;
  payload?: any[];
  label?: any;
  type?: 'timeline' | 'frequency' | 'phase' | 'status' | 'default';
  formatValue?: (value: any) => string;
  showUnit?: boolean;
}) => {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0]?.payload;
  
  return (
    <div className="bg-card/95 backdrop-blur-sm border border-celestial-aurora/30 rounded-lg p-4 shadow-xl">
      <div className="space-y-2">
        {/* Label/Date */}
        {label && (
          <p className="text-sm font-medium text-foreground border-b border-celestial-aurora/20 pb-2">
            {type === 'timeline' ? `Date: ${label}` : label}
          </p>
        )}
        
        {/* Main value */}
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color || 'hsl(var(--celestial-aurora))' }}
              />
              <span className="text-sm text-muted-foreground">
                {getTooltipLabel(entry.dataKey, type)}
              </span>
            </div>
            <span className="text-sm font-medium text-foreground">
              {formatValue ? formatValue(entry.value) : formatTooltipValue(entry.value, entry.dataKey, showUnit)}
            </span>
          </div>
        ))}
        
        {/* Additional context for timeline tooltips */}
        {type === 'timeline' && data && (
          <div className="pt-2 border-t border-celestial-aurora/20 space-y-1">
            {data.mood && (
              <p className="text-xs text-muted-foreground">
                <span className="text-celestial-aurora">Mood:</span> {data.mood}
              </p>
            )}
            {data.hz && (
              <p className="text-xs text-muted-foreground">
                <span className="text-celestial-plasma">Frequency:</span> {data.hz} Hz
              </p>
            )}
            {data.phase && (
              <p className="text-xs text-muted-foreground">
                <span className="text-celestial-quantum">Bloom Phase:</span> {data.phase}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to get appropriate tooltip labels
const getTooltipLabel = (dataKey: string, type: string): string => {
  const labels: { [key: string]: string } = {
    intensity: 'Conflict Intensity',
    value: type === 'frequency' ? 'Frequency Count' : 
           type === 'phase' ? 'Phase Progress' : 
           type === 'status' ? 'Status Count' : 'Value',
    count: 'Occurrences',
    phase: 'Bloom Phase',
    hz: 'Frequency (Hz)',
    mood: 'Emotional State',
    date: 'Timeline',
  };
  
  return labels[dataKey] || dataKey.charAt(0).toUpperCase() + dataKey.slice(1);
};

// Helper function to format tooltip values with appropriate units
const formatTooltipValue = (value: any, dataKey: string, showUnit: boolean): string => {
  if (typeof value !== 'number') return String(value);
  
  const formatters: { [key: string]: (val: number) => string } = {
    intensity: (val) => showUnit ? `${(val * 100).toFixed(1)}%` : val.toFixed(2),
    hz: (val) => showUnit ? `${val.toFixed(1)} Hz` : val.toFixed(1),
    phase: (val) => `Phase ${val}`,
    count: (val) => showUnit ? `${val} entries` : val.toString(),
    value: (val) => val.toString(),
  };
  
  const formatter = formatters[dataKey] || ((val: number) => val.toFixed(1));
  return formatter(value);
};

// Enhanced chart configurations
export const chartConfigs = {
  timeline: {
    margin: { top: 20, right: 30, left: 20, bottom: 20 },
    style: {
      backgroundColor: 'transparent',
    },
    grid: {
      strokeDasharray: '3 3',
      stroke: 'hsl(var(--celestial-aurora) / 0.15)',
      strokeWidth: 1,
    },
    axes: {
      fontSize: 12,
      stroke: 'hsl(var(--muted-foreground))',
      fontFamily: 'Inter, sans-serif',
    },
    line: {
      strokeWidth: 3,
      stroke: 'hsl(var(--celestial-aurora))',
      dot: {
        fill: 'hsl(var(--celestial-aurora))',
        strokeWidth: 2,
        stroke: 'hsl(var(--card))',
        r: 6,
      },
      activeDot: {
        fill: 'hsl(var(--celestial-plasma))',
        strokeWidth: 3,
        stroke: 'hsl(var(--card))',
        r: 8,
      },
    },
  },
  
  radial: {
    margin: { top: 20, right: 30, left: 20, bottom: 20 },
    colors: {
      primary: 'hsl(var(--celestial-aurora))',
      secondary: 'hsl(var(--celestial-plasma))',
      tertiary: 'hsl(var(--celestial-quantum))',
    },
    bar: {
      cornerRadius: 10,
      fill: 'hsl(var(--celestial-aurora))',
    },
  },
  
  bar: {
    margin: { top: 20, right: 30, left: 60, bottom: 20 },
    style: {
      backgroundColor: 'transparent',
    },
    grid: {
      strokeDasharray: '3 3',
      stroke: 'hsl(var(--celestial-aurora) / 0.15)',
    },
    axes: {
      fontSize: 11,
      stroke: 'hsl(var(--muted-foreground))',
      fontFamily: 'Inter, sans-serif',
    },
    bar: {
      fill: 'hsl(var(--celestial-aurora))',
      radius: [0, 4, 4, 0],
    },
  },
  
  pie: {
    margin: { top: 20, right: 30, left: 20, bottom: 20 },
    colors: [
      'hsl(var(--celestial-aurora))',
      'hsl(var(--celestial-plasma))',
      'hsl(var(--celestial-quantum))',
      'hsl(var(--celestial-star))',
      'hsl(var(--celestial-nebula))',
    ],
    label: {
      fontSize: 12,
      fill: 'hsl(var(--foreground))',
      fontFamily: 'Inter, sans-serif',
    },
  },
};

// Data processing utilities for enhanced charts
export const processTimelineData = (entries: DriftLogEntry[]) => {
  return entries.map((entry, index) => ({
    index: index + 1,
    date: new Date(entry.created_at).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    }),
    intensity: entry.creation.conflict_intensity,
    mood: entry.creation.mood_label,
    hz: entry.creation.field.hz,
    phase: entry.creation.bloom_phase,
    petal: entry.creation.bloom_petal,
    constellation: entry.celestium_mapping.constellation,
    status: entry.law_portion.status,
    desire: entry.creation.input_desire,
    fullDate: entry.created_at,
  }));
};

export const processPhaseData = (entries: DriftLogEntry[]) => {
  const phaseMap = new Map<number, { count: number; moods: string[] }>();
  
  entries.forEach(entry => {
    const phase = entry.creation.bloom_phase;
    const existing = phaseMap.get(phase) || { count: 0, moods: [] };
    existing.count++;
    if (!existing.moods.includes(entry.creation.mood_label)) {
      existing.moods.push(entry.creation.mood_label);
    }
    phaseMap.set(phase, existing);
  });
  
  return Array.from(phaseMap.entries())
    .map(([phase, data]) => ({
      phase,
      name: `Phase ${phase}`,
      value: phase * 25, // Convert to percentage for radial chart
      count: data.count,
      moods: data.moods,
      fill: `hsl(var(--drift-${['azure', 'violet', 'golden', 'cosmic'][phase - 1] || 'azure'}))`,
    }))
    .sort((a, b) => a.phase - b.phase);
};

export const processFrequencyData = (entries: DriftLogEntry[]) => {
  const freqMap = new Map<string, { count: number; entries: DriftLogEntry[] }>();
  
  entries.forEach(entry => {
    const hz = entry.creation.field.hz;
    const range = getFrequencyRange(hz);
    const existing = freqMap.get(range) || { count: 0, entries: [] };
    existing.count++;
    existing.entries.push(entry);
    freqMap.set(range, existing);
  });
  
  return Array.from(freqMap.entries())
    .map(([range, data]) => ({
      range,
      count: data.count,
      avgFrequency: data.entries.reduce((sum, e) => sum + e.creation.field.hz, 0) / data.entries.length,
      moods: [...new Set(data.entries.map(e => e.creation.mood_label))],
      fill: getFrequencyColor(range),
    }))
    .sort((a, b) => parseFloat(a.range) - parseFloat(b.range));
};

const getFrequencyRange = (hz: number): string => {
  const base = Math.floor(hz / 100) * 100;
  return `${base}-${base + 99}`;
};

const getFrequencyColor = (range: string): string => {
  const baseHz = parseInt(range.split('-')[0]);
  if (baseHz < 400) return 'hsl(var(--drift-violet))';
  if (baseHz < 500) return 'hsl(var(--drift-azure))';
  if (baseHz < 700) return 'hsl(var(--drift-emerald))';
  if (baseHz < 900) return 'hsl(var(--drift-amber))';
  return 'hsl(var(--drift-cosmic))';
};

export const getEmptyStateMessage = (chartType: string): string => {
  const messages = {
    timeline: 'As this user progresses through their emotional journey, their conflict intensity patterns will be visualized here.',
    frequency: 'Frequency distributions will show the user\'s most visited energetic states once more entries are logged.',
    phase: 'Bloom phase progression will display the user\'s growth trajectory through different emotional stages.',
    status: 'Guardian status monitoring will track the safety and compliance of the user\'s journey.',
    entries: 'Individual drift log entries will appear here as the user documents their emotional experiences.',
  };
  
  return messages[chartType] || 'Data visualization will appear here as the user\'s journey develops.';
};
