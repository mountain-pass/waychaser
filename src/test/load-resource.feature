
Feature: Load Resource

    So that I can start to interact with an resource
    As a developer
    I want to be able to load the resource

    Scenario: Load API
        Given an endpoint returning status code 200
        When waychaser loads that endpoint
        Then it will have loaded successfully

    Scenario: Load API error response
        Given an endpoint returning status code 500
        When waychaser loads that endpoint
        Then it will NOT have loaded successfully

    Scenario: Load API error cannot connect
        When waychaser loads an endpoint that's not available
        Then it will NOT have loaded successfully

