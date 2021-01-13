
Feature: Invoke HAL Operation

    So that I can perform actions on a resource
    As a developer
    I want to be able to invoke HAL operations

    Scenario: Invoke HAL operation - self
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

    @wip
    Scenario: Invoke operation error
        Given a HAL resource with a "error" operation that returns an error
        When waychaser successfully loads that resource
        And we invoke the "error" operation
        Then it will NOT have loaded successfully
