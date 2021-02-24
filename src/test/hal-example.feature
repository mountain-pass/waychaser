
# even though this is calling an external service, we only need to tag it as @skippable
# if we start to see it become unreliable. Doubt that will happen with AWS.
# If it does happen, then we'll need other tests to make sure we still have coverage
# when these tests are skipped
@not-chrome @not-firefox @not-safari @not-ie @not-edge @not-iphone @not-android @not-head
Feature: HAL Example

  So that I can better understand how to use waychaser
  As a developer
  I want examples of using waychaser with a real HAL API

  Background: AWS API Gateway is available
    Given waychaser is using a HAL handler
    And waychaser is using aws4 signing fetcher
    * Assuming a HAL API is available at "https://apigateway.ap-southeast-2.amazonaws.com/restapis"

  Scenario: Load API
    When the following code is executed:
      """
  return waychaser.load("https://apigateway.ap-southeast-2.amazonaws.com/restapis")
      """
    Then it will have loaded successfully

  @wip
  Scenario: Get schema from api gateway
    When we get the "<SCHEMA>" schema for the "test-waychaser" API gateway
    Then it will have successfully downloaded a schema

    Examples:
      | SCHEMA |
      | Error  |
      | Empty  |
