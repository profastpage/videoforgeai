import { env } from "@/server/env";

type LogLevel = "debug" | "info" | "warn" | "error";

const levelOrder: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

function shouldLog(level: LogLevel) {
  return levelOrder[level] >= levelOrder[env.APP_LOG_LEVEL];
}

export const logger = {
  debug(message: string, meta?: unknown) {
    if (shouldLog("debug")) console.debug(`[debug] ${message}`, meta ?? "");
  },
  info(message: string, meta?: unknown) {
    if (shouldLog("info")) console.info(`[info] ${message}`, meta ?? "");
  },
  warn(message: string, meta?: unknown) {
    if (shouldLog("warn")) console.warn(`[warn] ${message}`, meta ?? "");
  },
  error(message: string, meta?: unknown) {
    if (shouldLog("error")) console.error(`[error] ${message}`, meta ?? "");
  },
};
