import React from 'react';
import { 
  CheckCircle, AlertCircle, Clock3, Sparkles, TrendingUp, 
  Activity, Shield 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusIconProps {
  status: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5', 
  lg: 'h-6 w-6',
};

const getStatusIconAndColor = (status: string) => {
  const normalizedStatus = status.toLowerCase();
  
  if (normalizedStatus.includes('complete') || 
      normalizedStatus.includes('mastered') ||
      normalizedStatus.includes('fully_validated') ||
      normalizedStatus.includes('excellence_achieved')) {
    return {
      icon: CheckCircle,
      color: 'text-green-400',
      label: 'Completed'
    };
  }
  
  if (normalizedStatus.includes('compliant') ||
      normalizedStatus.includes('progressing') ||
      normalizedStatus.includes('active') ||
      normalizedStatus.includes('validated')) {
    return {
      icon: TrendingUp,
      color: 'text-blue-400',
      label: 'In Progress'
    };
  }
  
  if (normalizedStatus.includes('processing') ||
      normalizedStatus.includes('pending') ||
      normalizedStatus.includes('in_progress')) {
    return {
      icon: Clock3,
      color: 'text-yellow-400',
      label: 'Processing'
    };
  }
  
  if (normalizedStatus.includes('evaluating') ||
      normalizedStatus.includes('preliminary')) {
    return {
      icon: Activity,
      color: 'text-orange-400',
      label: 'Evaluating'
    };
  }
  
  if (normalizedStatus.includes('protective') ||
      normalizedStatus.includes('safety')) {
    return {
      icon: Shield,
      color: 'text-purple-400',
      label: 'Protected'
    };
  }
  
  if (normalizedStatus.includes('elevated') ||
      normalizedStatus.includes('divine')) {
    return {
      icon: Sparkles,
      color: 'text-pink-400',
      label: 'Elevated'
    };
  }
  
  // Default case
  return {
    icon: AlertCircle,
    color: 'text-gray-400',
    label: 'Unknown'
  };
};

export function StatusIcon({ 
  status, 
  className, 
  size = 'md' 
}: StatusIconProps) {
  const { icon: Icon, color } = getStatusIconAndColor(status);
  
  return (
    <Icon 
      className={cn(
        sizeClasses[size],
        color,
        className
      )} 
    />
  );
}

export function StatusBadge({ 
  status, 
  showLabel = true,
  className 
}: { 
  status: string; 
  showLabel?: boolean;
  className?: string;
}) {
  const { icon: Icon, color, label } = getStatusIconAndColor(status);
  
  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-card/50 border",
      "border-celestial-aurora/20 text-sm",
      className
    )}>
      <Icon className={cn("h-4 w-4", color)} />
      {showLabel && (
        <span className="text-muted-foreground capitalize">
          {status.replace('_', ' ')}
        </span>
      )}
    </div>
  );
}

// Export the utility function for use in other components
export { getStatusIconAndColor };
