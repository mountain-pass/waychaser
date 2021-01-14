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
