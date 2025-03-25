const isDevelopment = process.env.NODE_ENV === 'development';

type LogLevel = 'log' | 'error' | 'warn' | 'info' | 'debug';

function createLogger(level: LogLevel) {
  return (...args: any[]) => {
    if (isDevelopment) {
      console[level](...args);
    }
  };
}

export const logger = {
  log: createLogger('log'),
  error: createLogger('error'),
  warn: createLogger('warn'),
  info: createLogger('info'),
  debug: createLogger('debug'),
};

// For errors that should always be logged, even in production
export const logError = (error: unknown, context?: string, additionalDetails?: Record<string, unknown>) => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorDetails = error instanceof Error ? {
    name: error.name,
    stack: error.stack,
    cause: error.cause,
    ...additionalDetails,
  } : additionalDetails || {};

  if (isDevelopment) {
    console.error(`[${context || 'ERROR'}]`, errorMessage, errorDetails);
  } else {
    // In production, you might want to send this to your error tracking service
    // For now, we'll just log the basic error info
    console.error(`[${context || 'ERROR'}]`, errorMessage);
  }
}; 