
Feature: Ranged Link

    Scenario: Ranged Link Automatically Expands
        Given an endpoint with a "item" operation with the URI "/items/{[0..19]}"
        When waychaser successfully loads that endpoint
        Then the response will have 20 "item" operations

    Scenario: Ranged Link Automatically Expands - multiple ranges
        Given an endpoint with a "item" operation with the URI "/items/{[0..19]}/subitem/{[0..9]}"
        When waychaser successfully loads that endpoint
        Then the response will have 200 "item" operations

    Scenario: Ranged Link Automatically Expands - expand anchors
        Given an endpoint with the operations
            | rel       | uri              | anchor      |
            | item      | #/{[0..24]}      |             |
            | canonical | /items/{this.id} | #/{[0..24]} |
        When waychaser successfully loads that endpoint
        Then the response will have 25 "item" operations
        And each "item" will have a "canonical" operation

    Scenario: Ranged Link Automatically Expands - expand anchors
        Given an endpoint with the operations
            | rel       | uri                 | anchor              |
            | item      | #/{[0..4]}/{[0..1]} |                     |
            | canonical | /items/{this.id}    | #/{[0..4]}/{[0..1]} |
        When waychaser successfully loads that endpoint
        Then the response will have 10 "item" operations
        And each "item" will have a "canonical" operation

    Scenario: Collection with many many items - fetch nth item
        Given an endpoint that's a collection with 524288 items
        When waychaser successfully loads that endpoint
        And we invoke the 'item' operation for the 1986th item
        Then the 1986th item will be returned

    Scenario Outline: InvokeAll - automatic parameters
        Given an endpoint with a "item" operation with the URI "<PATH>" returning
            """
            <BODY>
            """
        When waychaser successfully loads that endpoint
        Then the response will have an "item" operation
        And when invokeAll is called on the "item" Operation, 5 items will be returned
        And the items will contain '<RESULTS>'

        Examples:
            | BODY                                                    | PATH            | RESULTS                    |
            | [ "a", "b", "c", "d", "e"]                              | #/{index}       | [ "a", "b", "c", "d", "e"] |
            | { "items": [ "a", "b", "c", "d", "e"] }                 | #/items/{index} | [ "a", "b", "c", "d", "e"] |
            | { "a": 1, "b": 2, "c": 3, "d": 4, "e": 5 }              | #/{index}       | [ 1, 2, 3, 4, 5]           |
            | { "items": { "a": 1, "b": 2, "c": 3, "d": 4, "e": 5 } } | #/items/{index} | [ 1, 2, 3, 4, 5]           |



    Scenario Outline: Collection with many items - automatic parameters - passed in
        Given an endpoint with a "item" operation with the URI "<PATH>" returning
            """
            <BODY>
            """
        When waychaser successfully loads that endpoint
        And we invoke the "item" operation with the input
            | index | <INDEX> |
        Then the response will contain
            """
            <RESULT>
            """
        And the response will have the parameters
            | index | <INDEX> |

        Examples:
            | BODY                                                    | PATH            | INDEX | RESULT |
            | [ "a", "b", "c", "d", "e"]                              | #/{index}       | 2     | "c"    |
            | { "items": [ "a", "b", "c", "d", "e"] }                 | #/items/{index} | 2     | "c"    |
            | { "a": 1, "b": 2, "c": 3, "d": 4, "e": 5 }              | #/{index}       | c     | 3      |
            | { "items": { "a": 1, "b": 2, "c": 3, "d": 4, "e": 5 } } | #/items/{index} | c     | 3      |

    Scenario Outline: InvokeAll - automatic parameters - nested
        Given an endpoint with a "item" operation with the URI "<PATH>" returning
            """
            <BODY>
            """
        When waychaser successfully loads that endpoint
        Then the response will have an "item" operation
        And when invokeAll is called on the "item" Operation, 5 items will be returned
        And the items will contain '<RESULTS>'

        Examples:
            | BODY                                                        | PATH              | RESULTS           |
            | { "a": { "k": 1, "l": 2}, "b": { "k": 3, "l": 4, "m": 5 } } | #/{alpha}/{bravo} | [ 1, 2, 3, 4, 5 ] |
            | { "a": [ 1, 2], "b": [ 3, 4, 5 ] }                          | #/{alpha}/{bravo} | [ 1, 2, 3, 4, 5 ] |
            | [{ "k": 1, "l": 2 }, { "k": 3, "l": 4, "m": 5 }]            | #/{alpha}/{bravo} | [ 1, 2, 3, 4, 5 ] |
            | [[ 1, 2 ], [3, 4, 5 ]]                                      | #/{alpha}/{bravo} | [ 1, 2, 3, 4, 5 ] |

    Scenario Outline: Collection with many items - automatic parameters - passed in
        Given an endpoint with a "item" operation with the URI "<PATH>" returning
            """
            <BODY>
            """
        When waychaser successfully loads that endpoint
        And we invoke the "item" operation with the input
            | alpha | <ALPHA> |
            | bravo | <BRAVO> |
        Then the response will contain
            """
            <RESULT>
            """
        And the response will have the parameters
            | alpha | <ALPHA> |
            | bravo | <BRAVO> |

        Examples:
            | BODY                                                        | PATH              | ALPHA | BRAVO | RESULT |
            | { "a": { "k": 1, "l": 2}, "b": { "k": 3, "l": 4, "m": 5 } } | #/{alpha}/{bravo} | b     | l     | 4      |
            | { "a": [ 1, 2], "b": [ 3, 4, 5 ] }                          | #/{alpha}/{bravo} | b     | 1     | 4      |
            | [{ "k": 1, "l": 2 }, { "k": 3, "l": 4, "m": 5 }]            | #/{alpha}/{bravo} | 1     | l     | 4      |
            | [[ 1, 2 ], [3, 4, 5 ]]                                      | #/{alpha}/{bravo} | 1     | 1     | 4      |

    Scenario Outline: Collection Link Automatically Expands - expand anchors
        Given an endpoint returning '<BODY>' with the following links
            | rel       | uri              | anchor             |
            | item      | <ITEM_PATH>      |                    |
            | canonical | <CANONICAL_PATH> | <CANONICAL_ANCHOR> |
        When waychaser successfully loads that endpoint
        Then the response will have an "item" operation
        And each "item" will have a "canonical" operation

        Examples:
            | BODY                                                    | ITEM_PATH       | CANONICAL_PATH | CANONICAL_ANCHOR |
            | ["a","b","c","d","e"]                                   | #/{index}       | /items/{idx}   | #/{idx}          |
            | { "items": [ "a", "b", "c", "d", "e"] }                 | #/items/{index} | /other/{a}     | #/items/{a}      |
            | { "a": 1, "b": 2, "c": 3, "d": 4, "e": 5 }              | #/{index}       | /items/{idx}   | #/{idx}          |
            | { "items": { "a": 1, "b": 2, "c": 3, "d": 4, "e": 5 } } | #/items/{index} | /other/{a}     | #/items/{a}      |

    Scenario Outline: Collection Link Automatically Expands - expand and follow anchors
        Given an endpoint at "/api/items/<INDEX>"
        Given an endpoint returning '<BODY>' with the following links
            | rel       | uri              | anchor             |
            | item      | <ITEM_PATH>      |                    |
            | canonical | /api/items/{idx} | <CANONICAL_ANCHOR> |
        When waychaser successfully loads that endpoint
        And we invoke the "item" operation with the input
            | index | <INDEX> |
        And we invoke the "canonical" operation
        Then the former endpoint response will be returned

        Examples:
            | BODY                                                    | INDEX | ITEM_PATH       | CANONICAL_ANCHOR |
            | ["a","b","c","d","e"]                                   | 2     | #/{index}       | #/{idx}          |
            | { "items": [ "a", "b", "c", "d", "e"] }                 | 2     | #/items/{index} | #/items/{idx}    |
            | { "a": 1, "b": 2, "c": 3, "d": 4, "e": 5 }              | c     | #/{index}       | #/{idx}          |
            | { "items": { "a": 1, "b": 2, "c": 3, "d": 4, "e": 5 } } | c     | #/items/{index} | #/items/{idx}    |
