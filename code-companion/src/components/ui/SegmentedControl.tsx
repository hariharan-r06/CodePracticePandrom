import React from 'react';
import { cn } from '@/lib/utils';

interface SegmentedControlProps {
  options: { label: string; value: string; activeClass?: string }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SegmentedControl({ options, value, onChange, className }: SegmentedControlProps) {
  return (
    <div className={cn('inline-flex rounded-lg bg-muted p-1 gap-1', className)}>
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            'px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200',
            value === opt.value
              ? opt.activeClass || 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
