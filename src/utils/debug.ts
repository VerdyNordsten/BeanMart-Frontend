// Comprehensive debugging utility
export class DebugLogger {
  private static instance: DebugLogger;
  private logs: Array<{timestamp: string, level: string, category: string, message: string, data?: any}> = [];
  private isEnabled: boolean = true;

  static getInstance(): DebugLogger {
    if (!DebugLogger.instance) {
      DebugLogger.instance = new DebugLogger();
    }
    return DebugLogger.instance;
  }

  private constructor() {
    // Enable debug in development
    this.isEnabled = import.meta.env.DEV;
  }

  private log(level: string, category: string, message: string, data?: any) {
    if (!this.isEnabled) return;

    const timestamp = new Date().toISOString();
    const logEntry = { timestamp, level, category, message, data };
    
    this.logs.push(logEntry);
    
    // Keep only last 100 logs
    if (this.logs.length > 100) {
      this.logs = this.logs.slice(-100);
    }

    // Console output with styling
    const style = this.getStyle(level);
    console.log(
      `%c[${timestamp}] %c[${level}] %c[${category}] %c${message}`,
      'color: #666; font-size: 11px;',
      style.level,
      'color: #2196F3; font-weight: bold;',
      'color: #333;'
    );
    
    if (data) {
      console.log('%cData:', 'color: #666; font-style: italic;', data);
    }
  }

  private getStyle(level: string): string {
    switch (level) {
      case 'ERROR': return 'color: #F44336; font-weight: bold; background: #FFEBEE; padding: 2px 4px; border-radius: 3px;';
      case 'WARN': return 'color: #FF9800; font-weight: bold; background: #FFF3E0; padding: 2px 4px; border-radius: 3px;';
      case 'INFO': return 'color: #2196F3; font-weight: bold; background: #E3F2FD; padding: 2px 4px; border-radius: 3px;';
      case 'SUCCESS': return 'color: #4CAF50; font-weight: bold; background: #E8F5E8; padding: 2px 4px; border-radius: 3px;';
      case 'DEBUG': return 'color: #9C27B0; font-weight: bold; background: #F3E5F5; padding: 2px 4px; border-radius: 3px;';
      default: return 'color: #666; font-weight: bold;';
    }
  }

  // Public logging methods
  error(category: string, message: string, data?: any) {
    this.log('ERROR', category, message, data);
  }

  warn(category: string, message: string, data?: any) {
    this.log('WARN', category, message, data);
  }

  info(category: string, message: string, data?: any) {
    this.log('INFO', category, message, data);
  }

  success(category: string, message: string, data?: any) {
    this.log('SUCCESS', category, message, data);
  }

  debug(category: string, message: string, data?: any) {
    this.log('DEBUG', category, message, data);
  }

  // Specialized logging methods
  formData(category: string, message: string, data: any) {
    this.log('DEBUG', `FORM-${category}`, message, data);
  }

  apiRequest(method: string, url: string, data?: any) {
    this.log('INFO', 'API-REQUEST', `${method} ${url}`, data);
  }

  apiResponse(status: number, url: string, data?: any) {
    const level = status >= 400 ? 'ERROR' : status >= 300 ? 'WARN' : 'SUCCESS';
    this.log(level, 'API-RESPONSE', `${status} ${url}`, data);
  }

  apiError(error: any, url: string) {
    this.log('ERROR', 'API-ERROR', `Error in ${url}`, {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      stack: error.stack
    });
  }

  // Get all logs
  getLogs() {
    return [...this.logs];
  }

  // Clear logs
  clearLogs() {
    this.logs = [];
  }

  // Export logs as JSON
  exportLogs() {
    return JSON.stringify(this.logs, null, 2);
  }

  // Print summary
  printSummary() {
    const summary = this.logs.reduce((acc, log) => {
      acc[log.level] = (acc[log.level] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log('%c=== DEBUG SUMMARY ===', 'color: #2196F3; font-weight: bold; font-size: 14px;');
    console.table(summary);
    console.log(`Total logs: ${this.logs.length}`);
  }
}

// Export singleton instance
export const debug = DebugLogger.getInstance();

// Convenience functions
export const logForm = (category: string, message: string, data: any) => debug.formData(category, message, data);
export const logApi = (method: string, url: string, data?: any) => debug.apiRequest(method, url, data);
export const logResponse = (status: number, url: string, data?: any) => debug.apiResponse(status, url, data);
export const logError = (error: any, url: string) => debug.apiError(error, url);
export const logSuccess = (category: string, message: string, data?: any) => debug.success(category, message, data);
export const logInfo = (category: string, message: string, data?: any) => debug.info(category, message, data);
export const logWarn = (category: string, message: string, data?: any) => debug.warn(category, message, data);

