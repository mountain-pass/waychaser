import fetch from 'cross-fetch';

class ApiResourceObject {}

const waychaser = {
  async load(url, options) {
    return fetch(url, options).then((response) => {
      if (response.status >= 400) {
        throw new Error('Bad response from server');
      }
      return new ApiResourceObject(response);
    });
  },
};

export { waychaser };
