import chrome from 'selenium-webdriver/chrome';
// eslint-disable-next-line no-unused-vars
import logger from '../../util/logger';
import { WaychaserViaWebdriver } from './waychaser-via-webdriver';

class WaychaserViaWebdriverChrome extends WaychaserViaWebdriver {
  getBrowserOptions() {
    return new chrome.Options();
  }

  setBrowserOptions(builder, options) {
    return builder.forBrowser('chrome').setChromeOptions(options);
  }
}

const instance = new WaychaserViaWebdriverChrome();

export { instance as waychaserViaWebdriverChrome };
