import { Given, When, Then } from "cucumber";
import logger from "../util/logger";
import LinkHeader from "http-link-header";
import { API_ACCESS_PORT, API_ACCESS_HOST } from "./config";

Given("a resource returning status code {int}", async function (status) {
  await this.router.route("/api").get(async (request, response) => {
    response.status(status).send({ status });
  });
  logger.debug("/api route setup");
});

Given("a resource with no operations", async function () {
  await this.router.route("/api").get(async (request, response) => {
    response.status(200).send({ status: 200 });
  });
});

Given("a resource with a {string} operation", async function (relationship) {
  await this.router.route("/api").get(async (request, response) => {
    const links = new LinkHeader();
    links.set({
      rel: relationship,
    });
    response.header("link", links.toString()).status(200).send({ status: 200 });
  });
});

Given(
  "a resource with a {string} operation that returns itself",
  async function (relationship) {
    await this.router.route("/api").get(async (request, response) => {
      const links = new LinkHeader();
      links.set({
        rel: relationship,
        uri: "/api",
      });
      response
        .header("link", links.toString())
        .status(200)
        .send({ status: 200 });
    });
  }
);

Given(
  "a resource with a {string} operation that returns an error",
  async function (relationship) {
    await this.router.route("/api").get(async (request, response) => {
      const links = new LinkHeader();
      links.set({
        rel: relationship,
        uri: `http://${API_ACCESS_HOST}:0/api`,
      });
      response
        .header("link", links.toString())
        .status(200)
        .send({ status: 200 });
    });
  }
);
