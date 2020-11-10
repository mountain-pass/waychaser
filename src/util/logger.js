const debug = require("debug");
const logger = {
  debug: debug("debug"),
  info: debug("info"),
  error: debug("error"),
  browser: debug("browser"),
  remote: debug("remote"),
};

logger.debug.log = console.log.bind(console);
logger.info.log = console.log.bind(console);
logger.error.log = console.log.bind(console);
logger.browser.log = console.log.bind(console);
logger.remote.log = console.log.bind(console);

debug.enable("debug,info,error,browser,remote");

export default logger;
