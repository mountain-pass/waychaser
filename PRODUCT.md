# Product

## ToC

- [Product](#product)
  - [ToC](#toc)
  - [Problem](#problem)
    - [Eureka moment](#eureka-moment)
  - [Customer](#customer)
  - [Solution](#solution)
  - [Assumptions](#assumptions)
    - [Unvalidated](#unvalidated)
    - [Validating](#validating)
    - [Validated](#validated)
    - [Invalidated](#invalidated)
      - [Developers are interested in HATEOAS clients](#developers-are-interested-in-hateoas-clients)
  
## Problem

REST APIs that use HATEOAS allow for extremely loose coupling, which is awesome, but actually using them can be quite hard when your starting out. This library makes it easier.

### Eureka moment

Whenever I get a good base client working, it's awesome, but getting to that first step is quite hard and gets in the way of getting the functionality your are trying to build working, which is why it's often easier to just tightly couple on the operation you need to use.

The biggest eureka moment for me, was when I was asked to create a simple demo using a HATEOAS API I had written, and rather
than "doing it right", it was just easier to tightly couple and call it done.

## Customer

Developers using REST APIs that use HATEOAS

## Solution

Simple interface that abstracted the details of navigating a REST APIs that uses HATEOAS

## Assumptions

### Unvalidated 

- it is faster to develop with a hateoas client than a non-hateoas client
- There is little interest in hateoas or demand for hateoas clients because there are so few hateoas APIs
- There are few hateoas APIs because there's little demand 
- There are few hateoas APIs because they are much harder to create than non-hateoas APIs, and it's hard to justify the
effort when lots of people just tightly couple to the API with a non-hateoas client.
- If it was just as easy or easier to create a hateoas API than a non-hateoas API, then more people would create
hateoas APIs

### Validating

_None_
### Validated

_None_

### Invalidated

#### Developers are interested in HATEOAS clients

Test: Create initial version of library, supporting HAL and Siren and pitch it on twitter.

Info on popularity a features of different hypermedia types at https://www.fabernovel.com/en/article/tech-en/which-technologies-should-you-use-to-build-hypermedia-apis

Success: At least 10 like, retweets or comments.
Result: 
  3 likes 😢 https://twitter.com/tompahoward/status/1364548120814768128?s=20
  4 likes + 1 😢 retweet https://twitter.com/tompahoward/status/1361981160524378113?s=20