import firefox from 'selenium-webdriver/firefox';
// eslint-disable-next-line no-unused-vars
import logger from '../../util/logger';
import { WaychaserViaWebdriver } from './waychaser-via-webdriver';

class WaychaserViaWebdriverFirefox extends WaychaserViaWebdriver {
  getBrowserOptions() {
    return new firefox.Options();
  }

  setBrowserOptions(builder, options) {
    return builder.forBrowser('firefox').setChromeOptions(options);
  }
}

const instance = new WaychaserViaWebdriverFirefox();

export { instance as waychaserViaWebdriverFirefox };
