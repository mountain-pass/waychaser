import { Given, Before } from "cucumber";
import LinkHeader from "http-link-header";
import { API_ACCESS_HOST } from "./config";

import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";

const randomApiPath = () => {
  return (
    "/api/" +
    uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
    })
  );
};

Given("a resource returning status code {int}", async function (status) {
  this.currentResourceRoute = await this.createRoute(randomApiPath(), status);
});

Given("a resource with no operations", async function () {
  this.currentResourceRoute = randomApiPath();
  await this.router
    .route(this.currentResourceRoute)
    .get(async (request, response) => {
      response.status(200).send({ status: 200 });
    });
});

Given("a resource with a {string} operation", async function (relationship) {
  this.currentResourceRoute = await this.createRoute(
    randomApiPath(),
    200,
    relationship
  );
});

Given(
  "a resource with a {string} operation that returns itself",
  async function (relationship) {
    this.currentResourceRoute = randomApiPath();
    await this.createRoute(
      this.currentResourceRoute,
      200,
      relationship,
      this.currentResourceRoute
    );
  }
);

Given(
  "a resource with a {string} operation that returns an error",
  async function (relationship) {
    this.currentResourceRoute = await this.createRoute(
      randomApiPath(),
      200,
      relationship,
      `http://${API_ACCESS_HOST}:33556/api`
    );
  }
);

Given(
  "a resource with a {string} operation that returns that resource",
  async function (relationship) {
    this.currentResourceRoute = await this.createRoute(
      randomApiPath(),
      200,
      relationship,
      this.currentResourceRoute
    );
  }
);

Before(async function () {
  this.createRoute = async function (route, status, relationship, linkPath) {
    if (relationship) {
      const links = this.createLinks(relationship, linkPath);
      await this.router.route(route).get(async (request, response) => {
        this.sendResponse(response, status, links);
      });
    } else {
      await this.router.route(route).get(async (request, response) => {
        this.sendResponse(response, status);
      });
    }
    return route;
  };

  this.createLinks = function (relationship, uri) {
    const links = new LinkHeader();
    links.set({
      rel: relationship,
      uri: uri,
    });
    return links;
  };

  this.sendResponse = function (response, status, links) {
    if (links) {
      response.header("link", links.toString()).status(200).send({ status });
    } else {
      response.status(status).send({ status });
    }
  };
});
