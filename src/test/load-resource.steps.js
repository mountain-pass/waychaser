import { expect } from "chai";
import { When, Then, Before } from "cucumber";
import logger from "../util/logger";
import { API_ACCESS_PORT, API_ACCESS_HOST } from "./config";

When("waychaser loads that resource", async function () {
  await this.loadCurrentResource();
});

When("waychaser loads a resource that's not available", async function () {
  await this.loadResourceByUrl(`http://${API_ACCESS_HOST}:33556/api`);
});

Then("it will have loaded successfully", async function () {
  expect(this.result.success).to.be.true;
});

Then("it will NOT have loaded successfully", async function () {
  expect(this.result.success).to.be.false;
});

When("waychaser successfully loads that resource", async function () {
  await this.loadCurrentResource();
  expect(this.result.success).to.be.true;
});

When("waychaser successfully loads the latter resource", async function () {
  await this.loadCurrentResource();
  expect(this.result.success).to.be.true;
});

Before(async function () {
  this.loadCurrentResource = async function () {
    return this.loadResourceByPath(this.currentResourceRoute);
  };

  this.loadResourceByPath = async function (path) {
    return this.loadResourceByUrl(
      `http://${API_ACCESS_HOST}:${API_ACCESS_PORT}${path}`
    );
  };

  this.loadResourceByUrl = async function (url) {
    logger.debug(`loading ${url}`);
    this.result = await this.waychaserProxy.load(url);
  };
});
