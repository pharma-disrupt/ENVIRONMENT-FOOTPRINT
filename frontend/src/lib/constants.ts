// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    VERIFY: '/auth/verify',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  PROFILE: {
    GET: '/profile',
    UPDATE: '/profile',
    DELETE: '/profile',
  },
  ACTIVITIES: {
    LIST: '/activities',
    CREATE: '/activities',
    GET: (id: string) => `/activities/${id}`,
    UPDATE: (id: string) => `/activities/${id}`,
    DELETE: (id: string) => `/activities/${id}`,
  },
  FOOTPRINT: {
    OVERVIEW: '/footprint',
    BREAKDOWN: '/footprint/breakdown',
    TRENDS: '/footprint/trends',
    HISTORY: '/footprint/history',
  },
  GOALS: {
    LIST: '/goals',
    CREATE: '/goals',
    GET: (id: string) => `/goals/${id}`,
    UPDATE: (id: string) => `/goals/${id}`,
    DELETE: (id: string) => `/goals/${id}`,
  },
  CHALLENGES: {
    LIST: '/challenges',
    ACTIVE: '/challenges/active',
    JOIN: (id: string) => `/challenges/${id}/join`,
    LEAVE: (id: string) => `/challenges/${id}/leave`,
    PROGRESS: (id: string) => `/challenges/${id}/progress`,
  },
  INSIGHTS: {
    LIST: '/insights',
    UNREAD: '/insights/unread',
    MARK_READ: (id: string) => `/insights/${id}/read`,
  },
} as const;

// Activity categories
export const ACTIVITY_CATEGORIES = [
  { id: 'transport', label: 'Transport', icon: 'car' },
  { id: 'energy', label: 'Energy', icon: 'zap' },
  { id: 'food', label: 'Food', icon: 'utensils' },
  { id: 'shopping', label: 'Shopping', icon: 'bag' },
  { id: 'flight', label: 'Flights', icon: 'plane' },
] as const;

// Emission factors reference
export const EMISSION_UNITS = {
  TRANSPORT: {
    CAR: 'km',
    BUS: 'km',
    TRAIN: 'km',
    MOTORCYCLE: 'km',
    FLIGHT: 'km',
  },
  ENERGY: {
    ELECTRICITY: 'kWh',
    GAS: 'kWh',
    OIL: 'liters',
  },
  FOOD: {
    MEAT: 'kg',
    DAIRY: 'kg',
    GRAINS: 'kg',
    PRODUCE: 'kg',
  },
} as const;

// Challenge types
export const CHALLENGE_TYPES = {
  INDIVIDUAL: 'individual',
  COMMUNITY: 'community',
} as const;

// Goal types
export const GOAL_TYPES = {
  REDUCTION: 'reduction',
  ACTIVITY: 'activity',
  CHALLENGE: 'challenge',
} as const;

// Time periods
export const TIME_PERIODS = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
} as const;
