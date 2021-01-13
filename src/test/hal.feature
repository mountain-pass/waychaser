
Feature: Invoke HAL Operation

    So that I can perform actions on a resource
    As a developer
    I want to be able to invoke HAL operations

    Scenario: Invoke operation - self
        Given a HAL resource returning the following with a "self" link that returns itself
            """
            {
                "status": 200
            }
            """
        When waychaser successfully loads that resource
        And we successfully invoke the "self" operation
        Then the same resource will be returned
        And the body without the links will contain
            """
            {
                "status": 200
            }
            """

    Scenario: Invoke operation error
        Given a HAL resource with a "error" operation that returns an error
        When waychaser successfully loads that resource
        And we invoke the "error" operation
        Then it will NOT have loaded successfully

    Scenario: Invoke operation - next
        Given a resource returning status code 200
        And a HAL resource with a "next" operation that returns that resource
        When waychaser successfully loads the latter resource
        And we successfully invoke the "next" operation
        Then the former resource will be returned

    Scenario: Invoke operation - list
        Given a list of 4 HAL resources linked with "next" operations
        When waychaser successfully loads the first resource in the list
        And invokes each of the "next" operations in turn 3 times
        Then the last resource returned will be the last item in the list

    Scenario Outline: Invoke operation - parameterised
        Given a HAL resource with a "https://waychaser.io/rel/pong" operation that returns the provided "ping" "<TYPE>" parameter
        When waychaser successfully loads that resource
        And we invoke the "https://waychaser.io/rel/pong" operation with the input
            | ping | pong |
        Then resource returned will contain those values

        Examples:
            | TYPE  |
            | query |
            | path  |

    Scenario Outline: Invoke operation - parameterised with extra params
        Given a HAL resource with a "https://waychaser.io/rel/pong" operation that returns the provided "ping" "<TYPE>" parameter
        When waychaser successfully loads that resource
        And we invoke the "https://waychaser.io/rel/pong" operation with the input
            | ping  | pong    |
            | other | notUsed |
        Then resource returned will contain only
            | ping | pong |

        Examples:
            | TYPE  |
            | query |
            | path  |

    Scenario Outline: Invoke operation - multiple parameters of same type
        Given a HAL resource with a "https://waychaser.io/rel/pong" operation with the "GET" method that returns the following provided parameters
            | NAME    | TYPE   |
            | alpha   | <TYPE> |
            | bravo   | <TYPE> |
            | charlie | <TYPE> |
        When waychaser successfully loads that resource
        And we invoke the "https://waychaser.io/rel/pong" operation with the input
            | alpha   | one   |
            | bravo   | two   |
            | charlie | three |
        Then resource returned will contain those values

        Examples:
            | TYPE  |
            | query |
            | path  |

    Scenario Outline: Invoke operation - multiple parameters of same type with extra params
        Given a HAL resource with a "https://waychaser.io/rel/pong" operation with the "GET" method that returns the following provided parameters
            | NAME    | TYPE   |
            | alpha   | <TYPE> |
            | bravo   | <TYPE> |
            | charlie | <TYPE> |
        When waychaser successfully loads that resource
        And we invoke the "https://waychaser.io/rel/pong" operation with the input
            | bravo   | two     |
            | other   | notUsed |
            | charlie | three   |
            | alpha   | one     |
        Then resource returned will contain only
            | alpha   | one   |
            | bravo   | two   |
            | charlie | three |

        Examples:
            | TYPE  |
            | query |
            | path  |

    @wip
    Scenario Outline: Invoke operation - multiple parameters of different type
        Given a HAL resource with a "https://waychaser.io/rel/pong" operation with the "GET" method that returns the following provided parameters
            | NAME    | TYPE    |
            | alpha   | <TYPE1> |
            | bravo   | <TYPE2> |
            | charlie | <TYPE1> |
        When waychaser successfully loads that resource
        And we invoke the "https://waychaser.io/rel/pong" operation with the input
            | alpha   | one   |
            | bravo   | two   |
            | charlie | three |
        Then resource returned will contain those values

        Examples:
            | TYPE1 | TYPE2 |
            | query | path  |
            | path  | query |
