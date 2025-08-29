import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChartContainerProps {
  title: string;
  icon?: LucideIcon;
  iconColor?: string;
  children: React.ReactNode;
  className?: string;
  height?: string | number;
  description?: string;
  actions?: React.ReactNode;
}

export function ChartContainer({
  title,
  icon: Icon,
  iconColor = 'text-celestial-aurora',
  children,
  className,
  height = '320px',
  description,
  actions,
}: ChartContainerProps) {
  return (
    <Card className={cn('drift-card', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2 text-lg">
            {Icon && <Icon className={cn('h-5 w-5', iconColor)} />}
            {title}
          </CardTitle>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </CardHeader>
      <CardContent>
        <div style={{ height }} className="w-full">
          {children}
        </div>
      </CardContent>
    </Card>
  );
}

// Predefined chart tooltip styles for consistency
export const chartTooltipStyle = {
  backgroundColor: 'hsl(var(--card))',
  border: '1px solid hsl(var(--celestial-aurora) / 0.3)',
  borderRadius: '8px',
  boxShadow: '0 4px 12px hsl(var(--celestial-void) / 0.15)',
};

// Common chart colors for consistency
export const chartColors = {
  primary: 'hsl(var(--celestial-aurora))',
  secondary: 'hsl(var(--celestial-plasma))',
  tertiary: 'hsl(var(--celestial-quantum))',
  accent: 'hsl(var(--celestial-star))',
  muted: 'hsl(var(--muted-foreground))',
  grid: 'hsl(var(--celestial-aurora) / 0.1)',
};

// Chart axis styling
export const chartAxisStyle = {
  stroke: 'hsl(var(--muted-foreground))',
  fontSize: 12,
};

// Common chart grid styling
export const chartGridStyle = {
  strokeDasharray: '3 3',
  stroke: chartColors.grid,
};
