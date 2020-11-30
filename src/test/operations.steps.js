import { expect } from "chai";
import { When, Then } from "cucumber";
import logger from "../util/logger";

Then("the loaded resource will have no operations", async function () {
  const operationsCount = await this.waychaserProxy.getOperationsCount(
    this.result
  );
  expect(operationsCount).to.equal(0);
  const opsCount = await this.waychaserProxy.getOpsCount(this.result);
  expect(opsCount).to.equal(0);
});

Then("the loaded resource will have {int} operation(s)", async function (
  expected
) {
  const operationsCount = await this.waychaserProxy.getOperationsCount(
    this.result
  );
  expect(operationsCount).to.equal(expected);
  const opsCount = await this.waychaserProxy.getOpsCount(this.result);
  expect(opsCount).to.equal(expected);
});

Then("the loaded resource will have {string} operation", async function (
  relationship
) {
  const foundOperation = await this.waychaserProxy.findOneOperationByRel(
    this.result,
    relationship
  );
  expect(foundOperation).to.be.not.null;
  const foundOp = await this.waychaserProxy.findOneOpByRel(
    this.result,
    relationship
  );
  expect(foundOp).to.be.not.null;
});

Then("it won't have a(n) {string} operation", async function (relationship) {
  logger.debug({ relationship });
  const foundOperation = await this.waychaserProxy.findOneOperationByRel(
    this.result,
    relationship
  );
  logger.debug({ foundOperation });
  expect(foundOperation).to.be.null;
  const foundOp = await this.waychaserProxy.findOneOpByRel(
    this.result,
    relationship
  );
  expect(foundOp).to.be.null;
});

When("we successfully invoke the {string} operation", async function (
  relationship
) {
  this.previousResult = this.result;

  this.operationResult = await this.waychaserProxy.invokeOperationByRel(
    this.result,
    relationship
  );
  expect(this.operationResult.success).to.be.true;

  this.opResult = await this.waychaserProxy.invokeOpByRel(
    this.result,
    relationship
  );
  logger.debug("this.opResult", this.opResult);
  expect(this.opResult.success).to.be.true;

  this.result = await this.waychaserProxy.invoke(this.result, relationship);
  expect(this.result.success).to.be.true;
});

When("we invoke the {string} operation", async function (relationship) {
  this.previousResult = this.result;

  this.operationResult = await this.waychaserProxy.invokeOperationByRel(
    this.result,
    relationship
  );

  this.opResult = await this.waychaserProxy.invokeOpByRel(
    this.result,
    relationship
  );

  this.result = await this.waychaserProxy.invoke(this.result, relationship);
});

Then("the same resource will be returned", async function () {
  const operationResultUrl = await this.waychaserProxy.getUrl(
    this.operationResult
  );
  logger.debug({ opResult: this.opResult });
  const opResultUrl = await this.waychaserProxy.getUrl(this.opResult);
  const resultUrl = await this.waychaserProxy.getUrl(this.result);
  const previousResultUrl = await this.waychaserProxy.getUrl(
    this.previousResult
  );
  expect(operationResultUrl).to.deep.equal(previousResultUrl);
  expect(opResultUrl).to.deep.equal(previousResultUrl);
  expect(resultUrl).to.deep.equal(previousResultUrl);
});
