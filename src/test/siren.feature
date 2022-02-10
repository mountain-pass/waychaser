Feature: Invoke Siren Operation

    So that I can perform actions on a resource
    As a developer
    I want to be able to invoke Siren operations

    Scenario: Invoke operation - self
        Given a Siren endpoint returning the following with a "self" link that returns itself
            """
            {
                "properties": {
                    "status": 200
                }
            }
            """
        When waychaser successfully loads that endpoint
        And we successfully invoke the "self" operation
        Then the same response will be returned
        And the body without the links will contain
            """
            {
                "properties": {
                    "status": 200
                }
            }
            """

    Scenario: Invoke operation error
        Given a Siren endpoint with a "error" operation that returns an error
        When waychaser successfully loads that endpoint
        And we invoke the "error" operation
        Then it will NOT have loaded successfully

    Scenario: Invoke operation - next
        Given an endpoint returning status code 200
        And a Siren endpoint with a "next" operation that returns that endpoint
        When waychaser successfully loads the latter endpoint
        And we successfully invoke the "next" operation
        Then the former endpoint response will be returned

    Scenario: Invoke operation - list
        Given a list of 4 Siren endpoints linked with "next" operations
        When waychaser successfully loads the first endpoint in the list
        And invokes each of the "next" operations in turn 3 times
        Then the last response returned will be the last endpoint in the list

    Scenario Outline: Invoke operation - body
        Given a Siren endpoint with a "https://waychaser.io/rel/pong" operation with the "<METHOD>" method that returns the following "<CONTENT-TYPE>" provided parameters and the content type
            | NAME | TYPE   |
            | ping | <TYPE> |
        When waychaser successfully loads that endpoint
        And we invoke the "https://waychaser.io/rel/pong" operation with the input
            | ping | pong |
        Then the response will contain only
            | content-type | <CONTENT-TYPE> |
            | ping         | pong           |

        Examples:
            | METHOD | TYPE | CONTENT-TYPE                      |
            | POST   | body | application/x-www-form-urlencoded |
            | POST   | body | application/json                  |
            | POST   | body | multipart/form-data               |
            | PUT    | body | application/x-www-form-urlencoded |
            | PUT    | body | application/json                  |
            | PUT    | body | multipart/form-data               |
            | PATCH  | body | application/x-www-form-urlencoded |
            | PATCH  | body | application/json                  |
            | PATCH  | body | multipart/form-data               |