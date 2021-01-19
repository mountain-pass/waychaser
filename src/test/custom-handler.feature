
Feature: Custom Handler

    So that I can perform actions on a non-standard resource
    As a developer
    I want to be able to provide a custom handler for intepreting operations and excuting them

    @wip
    Scenario: Invoke operation - self
        Given a custom resource with a "self" operation that returns itself
        And waychaser has a custom handler for that resource
        When waychaser successfully loads that resource
        And we successfully invoke the "self" operation
        Then the same resource will be returned