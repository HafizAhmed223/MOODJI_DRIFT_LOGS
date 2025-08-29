import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Users, TrendingUp, Clock, Sparkles } from 'lucide-react';

interface DriftLogEntry {
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

interface UserSummary {
  user_id: string;
  latest_entry: DriftLogEntry;
  total_entries: number;
  journey_completion: number;
  latest_mood: string;
  last_activity: string;
  constellation: string;
  status: string;
}

const getMoodColor = (mood: string): string => {
  const moodColors: { [key: string]: string } = {
    'Contemplative': 'drift-azure',
    'Frustrated': 'drift-crimson',
    'Serene': 'drift-golden',
    'Curious': 'drift-violet',
    'Anxious': 'drift-amber',
    'Uncertain': 'drift-emerald',
    'Determined': 'drift-violet',
    'Balanced': 'drift-golden',
    'Vulnerable': 'drift-pearl',
    'Transcendent': 'drift-cosmic',
  };
  return moodColors[mood] || 'drift-azure';
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'complete':
    case 'mastered':
      return <Sparkles className="h-4 w-4 text-drift-golden" />;
    case 'compliant':
    case 'progressing':
      return <TrendingUp className="h-4 w-4 text-drift-azure" />;
    default:
      return <Clock className="h-4 w-4 text-drift-violet" />;
  }
};

export default function Dashboard() {
  const [driftLogs, setDriftLogs] = useState<DriftLogEntry[]>([]);
  const [userSummaries, setUserSummaries] = useState<UserSummary[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/mock_data.json');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const logs = data.resonance_drift_log;

        if (!logs || !Array.isArray(logs)) {
          setLoading(false);
          return;
        }

        setDriftLogs(logs);

        // Process user summaries
        const userMap: { [key: string]: DriftLogEntry[] } = {};
        logs.forEach((log: DriftLogEntry) => {
          if (!userMap[log.user_id]) {
            userMap[log.user_id] = [];
          }
          userMap[log.user_id].push(log);
        });

        const summaries: UserSummary[] = Object.entries(userMap).map(([userId, entries]) => {
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

        setUserSummaries(summaries);
        setLoading(false);
      } catch (error) {
        console.error('Error loading drift log data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredUsers = userSummaries.filter(user =>
    user.user_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.latest_mood.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.constellation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen celestial-gradient flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-celestial-aurora border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-foreground/70">Loading Resonance Drift Logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen celestial-gradient relative">
      {/* Animated star field background */}
      <div className="star-field absolute inset-0"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="border-b border-celestial-aurora/20 bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-celestial-aurora to-celestial-plasma bg-clip-text text-transparent">
                  Moodji Dashboard
                </h1>
                <p className="text-muted-foreground text-lg">
                  Resonance Drift Log Monitoring Console
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search users, moods, or constellations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-80 bg-card/50 border-celestial-aurora/30 focus:border-celestial-aurora"
                  />
                </div>
                <Badge variant="secondary" className="px-4 py-2">
                  <Users className="h-4 w-4 mr-2" />
                  {userSummaries.length} Users
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-8">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-16">
              <div className="mb-4">
                <Users className="h-16 w-16 text-muted-foreground mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No users found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? 'Try adjusting your search terms.' : 'No drift log entries available.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredUsers.map((user) => (
                <Card
                  key={user.user_id}
                  className="drift-card cursor-pointer group relative overflow-hidden"
                  onClick={() => navigate(`/user/${user.user_id}`)}
                >
                  {/* Animated background glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-celestial-aurora/5 to-celestial-plasma/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <CardHeader className="relative z-10 space-y-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold text-foreground group-hover:text-celestial-aurora transition-colors">
                        {user.user_id.replace('user_', 'User ')}
                      </CardTitle>
                      {getStatusIcon(user.status)}
                    </div>
                    
                    <div className="space-y-2">
                      <Badge 
                        className={`bg-${getMoodColor(user.latest_mood)}/20 text-${getMoodColor(user.latest_mood)} border-${getMoodColor(user.latest_mood)}/30 hover:bg-${getMoodColor(user.latest_mood)}/30`}
                      >
                        {user.latest_mood}
                      </Badge>
                      
                      <div className="text-sm text-muted-foreground">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-celestial-star">★</span>
                          <span className="truncate">{user.constellation}</span>
                        </div>
                        <div className="text-xs opacity-75">
                          Last active: {formatDate(user.last_activity)}
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="relative z-10">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Journey Progress</span>
                        <span className="text-celestial-aurora font-medium">
                          {Math.round(user.journey_completion)}%
                        </span>
                      </div>
                      
                      {/* Progress bar */}
                      <div className="w-full bg-celestial-cosmos/30 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-celestial-aurora to-celestial-plasma h-full rounded-full transition-all duration-500 group-hover:from-celestial-plasma group-hover:to-celestial-quantum"
                          style={{ width: `${user.journey_completion}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>{user.total_entries} entries</span>
                        <span className="capitalize">{user.status}</span>
                      </div>
                    </div>
                  </CardContent>
                  
                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 border border-celestial-aurora/0 group-hover:border-celestial-aurora/50 rounded-lg transition-all duration-300 pointer-events-none"></div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
