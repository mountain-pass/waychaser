import { expect } from "chai";
import { When, Then } from "cucumber";
import { API_ACCESS_PORT, API_ACCESS_HOST } from "./config";

When("waychaser loads that resource", async function () {
  this.result = await this.waychaserProxy.load(
    `http://${API_ACCESS_HOST}:${API_ACCESS_PORT}/api`
  );
});

When("waychaser loads a resource that's not available", async function () {
  this.result = await this.waychaserProxy.load(
    `http://${API_ACCESS_HOST}:33556/api`
  );
});

Then("it will have loaded successfully", async function () {
  expect(this.result.success).to.be.true;
});

Then("it will NOT have loaded successfully", async function () {
  expect(this.result.success).to.be.false;
});

When("waychaser successfully loads that resource", async function () {
  this.result = await this.waychaserProxy.load(
    `http://${API_ACCESS_HOST}:${API_ACCESS_PORT}/api`
  );
  expect(this.result.success).to.be.true;
});
