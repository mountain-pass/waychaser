
Feature: Invoke Operation

    So that I can perform actions on a resource
    As a developer
    I want to be able to invoke operations

    Scenario: Invoke operation - self
        Given a resource with a "self" operation that returns itself
        When waychaser successfully loads that resource
        And we successfully invoke the "self" operation
        Then the same resource will be returned

    Scenario: Invoke operation error
        Given a resource with a "error" operation that returns an error
        When waychaser successfully loads that resource
        When we invoke the "error" operation
        Then it will NOT have loaded successfully

    Scenario: Invoke operation - next
        Given a resource returning status code 200
        And a resource with a "next" operation that returns that resource
        When waychaser successfully loads the latter resource
        And we successfully invoke the "next" operation
        Then the former resource will be returned

    Scenario: Invoke operation - list
        Given a list of 10 resources linked with "next" operations
        When waychaser successfully loads the first resource in the list
        And invokes each of the "next" operations in turn 9 times
        Then the last resource returned will be the last item in the list
