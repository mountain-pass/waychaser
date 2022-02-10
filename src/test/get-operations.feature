

Feature: Get Operations

    So that I can understand what I can do with a resource
    As a developer
    I want to be able to get operations

    Scenario: Get operations - empty
        Given an endpoint with no operations
        When waychaser successfully loads that endpoint
        Then the response will have no operations

    Scenario: Get operations - single
        Given an endpoint with a "self" operation
        When waychaser successfully loads that endpoint
        Then the response will have 1 operation
        And it will have a "self" operation
        But it won't have any other operations