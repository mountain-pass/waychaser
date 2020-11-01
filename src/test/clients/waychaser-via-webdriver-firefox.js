import firefox from 'selenium-webdriver/firefox';
// eslint-disable-next-line no-unused-vars
import logger from '../../util/logger';
import { WaychaserViaWebdriverLocal } from './waychaser-via-webdriver-local';

class WaychaserViaWebdriverFirefox extends WaychaserViaWebdriverLocal {
  getBrowserOptions() {
    return new firefox.Options();
  }

  setBrowserOptions(builder, options) {
    return builder.forBrowser('firefox').setChromeOptions(options);
  }

  async getBrowserLogs() {
    // getting logs is not possible with firefox
  }
}

const instance = new WaychaserViaWebdriverFirefox();

export { instance as waychaserViaWebdriverFirefox };
