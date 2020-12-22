
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
        And we invoke the "error" operation
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

    Scenario: Invoke operation - parameterised
        Given a resource with a "pong" operation that returns the provided "ping" parameter
        When waychaser successfully loads that resource
        And we invoke the "pong" operation with the input
            | ping | pong |
        Then resource returned will contain those values

    Scenario: Invoke operation - parameterised with extra params
        Given a resource with a "pong" operation that returns the provided "ping" parameter
        When waychaser successfully loads that resource
        And we invoke the "pong" operation with the input
            | ping  | pong    |
            | other | notUsed |
        Then resource returned will contain only
            | ping | pong |

    Scenario: Invoke operation - delete
        Given a resource with a "delete" operation with the "DELETE" method returning status code 204
        When waychaser successfully loads that resource
        And we invoke the "delete" operation
        Then resource returned will have the status code 204

    Scenario: Invoke operation - post
        Given a resource with a "https://waychaser.io/rel/create" operation with the "POST" method returning status code 201
        When waychaser successfully loads that resource
        And we invoke the "https://waychaser.io/rel/create" operation
        Then resource returned will have the status code 201
