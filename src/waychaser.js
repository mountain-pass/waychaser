import fetch from "isomorphic-fetch";
require("es6-promise").polyfill();

class ApiResourceObject {
  constructor(response) {
    this.response = response;
  }
}

/** @namespace */
const waychaser = {
  /**
   * Loads an API
   *
   * @param {string} url - the URL of the API to load
   * @param {object} options - options to pass to fetch
   *
   * @returns {ApiResourceObject} a ApiResourceObject representing the loaded resource
   *
   * @throws {Error} If the server returns with a status >= 400
   */
  load: async function (url, options) {
    return fetch(url, options).then((response) => {
      console.log("waychaser:response", response);
      if (response.status >= 400) {
        throw new Error("Bad response from server", response);
      }

      return new ApiResourceObject(response);
    });
  },
};

export { waychaser };
