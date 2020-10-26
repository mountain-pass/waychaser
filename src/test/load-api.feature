
Feature: Poll Releases

    So that I can start to interact with an API
    As a deveroper
    I want to be able to load the API

    Scenario: Load API
        Given a API returning 200
        When we try to load that API
        Then the API will load successfully

    Scenario: Load API error
        Given a API returning 500
        When we try to load that API
        Then the API will NOT load successfully
