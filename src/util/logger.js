const debug = require("debug");
const logger = {
  debug: debug("debug"),
  info: debug("info"),
  error: debug("error"),
  browser: debug("browser"),
  remote: debug("remote"),
  waychaser: debug("waychaser"),
};

logger.debug.log = console.log.bind(console);
logger.info.log = console.log.bind(console);
logger.error.log = console.log.bind(console);
logger.browser.log = console.log.bind(console);
logger.remote.log = console.log.bind(console);
logger.waychaser.log = console.log.bind(console);

debug.enable("debug,info,error,browser,remote,waychaser");

export default logger;

/*
import getLogger from "webpack-log";
const logger = {
  debug: getLogger({ name: "debug", timestamp: true, level: "debug" }).debug,
  info: getLogger({ name: "info", level: "debug" }).info,
  error: getLogger({ name: "error", level: "debug" }).error,
  browser: getLogger({ name: "browser", level: "debug" }).debug,
  remote: getLogger({ name: "remote", level: "debug" }).debug,
  waychaser: getLogger({ name: "waychaser", level: "debug" }).debug,
};

export default logger; */
