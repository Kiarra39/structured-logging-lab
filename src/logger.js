const service = 'orders-api';

const createLogger = (context = {}) => {
  const write = (level, msg, fields = {}) => {
    process.stdout.write(`${JSON.stringify({
      ts: new Date().toISOString(),
      level,
      service,
      msg,
      ...context,
      ...fields,
    })}\n`);
  };

  return {
    child: (childContext) => createLogger({ ...context, ...childContext }),
    info: (msg, fields) => write('info', msg, fields),
    warn: (msg, fields) => write('warn', msg, fields),
    error: (msg, fields) => write('error', msg, fields),
  };
};

const logger = createLogger();

module.exports = { logger };
