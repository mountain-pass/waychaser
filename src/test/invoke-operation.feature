
Feature: Invoke Operation

    So that I can perform actions on a resource
    As a developer
    I want to be able to invoke operations

    Scenario: Invoke operation
        Given a resource with a "self" operation that returns itself
        When waychaser successfully loads that resource
        And we successfully invoke the "self" operation
        Then the same resource will be returned

    Scenario: Invoke operation error
        Given a resource with a "error" operation that returns an error
        When waychaser successfully loads that resource
        When we invoke the "error" operation
        Then it will NOT have loaded successfully