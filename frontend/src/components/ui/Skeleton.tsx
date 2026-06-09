import React from 'react';
import { cn } from '@lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'text',
  width,
  height,
}) => {
  const variants = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-lg',
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'string' ? width : `${width}px`;
  if (height) style.height = typeof height === 'string' ? height : `${height}px`;

  return (
    <div
      className={cn(
        'animate-pulse bg-gray-200',
        variants[variant],
        className
      )}
      style={style}
    />
  );
};

// Pre-built skeleton components for common patterns
export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({
  lines = 1,
  className,
}) => (
  <div className={cn('space-y-2', className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton key={i} variant="text" height="1rem" className={i === lines - 1 ? 'w-3/4' : 'w-full'} />
    ))}
  </div>
);

export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('p-6 border border-gray-100 rounded-xl', className)}>
    <Skeleton variant="circular" width={48} height={48} className="mb-4" />
    <SkeletonText lines={3} />
  </div>
);

export const SkeletonAvatar: React.FC<{ size?: number; className?: string }> = ({
  size = 40,
  className,
}) => (
  <Skeleton variant="circular" width={size} height={size} className={className} />
);
