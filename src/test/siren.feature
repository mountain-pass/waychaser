Feature: Invoke Siren Operation

    So that I can perform actions on a resource
    As a developer
    I want to be able to invoke Siren operations

    Scenario: Invoke operation - self
        Given a Siren resource returning the following with a "self" link that returns itself
            """
            {
                "properties": {
                    "status": 200
                }
            }
            """
        When waychaser successfully loads that resource
        And we successfully invoke the "self" operation
        Then the same resource will be returned
        And the body without the links will contain
            """
            {
                "properties": {
                    "status": 200
                }
            }
            """

    Scenario: Invoke operation error
        Given a Siren resource with a "error" operation that returns an error
        When waychaser successfully loads that resource
        And we invoke the "error" operation
        Then it will NOT have loaded successfully

    Scenario: Invoke operation - next
        Given a resource returning status code 200
        And a Siren resource with a "next" operation that returns that resource
        When waychaser successfully loads the latter resource
        And we successfully invoke the "next" operation
        Then the former resource will be returned

    Scenario: Invoke operation - list
        Given a list of 4 Siren resources linked with "next" operations
        When waychaser successfully loads the first resource in the list
        And invokes each of the "next" operations in turn 3 times
        Then the last resource returned will be the last item in the list

    Scenario Outline: Invoke operation - body
        Given a Siren resource with a "https://waychaser.io/rel/pong" operation with the "<METHOD>" method that returns the following "<CONTENT-TYPE>" provided parameters and the content type
            | NAME | TYPE   |
            | ping | <TYPE> |
        When waychaser successfully loads that resource
        And we invoke the "https://waychaser.io/rel/pong" operation with the input
            | ping | pong |
        Then resource returned will contain only
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