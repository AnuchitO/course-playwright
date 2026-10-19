export interface LogMeta {
  [key: string]: unknown;
}

export type LogLevel = "debug" | "info" | "warn" | "error";

export interface Logger {
  debug(message: string, meta?: LogMeta): void;
  info(message: string, meta?: LogMeta): void;
  warn(message: string, meta?: LogMeta): void;
  error(message: string, meta?: LogMeta): void;
}

/**
 * Converts an Error into a plain object so it prints its name/message/stack
 * instead of collapsing to "[object Error]" or "{}" once it crosses a
 * console/serialization boundary (e.g. a browser devtools bridge).
 */
function serializeError(error: Error): Record<string, unknown> {
  const cause = (error as { cause?: unknown }).cause;
  return {
    name: error.name,
    message: error.message,
    stack: error.stack,
    ...(cause !== undefined ? { cause: serializeValue(cause) } : {}),
  };
}

function serializeValue(value: unknown): unknown {
  if (value instanceof Error) return serializeError(value);
  if (Array.isArray(value)) return value.map(serializeValue);
  return value;
}

function serializeMeta(meta: LogMeta): LogMeta {
  return Object.fromEntries(
    Object.entries(meta).map(([key, value]) => [key, serializeValue(value)]),
  );
}

function formatPrefix(level: LogLevel): string {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] ${level.toUpperCase().padEnd(5)}`;
}

function write(
  consoleMethod: (...args: unknown[]) => void,
  level: LogLevel,
  message: string,
  meta?: LogMeta,
) {
  const prefixedMessage = `${formatPrefix(level)} ${message}`;
  if (meta && Object.keys(meta).length > 0) {
    consoleMethod(prefixedMessage, serializeMeta(meta));
  } else {
    consoleMethod(prefixedMessage);
  }
}

export const logger: Logger = {
  debug(message, meta) {
    write(console.debug ?? console.log, "debug", message, meta);
  },
  info(message, meta) {
    write(console.log, "info", message, meta);
  },
  warn(message, meta) {
    write(console.warn, "warn", message, meta);
  },
  error(message, meta) {
    write(console.error, "error", message, meta);
  },
};
