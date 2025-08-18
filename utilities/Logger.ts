// Logger.ts
// Lightweight, dependency-free logger for Playwright + TypeScript.
// Usage: const log = new Logger('MySuite', 'debug');  log.info('message');

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LEVELS: LogLevel[] = ['debug', 'info', 'warn', 'error'];
const COLORS: Record<LogLevel, string> = {
  debug: '\x1b[36m', // cyan
  info : '\x1b[32m', // green
  warn : '\x1b[33m', // yellow
  error: '\x1b[31m', // red
};
const RESET = '\x1b[0m';

export class Logger {
  private threshold: number;

  /**
   * @param name  short label shown in every log line (e.g. test suite)
   * @param level minimum level to output (default "info")
   */
  constructor(private name = 'PW', level: LogLevel = 'info') {
    this.threshold = LEVELS.indexOf(level);
  }

  private output(level: LogLevel, args: unknown[]) {
    if (LEVELS.indexOf(level) < this.threshold) return;
    const stamp  = new Date().toISOString();
    const prefix = `${COLORS[level]}[${stamp}] [${this.name}] [${level.toUpperCase()}]${RESET}`;
    // eslint-disable-next-line no-console
    console.log(prefix, ...args);
  }

  debug(...args: unknown[]) { this.output('debug', args); }
  info (...args: unknown[]) { this.output('info',  args); }
  warn (...args: unknown[]) { this.output('warn',  args); }
  error(...args: unknown[]) { this.output('error', args); }
}

