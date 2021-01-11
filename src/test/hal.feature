
Feature: Invoke Operation

    So that I can perform actions on a resource
    As a developer
    I want to be able to invoke operations

    @wip
    Scenario: Invoke operation - self
        Given a HAL resource with a "self" link that returns itself
        When waychaser successfully loads that resource
        And we successfully invoke the "self" operation
        Then the same resource will be returned
