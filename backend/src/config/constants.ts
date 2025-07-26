export const APP_CONSTANTS = {
  APP_NAME: 'Credit Card Optimizer',
  APP_VERSION: '1.0.0',
  API_VERSION: 'v1',
  DEFAULT_PAGE_SIZE: 50,
  MAX_PAGE_SIZE: 100,
  DEFAULT_CACHE_TTL: 3600, // 1 hour
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  SUPPORTED_DOCUMENT_TYPES: ['application/pdf', 'text/csv'],
};

export const TRANSACTION_CATEGORIES = [
  'Dining',
  'Shopping',
  'Travel',
  'Gas',
  'Groceries',
  'Entertainment',
  'Healthcare',
  'Transportation',
  'Utilities',
  'Insurance',
  'Education',
  'Charity',
  'Other'
] as const;

export const CREDIT_CARD_TYPES = [
  'VISA',
  'Mastercard',
  'American Express',
  'Discover'
] as const;

export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled'
} as const;

export const REWARD_CATEGORIES = {
  CASHBACK: 'cashback',
  POINTS: 'points',
  MILES: 'miles',
  PERCENTAGE: 'percentage'
} as const;

export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  INVALID_TOKEN: 'INVALID_TOKEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED'
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
} as const;

export const SMS_PATTERNS = {
  // Common SMS patterns for different banks
  HDFC: /HDFC Bank: Rs\.(\d+(?:\.\d{2})?) spent on (\w+) at (.+) on (\d{2}\/\d{2}\/\d{4})/,
  SBI: /SBI: Rs\.(\d+(?:\.\d{2})?) spent on (\w+) at (.+) on (\d{2}\/\d{2}\/\d{4})/,
  ICICI: /ICICI Bank: Rs\.(\d+(?:\.\d{2})?) spent on (\w+) at (.+) on (\d{2}\/\d{2}\/\d{4})/,
  AXIS: /Axis Bank: Rs\.(\d+(?:\.\d{2})?) spent on (\w+) at (.+) on (\d{2}\/\d{2}\/\d{4})/,
  // Add more patterns as needed
} as const;

export const JOB_NAMES = {
  SMS_PROCESSING: 'sms-processing',
  REWARD_CALCULATION: 'reward-calculation',
  NOTIFICATION_SENDING: 'notification-sending',
  DATA_SYNC: 'data-sync'
} as const;

export const QUEUE_NAMES = {
  SMS_QUEUE: 'sms-queue',
  REWARDS_QUEUE: 'rewards-queue',
  NOTIFICATION_QUEUE: 'notification-queue',
  SYNC_QUEUE: 'sync-queue'
} as const; 