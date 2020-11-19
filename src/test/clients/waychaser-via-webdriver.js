class WaychaserViaWebdriver {
  constructor(manager) {
    this.manager = manager;
  }

  async load(url) {
    return this.manager.driver.executeAsyncScript(
      /* istanbul ignore next: won't work in browser otherwise */
      function () {
        const callback = arguments[arguments.length - 1];
        console.log("in method");
        console.log(window);
        window.waychaser
          .load(arguments[0])
          .then(function (resource) {
            const id = uuidv4();
            window[id] = resource;
            callback({ success: true, id });
          })
          .catch(function (error) {
            const id = uuidv4();
            window[id] = error;
            console.log(window);
            console.log(window.error);
            callback({ success: false, id });
          });
      },
      url
    );
  }

  async getOperationsCount(result) {
    return this.manager.driver.executeAsyncScript(
      /* istanbul ignore next: won't work in browser otherwise */
      function () {
        const callback = arguments[arguments.length - 1];
        const id = arguments[0];
        callback(window[id.toString()].operations.count());
      },
      result.id
    );
  }

  async getOpsCount(result) {
    return this.manager.driver.executeAsyncScript(
      /* istanbul ignore next: won't work in browser otherwise */
      function () {
        const callback = arguments[arguments.length - 1];
        const id = arguments[0];
        callback(window[id.toString()].ops.count());
      },
      result.id
    );
  }

  async findOneOperationByRel(result, relationship) {
    return this.manager.driver.executeAsyncScript(
      /* istanbul ignore next: won't work in browser otherwise */
      function () {
        const callback = arguments[arguments.length - 1];
        const id = arguments[0];
        const relationship = arguments[1];
        console.log(relationship);
        console.log(relationship === "self");
        console.log(window[id.toString()].operations.count());
        console.log(
          "collection",
          JSON.stringify(window[id.toString()].operations)
        );
        console.log(
          "findOne",
          JSON.stringify(window[id.toString()].operations.findOne())
        );
        console.log(
          "findOneByRel",
          JSON.stringify(
            window[id.toString()].operations.findOneByRel(relationship)
          )
        );
        callback(window[id.toString()].operations.findOneByRel(relationship));
      },
      result.id,
      relationship
    );
  }

  async findOneOpByRel(result, relationship) {
    return this.manager.driver.executeAsyncScript(
      /* istanbul ignore next: won't work in browser otherwise */
      function () {
        const callback = arguments[arguments.length - 1];
        const id = arguments[0];
        const relationship = arguments[1];
        console.log(relationship);
        console.log(relationship === "self");
        console.log(window[id.toString()].ops.count());
        console.log("collection", JSON.stringify(window[id.toString()].ops));
        console.log(
          "findOne",
          JSON.stringify(window[id.toString()].ops.findOne())
        );
        console.log(
          "findOneByRel",
          JSON.stringify(window[id.toString()].ops.findOneByRel(relationship))
        );
        callback(window[id.toString()].ops.findOneByRel(relationship));
      },
      result.id,
      relationship
    );
  }

  async invokeOperationByRel(result, relationship) {
    return this.manager.driver.executeAsyncScript(
      /* istanbul ignore next: won't work in browser otherwise */
      function () {
        const callback = arguments[arguments.length - 1];
        const id = arguments[0];
        const relationship = arguments[1];
        window[id.toString()].operations
          .invokeByRel(relationship)
          .then(function (resource) {
            const id = uuidv4();
            window[id] = resource;
            callback({ success: true, id });
          })
          .catch(function (error) {
            const id = uuidv4();
            window[id] = error;
            console.log(window);
            console.log(window.error);
            callback({ success: false, id });
          });
      },
      result.id,
      relationship
    );
  }

  async invokeOpByRel(result, relationship) {
    return this.manager.driver.executeAsyncScript(
      /* istanbul ignore next: won't work in browser otherwise */
      function () {
        const callback = arguments[arguments.length - 1];
        const id = arguments[0];
        const relationship = arguments[1];
        window[id.toString()].ops
          .invokeByRel(relationship)
          .then(function (resource) {
            const id = uuidv4();
            window[id] = resource;
            callback({ success: true, id });
          })
          .catch(function (error) {
            const id = uuidv4();
            window[id] = error;
            console.log(window);
            console.log(window.error);
            callback({ success: false, id });
          });
      },
      result.id,
      relationship
    );
  }

  async invokeByRel(result, relationship) {
    return this.manager.driver.executeAsyncScript(
      /* istanbul ignore next: won't work in browser otherwise */
      function () {
        const callback = arguments[arguments.length - 1];
        const id = arguments[0];
        const relationship = arguments[1];
        window[id.toString()]
          .invokeByRel(relationship)
          .then(function (resource) {
            const id = uuidv4();
            window[id] = resource;
            callback({ success: true, id });
          })
          .catch(function (error) {
            const id = uuidv4();
            window[id] = error;
            console.log(window);
            console.log(window.error);
            callback({ success: false, id });
          });
      },
      result.id,
      relationship
    );
  }

  async getUrl(result) {
    return this.manager.driver.executeAsyncScript(
      /* istanbul ignore next: won't work in browser otherwise */
      function () {
        const callback = arguments[arguments.length - 1];
        const id = arguments[0];
        callback(window[id.toString()].url);
      },
      result.id
    );
  }
}

export { WaychaserViaWebdriver };
