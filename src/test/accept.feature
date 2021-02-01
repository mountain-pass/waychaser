@wip
Feature: Accept Parsing

    So that waychaser can send bodies with the prefered content type
    As a developer
    I want waychaser to parse the accept field

    Scenario: Single Entry
        Given an accept value of "application/x-www-form-urlencoded"
        When the accept value is parsed
        Then the following is returned:
            """
            [
                {
                    "type": "application/x-www-form-urlencoded"
                }
            ]
            """

    Scenario: Two Entries
        Given an accept value of "application/x-www-form-urlencoded,application/json"
        When the accept value is parsed
        Then the following is returned:
            """
            [
                {
                    "type": "application/x-www-form-urlencoded"
                },
                {
                    "type": "application/json"
                }
            ]
            """

    Scenario: Three Entries
        Given an accept value of "application/x-www-form-urlencoded,application/json,multipart/form-data"
        When the accept value is parsed
        Then the following is returned:
            """
            [
                {
                    "type": "application/x-www-form-urlencoded"
                },
                {
                    "type": "application/json"
                },
                {
                    "type": "multipart/form-data"
                }
            ]
            """

    Scenario: Three Entries with correct precedence ordering
        # see precedence section in https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.1
        Given an accept value of "application/*,application/json,multipart/form-data"
        When the accept value is parsed
        Then the following is returned:
            """
            [
                {
                    "type": "application/json"
                },
                {
                    "type": "multipart/form-data"
                },
                {
                    "type": "application/*"
                }
            ]
            """

    Scenario: Three Entries with correct precedence ordering and */*
        # see precedence section in https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.1
        Given an accept value of "application/*,*/*,multipart/form-data"
        When the accept value is parsed
        Then the following is returned:
            """
            [
                {
                    "type": "multipart/form-data"
                },
                {
                    "type": "application/*"
                },
                {
                    "type": "*/*"
                }
            ]
            """

    Scenario: Entries with correct precedence ordering by q score
        # see precedence section in https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.1
        Given an accept value of "application/x-www-form-urlencoded,application/json;q=0.5,multipart/form-data"
        When the accept value is parsed
        Then the following is returned:
            """
            [
                {
                    "type": "application/x-www-form-urlencoded"
                },
                {
                    "type": "multipart/form-data"
                },
                {
                    "type": "application/json"
                }
            ]
            """

    Scenario: Three Entries with correct precedence ordering overridden by q
        # see precedence section in https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.1
        Given an accept value of "*/*,application/*,multipart/form-data;q=0.5"
        When the accept value is parsed
        Then the following is returned:
            """
            [
                {
                    "type": "application/*"
                },
                {
                    "type": "*/*"
                },
                {
                    "type": "multipart/form-data"
                }
            ]
            """