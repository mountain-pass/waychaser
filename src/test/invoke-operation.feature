
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
        Given a list of 4 resources linked with "next" operations
        When waychaser successfully loads the first resource in the list
        And invokes each of the "next" operations in turn 3 times
        Then the last resource returned will be the last item in the list

    Scenario Outline: Invoke operation - parameterised
        Given a resource with a "https://waychaser.io/rel/pong" operation that returns the provided "ping" "<TYPE>" parameter
        When waychaser successfully loads that resource
        And we invoke the "https://waychaser.io/rel/pong" operation with the input
            | ping | pong |
        Then resource returned will contain those values

        Examples:
            | TYPE  |
            | query |
            | path  |

    Scenario Outline: Invoke operation - parameterised with extra params
        Given a resource with a "https://waychaser.io/rel/pong" operation that returns the provided "ping" "<TYPE>" parameter
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


    Scenario Outline: Invoke operation - methods
        Given a resource with a "https://waychaser.io/rel/do-it" operation with the "<METHOD>" method returning status code <CODE>
        When waychaser successfully loads that resource
        And we invoke the "https://waychaser.io/rel/do-it" operation
        Then resource returned will have the status code <CODE>

        Examples:
            | METHOD | CODE |
            | DELETE | 204  |
            | POST   | 201  |
            | PUT    | 204  |
            | PATCH  | 204  |


    Scenario Outline: Invoke operation - methods parameterised
        Given a resource with a "https://waychaser.io/rel/pong" operation with the "<METHOD>" method that returns the provided "ping" "<TYPE>" parameter
        When waychaser successfully loads that resource
        And we invoke the "https://waychaser.io/rel/pong" operation with the input
            | ping | pong |
        Then resource returned will contain those values

        Examples:
            | METHOD | TYPE  |
            | DELETE | query |
            | POST   | query |
            | PUT    | query |
            | PATCH  | query |
            | DELETE | path  |
            | POST   | path  |
            | PUT    | path  |
            | PATCH  | path  |


    Scenario Outline: Invoke operation - methods parameterised with extra params
        Given a resource with a "https://waychaser.io/rel/pong" operation with the "<METHOD>" method that returns the provided "ping" "<TYPE>" parameter
        When waychaser successfully loads that resource
        And we invoke the "https://waychaser.io/rel/pong" operation with the input
            | ping  | pong    |
            | other | notUsed |
        Then resource returned will contain only
            | ping | pong |

        Examples:
            | METHOD | TYPE  |
            | DELETE | query |
            | POST   | query |
            | PUT    | query |
            | PATCH  | query |
            | DELETE | path  |
            | POST   | path  |
            | PUT    | path  |
            | PATCH  | path  |

    Scenario Outline: Invoke operation - body
        Given a resource with a "https://waychaser.io/rel/pong" operation with the "<METHOD>" method that returns the "<CONTENT-TYPE>" provided "ping" "<TYPE>" parameter and the content type
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

    Scenario Outline: Invoke operation - body with extra context
        Given a resource with a "https://waychaser.io/rel/pong" operation with the "<METHOD>" method that returns the "<CONTENT-TYPE>" provided "ping" "<TYPE>" parameter and the content type
        When waychaser successfully loads that resource
        And we invoke the "https://waychaser.io/rel/pong" operation with the input
            | ping  | pong    |
            | other | notUsed |
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

    Scenario Outline: Invoke operation -  body x-www-form-urlencoded prefered
        Given a resource with a "https://waychaser.io/rel/pong" operation with the "<METHOD>" method that returns the provided "ping" "body" parameter and the content type, accepting:
            | CONENT-TYPE                       |
            | application/x-www-form-urlencoded |
            | application/json;q=0.5            |
            | multipart/form-data;q=0.5         |
        When waychaser successfully loads that resource
        And we invoke the "https://waychaser.io/rel/pong" operation with the input
            | ping | pong |
        Then resource returned will contain only
            | content-type | application/x-www-form-urlencoded |
            | ping         | pong                              |

        Examples:
            | METHOD |
            | POST   |
            | PUT    |
            | PATCH  |

    Scenario Outline: Invoke operation - body json prefered
        Given a resource with a "https://waychaser.io/rel/pong" operation with the "<METHOD>" method that returns the provided "ping" "body" parameter and the content type, accepting:
            | CONENT-TYPE                             |
            | application/x-www-form-urlencoded;q=0.5 |
            | application/json                        |
            | multipart/form-data;q=0.5               |
        When waychaser successfully loads that resource
        And we invoke the "https://waychaser.io/rel/pong" operation with the input
            | ping | pong |
        Then resource returned will contain only
            | content-type | application/json |
            | ping         | pong             |

        Examples:
            | METHOD |
            | POST   |
            | PUT    |
            | PATCH  |

    Scenario Outline: Invoke operation - body multi-part prefered
        Given a resource with a "https://waychaser.io/rel/pong" operation with the "<METHOD>" method that returns the provided "ping" "body" parameter and the content type, accepting:
            | CONENT-TYPE                             |
            | application/x-www-form-urlencoded;q=0.5 |
            | application/json;q=0.5                  |
            | multipart/form-data                     |
        When waychaser successfully loads that resource
        And we invoke the "https://waychaser.io/rel/pong" operation with the input
            | ping | pong |
        Then resource returned will contain only
            | content-type | multipart/form-data |
            | ping         | pong                |

        Examples:
            | METHOD |
            | POST   |
            | PUT    |
            | PATCH  |

    Scenario Outline: Invoke operation - body no preference
        Given a resource with a "https://waychaser.io/rel/pong" operation with the "<METHOD>" method that returns the provided "ping" "body" parameter
        When waychaser successfully loads that resource
        And we invoke the "https://waychaser.io/rel/pong" operation with the input
            | ping | pong |
        Then resource returned will contain those values

        Examples:
            | METHOD |
            | POST   |
            | PUT    |
            | PATCH  |

    @wip
    Scenario Outline: Invoke operation - multiple parameters of same type
        Given a resource with a "https://waychaser.io/rel/pong" operation with the "<METHOD>" method that returns the following provided parameters
            | NAME  | TYPE   |
            | alpha | <TYPE> |
            | bravo | <TYPE> |
        When waychaser successfully loads that resource
        And we invoke the "https://waychaser.io/rel/pong" operation with the input
            | alpha | one |
            | bravo | two |
        Then resource returned will contain those values

        Examples:
            | METHOD | TYPE  |
            | GET    | query |