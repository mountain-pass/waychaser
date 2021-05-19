Feature: Custom Handler

    So that I can perform actions on a non-standard resource
    As a developer
    I want to be able to provide a custom handler for interpreting operations and executing them

    Scenario: Invoke operation - self header
        Given a custom resource with a "self" header operation that returns itself
        And waychaser has a custom header handler
        When waychaser successfully loads that resource
        And we successfully invoke the "self" operation
        Then the same resource will be returned

    Scenario: Invoke operation - self header with array of media types
        Given a custom resource with a "self" header operation that returns itself
        And waychaser has a custom header handler for an array of media types
        When waychaser successfully loads that resource
        And we successfully invoke the "self" operation
        Then the same resource will be returned


    Scenario: Invoke operation - self body link
        Given a custom resource returning the following with a "self" body link that returns itself
            """
            {
                "status": 200
            }
            """
        And waychaser has a custom body handler
        When waychaser successfully loads that resource
        And we successfully invoke the "self" operation
        Then the same resource will be returned
        And the body without the links will contain
            """
            {
                "status": 200
            }
            """

    Scenario Outline: Invoke operation error
        Given a custom resource with a "error" <LOCATION> operation that returns an error
        And waychaser has a custom <LOCATION> handler
        When waychaser successfully loads that resource
        And we invoke the "error" operation
        Then it will NOT have loaded successfully

        Examples:
            | LOCATION |
            | body     |
            | header   |

    Scenario Outline: Invoke operation - next
        Given a resource returning status code 200
        And a custom resource with a "next" <LOCATION> operation that returns that resource
        And waychaser has a custom <LOCATION> handler
        When waychaser successfully loads the latter resource
        And we successfully invoke the "next" operation
        Then the former resource will be returned

        Examples:
            | LOCATION |
            | body     |
            | header   |

    Scenario Outline: Custom handler + defaults
        Given a resource returning status code 200
        And a resource with a "next" operation that returns that resource
        And a custom resource with a "next" <LOCATION> operation that returns that resource
        And waychaser has a custom <LOCATION> handler
        And waychaser has default handlers
        When waychaser successfully loads the latter resource
        And we successfully invoke the "next" operation
        And we successfully invoke the "next" operation
        And the body will contain
            """
            {
                "status": 200
            }
            """

        Examples:
            | LOCATION |
            | body     |
            | header   |

    Scenario: Custom handler array + defaults
        Given a resource returning status code 200
        And a resource with a "next" operation that returns that resource
        And a custom resource with a "next" header operation that returns that resource
        And waychaser has a custom header handler for an array of media types
        And waychaser has default handlers
        When waychaser successfully loads the latter resource
        And we successfully invoke the "next" operation
        And we successfully invoke the "next" operation
        And the body will contain
            """
            {
                "status": 200
            }
            """

    Scenario: Custom handler + body defaults with stopper
        Given a resource returning status code 200
        And a custom resource with a "next" body _links operation that returns that resource
        And waychaser has a custom stopping body _links handler
        And waychaser has default handlers
        When waychaser successfully loads the latter resource
        Then the loaded resource will have 1 operation
        And we successfully invoke the "next" operation
        Then the former resource will be returned

    Scenario: Custom handler + header defaults with stopper
        Given a resource returning status code 200
        And a custom resource with a "next" header link operation that returns that resource
        And waychaser has a custom stopping header link handler
        When waychaser successfully loads the latter resource
        Then the loaded resource will have 1 operation
        And we successfully invoke the "next" operation
        Then the former resource will be returned

    Scenario: Two custom handlers
        Given a resource returning status code 200
        And a custom resource with a "next" header operation that returns that resource
        And a custom resource with a "next" body operation that returns that resource
        And waychaser has a custom body handler
        And waychaser has a custom header handler
        When waychaser successfully loads the latter resource
        And we successfully invoke the "next" operation
        And we successfully invoke the "next" operation
        And the body will contain
            """
            {
                "status": 200
            }
            """

    Scenario: Two custom handlers - second with array
        Given a resource returning status code 200
        And a custom resource with a "next" header operation that returns that resource
        And a custom resource with a "next" body operation that returns that resource
        And waychaser has a custom body handler
        And waychaser has a custom header handler for an array of media types
        When waychaser successfully loads the latter resource
        And we successfully invoke the "next" operation
        And we successfully invoke the "next" operation
        And the body will contain
            """
            {
                "status": 200
            }
            """
