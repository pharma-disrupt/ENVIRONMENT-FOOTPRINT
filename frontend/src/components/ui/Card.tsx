import React from 'react';
import { cn } from '@lib/utils';

interface CardProps {
  className?: string;
  children: React.ReactNode;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  className,
  children,
  title,
  description,
  action,
  padding = 'md',
  hoverable = false,
}) => {
  const baseStyles = 'bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden';
  const hoverStyles = hoverable ? 'hover:shadow-md transition-shadow cursor-pointer' : '';
  
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div className={cn(baseStyles, hoverStyles, className)}>
      {(title || description || action) && (
        <div className={cn('px-6 py-4 border-b border-gray-100 flex items-center justify-between', title ? '' : 'pb-2')}>
          <div className="flex-1">
            {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
            {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
          </div>
          {action && <div className="ml-4">{action}</div>}
        </div>
      )}
      <div className={paddings[padding]}>{children}</div>
    </div>
  );
};

// Sub-components for more complex cards
export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => <div className={cn('px-6 py-4 border-b border-gray-100', className)}>{children}</div>;

export const CardContent: React.FC<{ children: React.ReactNode; className?: string; padding?: string }> = ({
  children,
  className,
  padding = 'p-6',
}) => <div className={cn(padding, className)}>{children}</div>;

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => <div className={cn('px-6 py-4 border-t border-gray-100 bg-gray-50', className)}>{children}</div>;
