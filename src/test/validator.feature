
Feature: Validator

    Scenario: Validate
        Given an endpoint returning
            """
            {
                "username": "username",
                "name": "Al Coholic"
            }
            """
        When waychaser loads that endpoint with a validator expecting
            | username | string |
            | name     | string |
        Then it will have loaded successfully

    Scenario: Invalidate
        Given an endpoint returning
            """
            {
                "not-username": "username",
                "not-name": "Al Coholic"
            }
            """
        When waychaser loads that endpoint with a validator expecting
            | username | string |
            | name     | string |
        Then it will NOT have loaded successfully

    Scenario: Validate on invoke
        Given an endpoint returning
            """
            {
                "username": "username",
                "name": "Al Coholic"
            }
            """
        And an endpoint with a "prev" operation that returns that previous endpoint
        When waychaser successfully loads the latter endpoint
        And we invoke the "prev" operation with a validator expecting
            | username | string |
            | name     | string |
        Then it will have loaded successfully

    Scenario: Invalid on invoke
        Given an endpoint returning
            """
            {
                "not-username": "username",
                "not-name": "Al Coholic"
            }
            """
        And an endpoint with a "prev" operation that returns that previous endpoint
        When waychaser successfully loads the latter endpoint
        And we invoke the "prev" operation with a validator expecting
            | username | string |
            | name     | string |
        Then it will have loaded successfully

    @wip
    Scenario: Validate with operations
        Given an endpoint with a self operation returning
            """
            {
                "username": "username",
                "name": "Al Coholic"
            }
            """
        When waychaser loads that endpoint with a validator expecting
            | username | string |
            | name     | string |
        And we invoke the "self" operation with a validator expecting
            | username | string |
            | name     | string |
        Then it will have loaded successfully