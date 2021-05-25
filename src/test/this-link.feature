
Feature: This Link

    Scenario: This Link Automatically Expands
        Given a resource at "/api/user/jane-smith"
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

    @wip
    Scenario: This Link Automatically Expands - fragment
        Given a resource at "/api/user/jane-smith"
        And a resource  with the body '[ {"type": "user","username": "jane-smith"} ]' and the links
            | rel       | uri                              | anchor |
            | item      | #/0                              |        |
            | canonical | /api/{this.type}/{this.username} | #/0    |
        When waychaser successfully loads that resource
        And we successfully invoke the "item" operation
        And we successfully invoke the "canonical" operation
        Then the former resource will be returned
