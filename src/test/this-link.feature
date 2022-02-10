
Feature: This Link

    Scenario: This Link Automatically Expands
        Given an endpoint at "/api/user/jane-smith"
        And an endpoint with a "item" operation with the URI "/api/{this.type}/{this.username}" and the body
            """
            {
                "type": "user",
                "username": "jane-smith"
            }
            """
        When waychaser successfully loads that endpoint
        And we successfully invoke the "item" operation
        Then the former endpoint response will be returned

    Scenario: This Link Automatically Expands - fragment
        Given an endpoint at "/api/user/jane-smith"
        And an endpoint with the body '[ {"type": "user","username": "jane-smith"} ]' and the links
            | rel       | uri                              | anchor |
            | item      | #/0                              |        |
            | canonical | /api/{this.type}/{this.username} | #/0    |
        When waychaser successfully loads that endpoint
        And we successfully invoke the "item" operation
        And we successfully invoke the "canonical" operation
        Then the former endpoint response will be returned

    Scenario: This Link expansion doesn't barf on non-json
        Given an endpoint at "/api/user/jane-smith"
        And an endpoint with no body and the links
            | rel  | uri                  |
            | item | /api/user/jane-smith |
        When waychaser successfully loads that endpoint
        And we successfully invoke the "item" operation
        Then the former endpoint response will be returned
