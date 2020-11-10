import { Given, When, Then } from "cucumber";
import logger from "../util/logger";
// eslint-disable-next-line no-unused-vars
import { API_ACCESS_PORT, API_ACCESS_HOST } from "./config";

Given("a API returning {int}", async function (status) {
  await this.router.route("/api").get(async (request, response) => {
    response.status(status).send({ status });
  });
  logger.debug("/api route setup");
});

When("we try to load that API", async function () {
  this.attempt = this.waychaser.load(
    `http://${API_ACCESS_HOST}:${API_ACCESS_PORT}/api`
  );
});

Then("the API will load successfully", { timeout: 40000 }, async function () {
  await expect(this.attempt).to.not.be.rejectedWith(Error);
});

Then("the API will NOT load successfully", async function () {
  await expect(this.attempt).to.be.rejectedWith(Error);
});
