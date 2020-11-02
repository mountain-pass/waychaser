import chrome from 'selenium-webdriver/chrome';
// eslint-disable-next-line no-unused-vars
import logger from '../../util/logger';
import { WaychaserViaWebdriverLocal } from './waychaser-via-webdriver-local';

class WaychaserViaWebdriverLocalChrome extends WaychaserViaWebdriverLocal {
  getBrowserOptions() {
    return new chrome.Options();
  }

  setBrowserOptions(builder, options) {
    return builder.forBrowser('chrome').setChromeOptions(options);
  }
}

const instance = new WaychaserViaWebdriverLocalChrome();

export { instance as waychaserViaWebdriverLocalChrome };
