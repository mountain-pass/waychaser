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
      - [Developers still care about REST and HATEOAS](#developers-still-care-about-rest-and-hateoas)
    - [Validated](#validated)
    - [Invalidated](#invalidated)
  
## Problem

REST APIs that use HATEOAS allow for extreamly loose coupling, which is awesome, but actualy using them can be quite hard when your starting out. This library makes it easier.

### Eureka moment

Whenever I get a good base client working, it's awesome, but getting to that first step is quite hard and get's in the way of getting the functionality your are trying to build working, which is why it's often easier to just tightly couple on the operation you need to use.

The biggest eureka moment for me, was when I was asked to create a simple demo using a HATEOAS API I had written, and rather
than "doing it right", it was just easier to tightly couple and call it done.

## Customer

Developers using REST APIs that use HATEOAS

## Solution

Simple interface that abstracted the details of navigating a REST APIs that uses HATEOAS

## Assumptions

### Unvalidated

Lots 😂

### Validating

#### Developers still care about REST and HATEOAS

Test: Create intial version of library, supporting HAL and Siten and pitch it on twitter.

Info on popularity a features of different hypermedia types at https://www.fabernovel.com/en/article/tech-en/which-technologies-should-you-use-to-build-hypermedia-apis

Success: At least 10 like, retweets or comments.

### Validated

_None_

### Invalidated

_None_