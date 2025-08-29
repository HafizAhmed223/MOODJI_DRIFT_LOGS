import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { NarrativePanel, ChartPanel, StatsPanel, SectionDivider } from '@/components/ui/narrative-panel';
import { StatusIcon } from '@/components/ui/status-icon';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadialBarChart, RadialBar, BarChart, Bar, Cell, PieChart, Pie, Legend
} from 'recharts';
import {
  ArrowLeft, Clock, Zap, Shield, Star, TrendingUp, Activity,
  Heart, Brain, Sparkles, Calendar, BarChart3, Users
} from 'lucide-react';
import { 
  DriftLogEntry, 
  getMoodColor, 
  formatDate 
} from '@/lib/drift-data';
import { 
  CustomTooltip, 
  chartConfigs, 
  processTimelineData,
  processPhaseData,
  processFrequencyData,
  getEmptyStateMessage
} from '@/lib/chart-utils';

export default function UserProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [userEntries, setUserEntries] = useState<DriftLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState<DriftLogEntry | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const response = await fetch('/mock_data.json');
        const data = await response.json();
        const logs = data.resonance_drift_log;
        
        const entries = logs
          .filter((log: DriftLogEntry) => log.user_id === id)
          .sort((a: DriftLogEntry, b: DriftLogEntry) => 
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        
        setUserEntries(entries);
        if (entries.length > 0) {
          setSelectedEntry(entries[entries.length - 1]); // Latest entry by default
        }
        setLoading(false);
      } catch (error) {
        console.error('Error loading user data:', error);
        setLoading(false);
      }
    };

    if (id) {
      loadUserData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen celestial-gradient flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-celestial-aurora border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-foreground/70">Loading User Starmap...</p>
        </div>
      </div>
    );
  }

  if (userEntries.length === 0) {
    return (
      <div className="min-h-screen celestial-gradient flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-20 h-20 rounded-full bg-celestial-cosmos/30 flex items-center justify-center mx-auto">
            <Users className="h-10 w-10 text-muted-foreground/50" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">User Journey Not Found</h2>
            <p className="text-muted-foreground">
              No drift log entries found for this user. Their cosmic journey may not have begun yet.
            </p>
          </div>
          <Button onClick={() => navigate('/')} className="mt-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Process data for charts
  const timelineData = processTimelineData(userEntries);
  const phaseData = processPhaseData(userEntries);
  const frequencyData = processFrequencyData(userEntries);
  
  // Calculate journey statistics
  const latestEntry = userEntries[userEntries.length - 1];
  const completedEntries = userEntries.filter(e => e.final_payload).length;
  const journeyCompletion = (completedEntries / userEntries.length) * 100;
  const avgIntensity = userEntries.reduce((sum, e) => sum + e.creation.conflict_intensity, 0) / userEntries.length;
  const uniqueMoods = new Set(userEntries.map(e => e.creation.mood_label)).size;
  const avgFrequency = userEntries.reduce((sum, e) => sum + e.creation.field.hz, 0) / userEntries.length;

  // Status distribution for Guardian Center
  const statusCounts = userEntries.reduce((acc: { [key: string]: number }, entry) => {
    acc[entry.law_portion.status] = (acc[entry.law_portion.status] || 0) + 1;
    return acc;
  }, {});

  const journeyDuration = userEntries.length > 1 ? 
    Math.ceil((new Date(latestEntry.created_at).getTime() - new Date(userEntries[0].created_at).getTime()) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <div className="min-h-screen celestial-gradient relative">
      <div className="star-field absolute inset-0"></div>
      
      <div className="relative z-10">
        {/* Enhanced Header */}
        <div className="border-b border-celestial-aurora/20 bg-card/30 backdrop-blur-md">
          <div className="container mx-auto px-6 py-8">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/')}
                  className="hover:bg-celestial-aurora/10 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
                <Separator orientation="vertical" className="h-6" />
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-celestial-aurora via-celestial-plasma to-celestial-quantum bg-clip-text text-transparent">
                    {id?.replace('user_', 'User ')} Starmap
                  </h1>
                  <p className="text-muted-foreground text-lg">
                    Personal Journey Visualization • {userEntries.length} Drift Log {userEntries.length === 1 ? 'Entry' : 'Entries'}
                  </p>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="flex flex-wrap gap-4 lg:ml-auto">
                <Badge variant="secondary" className="px-3 py-1">
                  <Star className="h-4 w-4 mr-2" />
                  {latestEntry.celestium_mapping.constellation}
                </Badge>
                <Badge 
                  style={{ backgroundColor: getMoodColor(latestEntry.creation.mood_label) + '20' }}
                  className="px-3 py-1"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  {latestEntry.creation.mood_label}
                </Badge>
                <Badge variant="outline" className="px-3 py-1">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  {Math.round(journeyCompletion)}% Complete
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-8">
          {/* Journey Overview Section */}
          <div className="mb-8">
            <SectionDivider 
              title="Journey Overview"
              subtitle="A comprehensive view of the emotional landscape"
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-8">
              <StatsPanel
                title="Journey Metrics"
                description="Key statistics about this user's emotional journey progress."
                icon={BarChart3}
                glowColor="aurora"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Duration</span>
                    <span className="font-medium">{journeyDuration} days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Avg. Intensity</span>
                    <span className="font-medium">{(avgIntensity * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Mood Diversity</span>
                    <span className="font-medium">{uniqueMoods} states</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Avg. Frequency</span>
                    <span className="font-medium">{avgFrequency.toFixed(1)} Hz</span>
                  </div>
                </div>
              </StatsPanel>
              
              <div className="lg:col-span-3">
                <ChartPanel
                  title="Emotional Intensity Over Time"
                  description="This timeline visualizes how emotional conflict intensity fluctuates throughout the user's journey, revealing patterns and growth."
                  icon={Calendar}
                  glowColor="aurora"
                  chartHeight={280}
                  isEmpty={timelineData.length === 0}
                  emptyMessage={getEmptyStateMessage('timeline')}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={timelineData} margin={chartConfigs.timeline.margin}>
                      <CartesianGrid {...chartConfigs.timeline.grid} />
                      <XAxis 
                        dataKey="date" 
                        {...chartConfigs.timeline.axes}
                        tick={{ fontSize: 11 }}
                      />
                      <YAxis 
                        {...chartConfigs.timeline.axes}
                        tick={{ fontSize: 11 }}
                        label={{ 
                          value: 'Conflict Intensity', 
                          angle: -90, 
                          position: 'insideLeft',
                          style: { textAnchor: 'middle', fontSize: '12px' }
                        }}
                      />
                      <Tooltip 
                        content={<CustomTooltip type="timeline" />}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="intensity" 
                        {...chartConfigs.timeline.line}
                        activeDot={chartConfigs.timeline.line.activeDot}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartPanel>
              </div>
            </div>
          </div>

          {/* Emotional Resonance Section */}
          <div className="mb-8">
            <SectionDivider 
              title="Emotional Resonance"
              subtitle="Understanding the depth and frequency of emotional states"
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
              <ChartPanel
                title="Bloom Phase Progression"
                description="This spiral visualization shows the user's advancement through different emotional growth phases, illustrating their journey toward completion."
                icon={Zap}
                glowColor="plasma"
                chartHeight={320}
                isEmpty={phaseData.length === 0}
                emptyMessage={getEmptyStateMessage('phase')}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart 
                    cx="50%" 
                    cy="50%" 
                    innerRadius="30%" 
                    outerRadius="85%" 
                    data={phaseData}
                    margin={chartConfigs.radial.margin}
                  >
                    <RadialBar 
                      dataKey="value" 
                      cornerRadius={chartConfigs.radial.bar.cornerRadius}
                      fill="hsl(var(--celestial-aurora))"
                    />
                    <Tooltip 
                      content={<CustomTooltip type="phase" />}
                    />
                    <Legend 
                      wrapperStyle={{ fontSize: '12px' }}
                      iconType="circle"
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
              </ChartPanel>

              <ChartPanel
                title="Frequency Distribution"
                description="This chart reveals the user's most frequently visited energetic states (Hz), showing their preferred emotional resonance patterns."
                icon={Activity}
                glowColor="quantum"
                chartHeight={320}
                isEmpty={frequencyData.length === 0}
                emptyMessage={getEmptyStateMessage('frequency')}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={frequencyData} 
                    layout="horizontal"
                    margin={chartConfigs.bar.margin}
                  >
                    <CartesianGrid {...chartConfigs.bar.grid} />
                    <XAxis 
                      type="number"
                      {...chartConfigs.bar.axes}
                      label={{ 
                        value: 'Entry Count', 
                        position: 'insideBottom', 
                        offset: -10,
                        style: { fontSize: '12px' }
                      }}
                    />
                    <YAxis 
                      type="category"
                      dataKey="range"
                      {...chartConfigs.bar.axes}
                      width={80}
                      label={{ 
                        value: 'Frequency Range (Hz)', 
                        angle: -90, 
                        position: 'insideLeft',
                        style: { textAnchor: 'middle', fontSize: '12px' }
                      }}
                    />
                    <Tooltip 
                      content={<CustomTooltip type="frequency" />}
                    />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                      {frequencyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartPanel>
            </div>
          </div>

          {/* Guardian Center Section */}
          <div className="mb-8">
            <SectionDivider 
              title="Guardian Center"
              subtitle="Safety monitoring and journey compliance oversight"
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
              <StatsPanel
                title="Status Overview"
                description="Real-time monitoring of the user's journey safety protocols and compliance status."
                icon={Shield}
                glowColor="nebula"
              >
                <div className="space-y-4">
                  {Object.entries(statusCounts).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <StatusIcon status={status} size="sm" />
                        <span className="text-sm font-medium capitalize">
                          {status.replace('_', ' ')}
                        </span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {count}
                      </Badge>
                    </div>
                  ))}
                  
                  <Separator className="my-4" />
                  
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold text-celestial-aurora">
                      {Math.round(journeyCompletion)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Journey Completion</div>
                    <div className="w-full bg-celestial-cosmos/30 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-celestial-aurora to-celestial-plasma h-full rounded-full transition-all duration-500"
                        style={{ width: `${journeyCompletion}%` }}
                      />
                    </div>
                  </div>
                </div>
              </StatsPanel>

              <div className="lg:col-span-2">
                <NarrativePanel
                  title="Latest Entry Spotlight"
                  description="Detailed view of the user's most recent drift log entry, showcasing their current emotional state and progress."
                  icon={Sparkles}
                  glowColor="star"
                  size="md"
                >
                  {selectedEntry && (
                    <div className="space-y-6">
                      <div className="flex flex-wrap gap-3">
                        <Badge 
                          style={{ backgroundColor: getMoodColor(selectedEntry.creation.mood_label) + '30' }}
                          className="px-3 py-1"
                        >
                          {selectedEntry.creation.mood_label}
                        </Badge>
                        <Badge variant="outline" className="px-3 py-1">
                          Phase {selectedEntry.creation.bloom_phase}
                        </Badge>
                        <Badge variant="secondary" className="px-3 py-1">
                          {selectedEntry.creation.field.hz} Hz
                        </Badge>
                        {selectedEntry.final_payload && (
                          <Badge className="px-3 py-1 bg-celestial-golden/20 text-celestial-golden border-celestial-golden/30">
                            Final Entry
                          </Badge>
                        )}
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-2">User's Desire</h4>
                          <p className="text-foreground leading-relaxed">
                            "{selectedEntry.creation.input_desire}"
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Constellation:</span>
                            <div className="font-medium text-celestial-star">
                              {selectedEntry.celestium_mapping.constellation}
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Bloom Petal:</span>
                            <div className="font-medium text-celestial-plasma">
                              {selectedEntry.creation.bloom_petal}
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Field Name:</span>
                            <div className="font-medium text-celestial-quantum">
                              {selectedEntry.creation.field.name}
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Created:</span>
                            <div className="font-medium">
                              {formatDate(selectedEntry.created_at, { includeTime: true, includeWeekday: true })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </NarrativePanel>
              </div>
            </div>
          </div>

          {/* Journey Timeline Section */}
          <div>
            <SectionDivider 
              title="Complete Journey Timeline"
              subtitle="Chronological narrative of the user's emotional evolution"
            />
            
            <NarrativePanel
              title="Drift Log Entries"
              description="A detailed chronological view of all entries in this user's emotional journey, showing the progression and evolution of their inner state."
              icon={Clock}
              glowColor="aurora"
              size="lg"
              className="mt-8"
              isEmpty={userEntries.length === 0}
              emptyMessage={getEmptyStateMessage('entries')}
            >
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {userEntries.map((entry, index) => (
                  <div 
                    key={entry.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                      selectedEntry?.id === entry.id 
                        ? 'border-celestial-aurora bg-celestial-aurora/5 shadow-md' 
                        : 'border-celestial-aurora/20 hover:border-celestial-aurora/40 hover:bg-celestial-aurora/5'
                    }`}
                    onClick={() => setSelectedEntry(entry)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-sm font-medium text-celestial-aurora">
                            Entry {index + 1}
                          </span>
                          <Badge 
                            style={{ backgroundColor: getMoodColor(entry.creation.mood_label) + '30' }}
                            className="text-xs"
                          >
                            {entry.creation.mood_label}
                          </Badge>
                          <StatusIcon status={entry.law_portion.status} size="sm" />
                          {entry.final_payload && (
                            <Badge variant="default" className="text-xs bg-celestial-golden/20 text-celestial-golden">
                              Final
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-foreground font-medium mb-2">
                          "{entry.creation.input_desire}"
                        </p>
                        
                        <div className="flex items-center gap-6 text-xs text-muted-foreground">
                          <span>Phase {entry.creation.bloom_phase}</span>
                          <span>{entry.creation.field.hz} Hz</span>
                          <span>{entry.celestium_mapping.constellation}</span>
                          <span>{entry.creation.bloom_petal}</span>
                        </div>
                      </div>
                      
                      <div className="text-xs text-muted-foreground text-right">
                        {formatDate(entry.created_at, { includeTime: true, includeWeekday: true })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </NarrativePanel>
          </div>
        </div>
      </div>
    </div>
  );
}
