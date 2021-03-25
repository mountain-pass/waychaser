

Feature: Get Fragment

    So that I can perform actions on a resource within a resource
    As a developer
    I want to be able to invoke operations that retrieve fragments

    @wip
    Scenario: Invoke operation - self
        Given a resource with a "contents" operation that returns a fragment of the resource
        When waychaser successfully loads that resource
        And we successfully invoke the "contents" operation
        Then the fragment will be returned


