// Shared types and utilities for Drift Log data processing

export interface DriftLogEntry {
  id: string;
  user_id: string;
  created_at: string;
  final_payload: boolean;
  creation: {
    input_desire: string;
    mood_label: string;
    conflict_intensity: number;
    field: { name: string; hz: number };
    bloom_phase: number;
    bloom_petal: string;
    equation: { formula: string; description: string };
  };
  law_portion: {
    status: string;
    rules_applied: string[];
    contract_scan: string;
  };
  bloom_render: {
    petal: string;
    animation: string;
  };
  celestium_mapping: {
    constellation: string;
  };
  mirror_dna: {
    dna_string: string;
  };
}

export interface UserSummary {
  user_id: string;
  latest_entry: DriftLogEntry;
  total_entries: number;
  journey_completion: number;
  latest_mood: string;
  last_activity: string;
  constellation: string;
  status: string;
}

export interface TimelineDataPoint {
  index: number;
  date: string;
  mood: string;
  phase: number;
  intensity: number;
  hz: number;
  color: string;
}

export interface FrequencyDataPoint {
  range: string;
  count: number;
  fill: string;
}

export interface StatusDataPoint {
  status: string;
  value: number;
  fill: string;
}

// Mood color mapping
export const getMoodColor = (mood: string): string => {
  const moodColors: { [key: string]: string } = {
    'Contemplative': '#60A5FA', // drift-azure
    'Frustrated': '#EF4444',    // drift-crimson  
    'Serene': '#F59E0B',        // drift-golden
    'Curious': '#A855F7',       // drift-violet
    'Anxious': '#F97316',       // drift-amber
    'Uncertain': '#10B981',     // drift-emerald
    'Determined': '#A855F7',    // drift-violet
    'Balanced': '#F59E0B',      // drift-golden
    'Vulnerable': '#D1D5DB',    // drift-pearl
    'Transcendent': '#C084FC',  // drift-cosmic
  };
  return moodColors[mood] || '#60A5FA';
};

// Status completion check
export const isCompletedStatus = (status: string): boolean => {
  const completedStatuses = [
    'complete', 'mastered', 'fully_validated', 'excellence_achieved'
  ];
  return completedStatuses.some(s => status.includes(s));
};

// Data processing utilities
export const processUserSummaries = (logs: DriftLogEntry[]): UserSummary[] => {
  const userMap: { [key: string]: DriftLogEntry[] } = {};
  
  logs.forEach((log) => {
    if (!userMap[log.user_id]) {
      userMap[log.user_id] = [];
    }
    userMap[log.user_id].push(log);
  });

  return Object.entries(userMap).map(([userId, entries]) => {
    // Sort by date to get latest entry
    const sortedEntries = entries.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    const latestEntry = sortedEntries[0];
    
    // Calculate journey completion (entries with final_payload = true)
    const completedEntries = entries.filter(e => e.final_payload).length;
    const journeyCompletion = (completedEntries / entries.length) * 100;

    return {
      user_id: userId,
      latest_entry: latestEntry,
      total_entries: entries.length,
      journey_completion: journeyCompletion,
      latest_mood: latestEntry.creation.mood_label,
      last_activity: latestEntry.created_at,
      constellation: latestEntry.celestium_mapping.constellation,
      status: latestEntry.law_portion.status,
    };
  });
};

export const processTimelineData = (entries: DriftLogEntry[]): TimelineDataPoint[] => {
  return entries.map((entry, index) => ({
    index: index + 1,
    date: new Date(entry.created_at).toLocaleDateString(),
    mood: entry.creation.mood_label,
    phase: entry.creation.bloom_phase,
    intensity: entry.creation.conflict_intensity,
    hz: entry.creation.field.hz,
    color: getMoodColor(entry.creation.mood_label),
  }));
};

export const processFrequencyData = (entries: DriftLogEntry[]): FrequencyDataPoint[] => {
  return entries.reduce((acc: FrequencyDataPoint[], entry) => {
    const hz = Math.floor(entry.creation.field.hz / 100) * 100;
    const range = `${hz}-${hz + 99}Hz`;
    const existing = acc.find(item => item.range === range);
    
    if (existing) {
      existing.count++;
    } else {
      acc.push({
        range,
        count: 1,
        fill: getMoodColor(entry.creation.mood_label),
      });
    }
    return acc;
  }, []);
};

export const processStatusData = (entries: DriftLogEntry[]): StatusDataPoint[] => {
  return entries.reduce((acc: StatusDataPoint[], entry) => {
    const existing = acc.find(item => item.status === entry.law_portion.status);
    if (existing) {
      existing.value++;
    } else {
      acc.push({
        status: entry.law_portion.status,
        value: 1,
        fill: getMoodColor(entry.creation.mood_label),
      });
    }
    return acc;
  }, []);
};

// Date formatting utility
export const formatDate = (dateString: string, options?: {
  includeTime?: boolean;
  includeWeekday?: boolean;
}): string => {
  const date = new Date(dateString);
  const baseOptions: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
  };

  if (options?.includeWeekday) {
    baseOptions.weekday = 'short';
  }

  if (options?.includeTime) {
    baseOptions.hour = '2-digit';
    baseOptions.minute = '2-digit';
  }

  return date.toLocaleDateString('en-US', baseOptions);
};

// Journey completion calculation
export const calculateJourneyCompletion = (entries: DriftLogEntry[]): number => {
  const completedEntries = entries.filter(e => e.final_payload).length;
  return entries.length > 0 ? (completedEntries / entries.length) * 100 : 0;
};

// Load drift log data from API/file
export const loadDriftLogData = async (): Promise<DriftLogEntry[]> => {
  try {
    const response = await fetch('/mock_data.json');
    const data = await response.json();
    return data.resonance_drift_log;
  } catch (error) {
    console.error('Error loading drift log data:', error);
    return [];
  }
};

// Filter entries by user ID
export const getUserEntries = (logs: DriftLogEntry[], userId: string): DriftLogEntry[] => {
  return logs
    .filter(log => log.user_id === userId)
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
};
