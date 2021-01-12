
Feature: Invoke Operation

    So that I can perform actions on a resource
    As a developer
    I want to be able to invoke operations

    @wip
    Scenario: Invoke operation - self
        Given a HAL resource returing the following with a "self" link that returns itself
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
