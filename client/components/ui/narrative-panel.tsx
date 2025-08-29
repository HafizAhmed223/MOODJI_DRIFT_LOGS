import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NarrativePanelProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  iconColor?: string;
  children: React.ReactNode;
  className?: string;
  glowColor?: 'aurora' | 'plasma' | 'quantum' | 'star' | 'nebula';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isEmpty?: boolean;
  emptyMessage?: string;
}

const glowStyles = {
  aurora: 'border-celestial-aurora/30 hover:border-celestial-aurora/60 hover:shadow-[0_0_20px_hsl(var(--celestial-aurora)/0.3)]',
  plasma: 'border-celestial-plasma/30 hover:border-celestial-plasma/60 hover:shadow-[0_0_20px_hsl(var(--celestial-plasma)/0.3)]',
  quantum: 'border-celestial-quantum/30 hover:border-celestial-quantum/60 hover:shadow-[0_0_20px_hsl(var(--celestial-quantum)/0.3)]',
  star: 'border-celestial-star/30 hover:border-celestial-star/60 hover:shadow-[0_0_20px_hsl(var(--celestial-star)/0.3)]',
  nebula: 'border-celestial-nebula/30 hover:border-celestial-nebula/60 hover:shadow-[0_0_20px_hsl(var(--celestial-nebula)/0.3)]',
};

const sizeStyles = {
  sm: 'min-h-[200px]',
  md: 'min-h-[300px]',
  lg: 'min-h-[400px]',
  xl: 'min-h-[500px]',
};

export function NarrativePanel({
  title,
  description,
  icon: Icon,
  iconColor = 'text-celestial-aurora',
  children,
  className,
  glowColor = 'aurora',
  size = 'md',
  isEmpty = false,
  emptyMessage = 'More data will appear here as the user\'s journey progresses.',
}: NarrativePanelProps) {
  return (
    <Card 
      className={cn(
        'drift-card relative group transition-all duration-500',
        'bg-gradient-to-br from-card/95 to-celestial-cosmos/20',
        'border-2 transition-all duration-300',
        glowStyles[glowColor],
        sizeStyles[size],
        className
      )}
    >
      {/* Subtle animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-celestial-aurora/5 via-transparent to-celestial-plasma/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg pointer-events-none" />
      
      <CardHeader className="relative z-10 space-y-3 pb-4">
        <div className="flex items-start gap-3">
          {Icon && (
            <div className="mt-1">
              <Icon className={cn('h-6 w-6', iconColor)} />
            </div>
          )}
          <div className="flex-1 space-y-2">
            <h3 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground/90 leading-relaxed">
              {description}
            </p>
          </div>
        </div>
        
        {/* Decorative divider */}
        <div className="flex items-center gap-3">
          <div className={cn('h-px flex-1 bg-gradient-to-r from-transparent via-celestial-aurora/30 to-transparent')} />
          <div className="w-2 h-2 rounded-full bg-celestial-aurora/50" />
          <div className={cn('h-px flex-1 bg-gradient-to-r from-transparent via-celestial-aurora/30 to-transparent')} />
        </div>
      </CardHeader>

      <CardContent className="relative z-10">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-celestial-cosmos/30 flex items-center justify-center">
              {Icon && <Icon className="h-8 w-8 text-muted-foreground/50" />}
            </div>
            <div className="space-y-2">
              <h4 className="text-lg font-medium text-foreground/70">Awaiting Journey Data</h4>
              <p className="text-sm text-muted-foreground max-w-md">
                {emptyMessage}
              </p>
            </div>
          </div>
        ) : (
          children
        )}
      </CardContent>
      
      {/* Bottom glow effect */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-celestial-aurora/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </Card>
  );
}

export function SectionDivider({ 
  title, 
  subtitle,
  className 
}: { 
  title?: string; 
  subtitle?: string;
  className?: string; 
}) {
  return (
    <div className={cn('relative py-8', className)}>
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-celestial-aurora/30 to-celestial-plasma/30" />
        {title && (
          <div className="text-center space-y-1">
            <h2 className="text-lg font-semibold bg-gradient-to-r from-celestial-aurora to-celestial-plasma bg-clip-text text-transparent">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs text-muted-foreground/70">
                {subtitle}
              </p>
            )}
          </div>
        )}
        <div className="flex-1 h-px bg-gradient-to-r from-celestial-plasma/30 via-celestial-quantum/30 to-transparent" />
      </div>
      
      {/* Constellation accent */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-3 h-3 relative">
          <div className="absolute inset-0 bg-celestial-star/40 rounded-full animate-pulse" />
          <div className="absolute inset-1 bg-celestial-star/80 rounded-full" />
        </div>
      </div>
    </div>
  );
}

// Specialized panels for different content types
export function ChartPanel({
  title,
  description,
  icon,
  children,
  className,
  chartHeight = 320,
  isEmpty = false,
  emptyMessage,
}: Omit<NarrativePanelProps, 'size'> & { chartHeight?: number }) {
  return (
    <NarrativePanel
      title={title}
      description={description}
      icon={icon}
      className={className}
      isEmpty={isEmpty}
      emptyMessage={emptyMessage}
      size="lg"
    >
      <div style={{ height: chartHeight }} className="w-full">
        {children}
      </div>
    </NarrativePanel>
  );
}

export function StatsPanel({
  title,
  description,
  icon,
  children,
  className,
  isEmpty = false,
  emptyMessage,
}: Omit<NarrativePanelProps, 'size'>) {
  return (
    <NarrativePanel
      title={title}
      description={description}
      icon={icon}
      className={className}
      isEmpty={isEmpty}
      emptyMessage={emptyMessage}
      size="sm"
      glowColor="quantum"
    >
      {children}
    </NarrativePanel>
  );
}
