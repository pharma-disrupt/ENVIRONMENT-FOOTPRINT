import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with clsx for conditional classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number with locale-specific separators
 */
export function formatNumber(num: number, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options,
  }).format(num);
}

/**
 * Format carbon emissions (kg CO2e)
 */
export function formatEmissions(kg: number): string {
  if (kg >= 1000) {
    return `${formatNumber(kg / 1000, { maximumFractionDigits: 2 })} tonnes`;
  }
  return `${formatNumber(kg)} kg`;
}

/**
 * Format date to readable string
 */
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  });
}

/**
 * Calculate percentage change between two values
 */
export function calculatePercentChange(oldValue: number, newValue: number): number {
  if (oldValue === 0) return 0;
  return ((newValue - oldValue) / oldValue) * 100;
}

/**
 * Get current streak from dates
 */
export function calculateStreak(dates: string[]): number {
  if (dates.length === 0) return 0;

  const sortedDates = dates.map((d) => new Date(d).getTime()).sort((a, b) => b - a);
  const oneDay = 24 * 60 * 60 * 1000;
  let streak = 1;

  for (let i = 0; i < sortedDates.length - 1; i++) {
    const diff = sortedDates[i] - sortedDates[i + 1];
    if (diff <= oneDay) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
