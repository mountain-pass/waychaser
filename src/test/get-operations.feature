
Feature: Get Operations

    So that I can understand what I can do with a resource
    As a developer
    I want to be able to get operations

    Scenario: Get operations - empty
        Given a resource with no operations
        When waychaser successfully loads that resource
        Then the loaded resource will have no operations

    Scenario: Get operations - single
        Given a resource with a "self" operation
        When waychaser successfully loads that resource
        Then the loaded resource will have 1 operation
        And the loaded resource will have "self" operation
        But it won't have an "item" operation