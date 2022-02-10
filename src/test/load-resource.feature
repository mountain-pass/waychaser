
Feature: Load Resource

    So that I can start to interact with an resource
    As a developer
    I want to be able to load the resource

    Scenario: Load API
        Given a resource returning status code 200
        When waychaser loads that resource
        Then it will have loaded successfully

    Scenario: Load API error response
        Given a resource returning status code 500
        When waychaser loads that resource
        Then it will NOT have loaded successfully

    Scenario: Load API error cannot connect
        When waychaser loads a resource that's not available
        Then it will NOT have loaded successfully

    Scenario: Load API - code example
        Given a resource returning status code 200
        When the following code is executed:
            """
            return waychaser(baseUrl)
            """
        Then it will have loaded successfully
