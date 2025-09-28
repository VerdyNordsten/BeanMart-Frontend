// Centralized logging utility for development and production
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: unknown;
  timestamp: string;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;

  private log(level: LogLevel, message: string, data?: unknown): void {
    if (!this.isDevelopment) {
      return; // Don't log in production
    }

    const entry: LogEntry = {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
    };

    // Use appropriate console method based on level
    switch (level) {
      case 'debug':
        console.debug(`[${entry.timestamp}] ${message}`, data);
        break;
      case 'info':
        console.info(`[${entry.timestamp}] ${message}`, data);
        break;
      case 'warn':
        console.warn(`[${entry.timestamp}] ${message}`, data);
        break;
      case 'error':
        console.error(`[${entry.timestamp}] ${message}`, data);
        break;
    }
  }

  debug(message: string, data?: unknown): void {
    this.log('debug', message, data);
  }

  info(message: string, data?: unknown): void {
    this.log('info', message, data);
  }

  warn(message: string, data?: unknown): void {
    this.log('warn', message, data);
  }

  error(message: string, data?: unknown): void {
    this.log('error', message, data);
  }
}

export const logger = new Logger();
