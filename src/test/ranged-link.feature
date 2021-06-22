
Feature: Ranged Link

    Scenario: Ranged Link Automatically Expands
        Given a resource with a "item" operation with the URI "/items/{[0..19]}"
        When waychaser successfully loads that resource
        Then it will have 20 "item" operations

    Scenario: Ranged Link Automatically Expands - multiple ranges
        Given a resource with a "item" operation with the URI "/items/{[0..19]}/subitem/{[0..9]}"
        When waychaser successfully loads that resource
        Then it will have 200 "item" operations

    Scenario: Ranged Link Automatically Expands - expand anchors
        Given a resource with the operations
            | rel       | uri              | anchor      |
            | item      | #/{[0..24]}      |             |
            | canonical | /items/{this.id} | #/{[0..24]} |
        When waychaser successfully loads that resource
        Then it will have 25 "item" operations
        And each "item" will have a "canonical" operation

    Scenario: Ranged Link Automatically Expands - expand anchors
        Given a resource with the operations
            | rel       | uri                 | anchor              |
            | item      | #/{[0..4]}/{[0..1]} |                     |
            | canonical | /items/{this.id}    | #/{[0..4]}/{[0..1]} |
        When waychaser successfully loads that resource
        Then it will have 10 "item" operations
        And each "item" will have a "canonical" operation

    Scenario: Collection with many many items - fetch nth item
        Given a resource that's a collection with 524288 items
        When waychaser successfully loads that resource
        And we invoke the 'item' operation for the 1986th item
        Then the 1986th item will be returned
