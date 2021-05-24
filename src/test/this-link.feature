
Feature: This Link

    Scenario: This Link Automatically Expands
        Given a resource at "/user/jane-smith"
        And a resource with a "item" operation with the URI "/{this.type}/{this.username}" and the body
            """
            {
                "type": "user",
                "username": "jane-smith"
            }
            """
        When waychaser successfully loads that resource
        And we successfully invoke the "item" operation
        Then the former resource will be returned
