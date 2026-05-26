
function getCallerLocation() {
  const stack = new Error().stack?.split("\n")[3]; // уровень глубже
  const match = stack?.match(/\((.*):(\d+):(\d+)\)/);
  if (match) {
    const [, file, line, col] = match;
    return `${file}:${line}`;
  }
  return "unknown";
}

export const logger = {
  log: (...args: unknown[]) => {
    console.log("\n", ...args, "\n",`[${getCallerLocation()}]`, "\n");
  },
  info: (...args: unknown[]) => console.log('[INFO]', ...args),
  warn: (...args: unknown[]) => console.warn('[WARN]', ...args),
  error: (...args: unknown[]) => console.error('[ERROR]', ...args)
};

export default logger;

