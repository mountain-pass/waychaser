
Feature: Invoke HAL Operation

    So that I can perform actions on an endpoint
    As a developer
    I want to be able to invoke HAL operations

    Scenario: Invoke operation - self
        Given a HAL endpoint returning the following with a "self" link that returns itself
            """
            {
                "status": 200
            }
            """
        When waychaser successfully loads that endpoint
        And we successfully invoke the "self" operation
        Then the same response will be returned
        And the body without the links will contain
            """
            {
                "status": 200
            }
            """

    Scenario: Invoke operation error
        Given a HAL endpoint with a "error" operation that returns an error
        When waychaser successfully loads that endpoint
        And we invoke the "error" operation
        Then it will NOT have loaded successfully

    Scenario: Invoke operation - next
        Given an endpoint returning status code 200
        And a HAL endpoint with a "next" operation that returns that endpoint
        When waychaser successfully loads the latter endpoint
        And we successfully invoke the "next" operation
        Then the former endpoint response will be returned

    Scenario: Invoke operation - list
        Given a list of 4 HAL endpoints linked with "next" operations
        When waychaser successfully loads the first endpoint in the list
        And invokes each of the "next" operations in turn 3 times
        Then the last response returned will be the last endpoint in the list

    Scenario Outline: Invoke operation - parameterised
        Given a HAL endpoint with a "https://waychaser.io/rel/pong" operation that returns the provided "ping" "<TYPE>" parameter
        When waychaser successfully loads that endpoint
        And we invoke the "https://waychaser.io/rel/pong" operation with the input
            | ping | pong |
        Then the response will contain those values

        Examples:
            | TYPE  |
            | query |
            | path  |

    Scenario Outline: Invoke operation - parameterised with extra params
        Given a HAL endpoint with a "https://waychaser.io/rel/pong" operation that returns the provided "ping" "<TYPE>" parameter
        When waychaser successfully loads that endpoint
        And we invoke the "https://waychaser.io/rel/pong" operation with the input
            | ping  | pong    |
            | other | notUsed |
        Then the response will contain only
            | ping | pong |

        Examples:
            | TYPE  |
            | query |
            | path  |

    Scenario Outline: Invoke operation - multiple parameters of same type
        Given a HAL endpoint with a "https://waychaser.io/rel/pong" operation with the "GET" method that returns the following provided parameters
            | NAME    | TYPE   |
            | alpha   | <TYPE> |
            | bravo   | <TYPE> |
            | charlie | <TYPE> |
        When waychaser successfully loads that endpoint
        And we invoke the "https://waychaser.io/rel/pong" operation with the input
            | alpha   | one   |
            | bravo   | two   |
            | charlie | three |
        Then the response will contain those values

        Examples:
            | TYPE  |
            | query |
            | path  |

    Scenario Outline: Invoke operation - multiple parameters of same type with extra params
        Given a HAL endpoint with a "https://waychaser.io/rel/pong" operation with the "GET" method that returns the following provided parameters
            | NAME    | TYPE   |
            | alpha   | <TYPE> |
            | bravo   | <TYPE> |
            | charlie | <TYPE> |
        When waychaser successfully loads that endpoint
        And we invoke the "https://waychaser.io/rel/pong" operation with the input
            | bravo   | two     |
            | other   | notUsed |
            | charlie | three   |
            | alpha   | one     |
        Then the response will contain only
            | alpha   | one   |
            | bravo   | two   |
            | charlie | three |

        Examples:
            | TYPE  |
            | query |
            | path  |

    Scenario Outline: Invoke operation - multiple parameters of different type
        Given a HAL endpoint with a "https://waychaser.io/rel/pong" operation with the "GET" method that returns the following provided parameters
            | NAME    | TYPE    |
            | alpha   | <TYPE1> |
            | bravo   | <TYPE2> |
            | charlie | <TYPE1> |
        When waychaser successfully loads that endpoint
        And we invoke the "https://waychaser.io/rel/pong" operation with the input
            | alpha   | one   |
            | bravo   | two   |
            | charlie | three |
        Then the response will contain those values

        Examples:
            | TYPE1 | TYPE2 |
            | query | path  |
            | path  | query |

    Scenario: Invoke operation - link array
        Given an endpoint returning
            """
            {
                "alpha": "one"
            }
            """
        And an endpoint returning
            """
            {
                "bravo": "two"
            }
            """
        And a HAL endpoint with "item" links to the two previous endpoints named "alpha" and "bravo"
        When waychaser successfully loads that endpoint
        And we invoke the "item" operation for the link name "alpha"
        Then the response will contain
            """
            {
                "alpha": "one"
            }
            """
        But when we invoke the "item" operation for the link name "bravo"
        Then the response will contain
            """
            {
                "bravo": "two"
            }
            """

    Scenario: Hal - curied link
        Given an endpoint returning status code 200
        And a HAL endpoint with a "wc:alpha" operation that returns that endpoint and has the following curies
            | NAME | HREF                           |
            | wc   | https://waychaser.io/rel{/rel} |
        When waychaser successfully loads that endpoint
        Then it have 1 operation

    Scenario: Invoke operation - curied link
        Given an endpoint returning status code 200
        And a HAL endpoint with a "wc:alpha" operation that returns that endpoint and has the following curies
            | NAME | HREF                           |
            | wc   | https://waychaser.io/rel{/rel} |
        When waychaser successfully loads that endpoint
        And we invoke the "https://waychaser.io/rel/alpha" operation
        Then the former endpoint response will be returned

    Scenario: Invoke operation - curied link with colon
        Given an endpoint returning status code 200
        And a HAL endpoint with a "wc:alpha:whyareyoudoingthis" operation that returns that endpoint and has the following curies
            | NAME | HREF                           |
            | wc   | https://waychaser.io/rel{/rel} |
        When waychaser successfully loads that endpoint
        And we invoke the "https://waychaser.io/rel/alpha%3Awhyareyoudoingthis" operation
        Then the former endpoint response will be returned
