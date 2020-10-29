import chrome from 'selenium-webdriver/chrome';
// eslint-disable-next-line no-unused-vars
import logger from '../../util/logger';
import { WaychaserViaWebdriverLocal } from './waychaser-via-webdriver-local';

class WaychaserViaWebdriverChrome extends WaychaserViaWebdriverLocal {
  getBrowserOptions() {
    return new chrome.Options();
  }

  setBrowserOptions(builder, options) {
    return builder.forBrowser('chrome').setChromeOptions(options);
  }
}

const instance = new WaychaserViaWebdriverChrome();

export { instance as waychaserViaWebdriverChrome };
