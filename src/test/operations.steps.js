import { assert, expect } from "chai";
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
  await expectFindOne.bind(this)(relationship, assert.isNotNull);
});

Then("it won't have a(n) {string} operation", async function (relationship) {
  await expectFindOne.bind(this)(relationship, assert.isNull);
});

When("we successfully invoke the {string} operation", async function (
  relationship
) {
  this.previousResult = this.result;

  this.operationResult = await this.waychaserProxy.invokeOperation(
    this.result,
    relationship
  );
  expect(this.operationResult.success).to.be.true;

  this.operationResultLokiStyle = await this.waychaserProxy.invokeOperation(
    this.result,
    { rel: relationship }
  );
  expect(this.operationResultLokiStyle.success).to.be.true;

  this.opResult = await this.waychaserProxy.invokeOp(this.result, relationship);
  logger.debug("this.opResult", this.opResult);
  expect(this.opResult.success).to.be.true;

  this.opResultLokiStyle = await this.waychaserProxy.invokeOp(this.result, {
    rel: relationship,
  });
  expect(this.opResultLokiStyle.success).to.be.true;

  this.result = await this.waychaserProxy.invoke(this.result, relationship);
  expect(this.result.success).to.be.true;

  this.resultLokiStyle = await this.waychaserProxy.invoke(this.result, {
    rel: relationship,
  });
  expect(this.resultLokiStyle.success).to.be.true;
});

When("we invoke the {string} operation", async function (relationship) {
  this.previousResult = this.result;

  this.operationResult = await this.waychaserProxy.invokeOperation(
    this.previousResult,
    relationship
  );

  this.operationResultLokiStyle = await this.waychaserProxy.invokeOperation(
    this.previousResult,
    { rel: relationship }
  );

  this.opResult = await this.waychaserProxy.invokeOp(
    this.previousResult,
    relationship
  );

  this.opResultLokiStyle = await this.waychaserProxy.invokeOp(
    this.previousResult,
    {
      rel: relationship,
    }
  );

  this.result = await this.waychaserProxy.invoke(
    this.previousResult,
    relationship
  );

  this.resultLokiStyle = await this.waychaserProxy.invoke(this.previousResult, {
    rel: relationship,
  });
});

Then("the same resource will be returned", async function () {
  const previousResultUrl = await this.waychaserProxy.getUrl(
    this.previousResult
  );
  const operationResultUrl = await this.waychaserProxy.getUrl(
    this.operationResult
  );
  logger.debug({ opResult: this.opResult });
  expect(operationResultUrl).to.deep.equal(previousResultUrl);

  const operationResultLokiStyleUrl = await this.waychaserProxy.getUrl(
    this.operationResultLokiStyle
  );
  expect(operationResultLokiStyleUrl).to.deep.equal(previousResultUrl);

  const opResultUrl = await this.waychaserProxy.getUrl(this.opResult);
  expect(opResultUrl).to.deep.equal(previousResultUrl);

  const opResultLokiStyleUrl = await this.waychaserProxy.getUrl(this.opResult);
  expect(opResultLokiStyleUrl).to.deep.equal(previousResultUrl);

  const resultUrl = await this.waychaserProxy.getUrl(this.result);
  expect(resultUrl).to.deep.equal(previousResultUrl);

  const resultLokiStyleUrl = await this.waychaserProxy.getUrl(this.result);
  expect(resultLokiStyleUrl).to.deep.equal(previousResultUrl);
});

async function expectFindOne(relationship, expectation) {
  const {
    foundOperation,
    foundOperationLokiStyle,
    foundOp,
    foundOpLokiStyle,
  } = await findOne.bind(this)(relationship);
  expectation(foundOperation);
  expectation(foundOperationLokiStyle);
  expectation(foundOp);
  expectation(foundOpLokiStyle);
}

async function findOne(relationship) {
  const foundOperation = await this.waychaserProxy.findOneOperation(
    this.result,
    relationship
  );

  const foundOperationLokiStyle = await this.waychaserProxy.findOneOperation(
    this.result,
    { rel: relationship }
  );

  const foundOp = await this.waychaserProxy.findOneOp(
    this.result,
    relationship
  );

  const foundOpLokiStyle = await this.waychaserProxy.findOneOp(this.result, {
    rel: relationship,
  });
  return { foundOperation, foundOperationLokiStyle, foundOp, foundOpLokiStyle };
}
