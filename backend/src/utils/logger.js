const colors = {
  reset: "\x1b[0m",
  info: "\x1b[36m", // cyan
  warn: "\x1b[33m", // yellow
  error: "\x1b[31m", // red
  debug: "\x1b[90m"  // gray
};

const formatMessage = (level, message) => {
  const timestamp = new Date().toISOString();
  const color = colors[level] || colors.reset;
  return `[${timestamp}] [${color}${level.toUpperCase()}${colors.reset}]: ${message}`;
};

const logger = {
  info: (msg) => console.log(formatMessage("info", msg)),
  warn: (msg) => console.warn(formatMessage("warn", msg)),
  error: (msg, err) => {
    console.error(formatMessage("error", msg));
    if (err) console.error(err);
  },
  debug: (msg) => {
    if (process.env.NODE_ENV !== "production") {
      console.log(formatMessage("debug", msg));
    }
  }
};

module.exports = logger;
