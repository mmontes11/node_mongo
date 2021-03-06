import winston from "../lib/winston";
import config from "../config/index";

const logInfo = message => {
  if (config.debug) {
    winston.info(message);
  }
};

const logError = message => {
  if (config.debug) {
    winston.error(message);
  }
};

export { logInfo, logError };
