import safari from 'selenium-webdriver/safari';
// eslint-disable-next-line no-unused-vars
import logger from '../../util/logger';
import { WaychaserViaWebdriverLocal } from './waychaser-via-webdriver-local';

class WaychaserViaWebdriverLocalSafari extends WaychaserViaWebdriverLocal {
  getBrowserOptions() {
    return new safari.Options();
  }

  setBrowserOptions(builder, options) {
    return builder.forBrowser('safari').setSafariOptions(options);
  }

  async getBrowserLogs() {
    // getting logs is not possible wtih safari
    // https://stackoverflow.com/questions/46272218/unable-to-console-logs-from-safari-using-selenium-webdriver-python
  }
}

const instance = new WaychaserViaWebdriverLocalSafari();

export { instance as waychaserViaWebdriverLocalSafari };
