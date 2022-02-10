

Feature: Get Fragment

    So that I can perform actions on a resource within a resource
    As a developer
    I want to be able to invoke operations that retrieve fragments

    Scenario: Invoke operation - fragment
        Given a resource with a "contents" operation that returns a fragment of the resource
        When waychaser successfully loads that endpoint
        And we successfully invoke the "contents" operation
        Then the fragment will be returned

    Scenario: Invoke operation - fragment links returned
        Given a resource with a "contents" operation that returns a fragment of the resource which has a "self" operation that returns itself
        When waychaser successfully loads that endpoint
        And we successfully invoke the "contents" operation
        Then the fragment will be returned
        And it will have a "self" operation that returns the same fragment

    Scenario: Invoke operation - fragment links filtered
        Given a resource with a "contents" operation that returns a fragment of the resource which has a "self" operation that returns itself
        When waychaser successfully loads that endpoint
        Then it will *not* have a "self" operation
