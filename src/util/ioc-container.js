class IocContainer {
  constructor() {
    this.services = {};
  }

  service(name, callback) {
    Object.defineProperty(this, name, {
      get: () => {
        // eslint-disable-next-line no-prototype-builtins
        if (!this.services.hasOwnProperty(name)) {
          this.services[name.toString()] = callback(this);
        }

        return this.services[name.toString()];
      },
      configurable: true,
      enumerable: true,
    });

    return this;
  }
}

export default new IocContainer();
