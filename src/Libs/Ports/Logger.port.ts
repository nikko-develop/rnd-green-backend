export interface LoggerPort {
  debug(message: string, ...meta: unknown[]): void;
  error(message: string, trace?: unknown, ...meta: unknown[]): void;
  log(message: string, ...meta: unknown[]): void;
  warn(message: string, ...meta: unknown[]): void;
}
