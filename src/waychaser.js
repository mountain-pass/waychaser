require('es6-promise').polyfill();
import fetch from 'isomorphic-fetch';

class ApiResourceObject {
  constructor(response) {
    this.response = response;
  }
}

const waychaser = {
  async load(url, options) {
    return fetch(url, options).then((response) => {
      console.log('waychaser:response', response);
      if (response.status >= 400) {
        throw new Error('Bad response from server', response);
      }

      return new ApiResourceObject(response);
    });
  },
};

export { waychaser };
