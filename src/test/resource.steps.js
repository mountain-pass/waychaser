import { Given } from "cucumber";
import logger from "../util/logger";
import LinkHeader from "http-link-header";
import { API_ACCESS_HOST } from "./config";

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
  await createRoute(this.router, relationship);
});

Given(
  "a resource with a {string} operation that returns itself",
  async function (relationship) {
    await createRoute(this.router, relationship, "/api");
  }
);

Given(
  "a resource with a {string} operation that returns an error",
  async function (relationship) {
    await createRoute(
      this.router,
      relationship,
      `http://${API_ACCESS_HOST}:0/api`
    );
  }
);

async function createRoute(router, relationship, linkPath) {
  const links = createLinks(relationship, linkPath);
  await router.route("/api").get(async (request, response) => {
    send200response(response, links);
  });
}

function createLinks(relationship, uri) {
  const links = new LinkHeader();
  links.set({
    rel: relationship,
    uri: uri,
  });
  return links;
}

function send200response(response, links) {
  response.header("link", links.toString()).status(200).send({ status: 200 });
}
