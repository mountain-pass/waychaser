
@skippable @wip
Feature: Siren Example

  So that I can better understand how to use waychaser
  As a developer
  I want examples of using waychaser with a real siren API

  Background: hyperwizard is available
    * Assuming a Siren API is available at "http://hyperwizard.azurewebsites.net/hywit/void"

  Scenario: Load API
    When the following code is executed:
      """
            return waychaser.load("http://hyperwizard.azurewebsites.net/hywit/void")
      """
    Then it will have loaded successfully

  Scenario: Start Adventure
    When the following code is executed:
      """
  return waychaser
    .load('http://hyperwizard.azurewebsites.net/hywit/void')
    .then(wizApi =>
      wizApi.invoke('start-adventure', {
        name: 'tom',
        class: 'neutral',
        race: 'human'
      })
    )
    .then(resource => resource.invoke('related'))
      """
    Then the adventure will have started

  Scenario: Complete Adventure
    When the following code is executed:
      """
  return waychaser
    .load('http://hyperwizard.azurewebsites.net/hywit/void')
    .then(current =>
      current.invoke('start-adventure', {
        name: 'waychaser',
        class: 'Burglar',
        race: 'waychaser',
        gender: 'Male'
      })
    )
    .then(current => current.invoke('related'))
    .then(current => current.invoke('north'))
    .then(current => current.invoke('pull-lever'))
    .then(current =>
      current.invoke({ rel: 'move', title: 'Cross the bridge.' })
    )
    .then(current => current.invoke('move'))
    .then(current => current.invoke('look'))
    .then(current => current.invoke('eat-snacks'))
    .then(current => current.invoke('related'))
    .then(current => current.invoke('north'))
    .then(current => current.invoke('pull-lever'))
    .then(current => current.invoke('look'))
    .then(current => current.invoke('eat-snacks'))
    .then(current => current.invoke('enter'))
    .then(current => current.invoke('answer-skull', { master: 'Edsger' }))
    .then(current => current.invoke('east'))
    .then(current => current.invoke('smash-mirror-1') || current)
    .then(current => current.invoke('related') || current)
    .then(current => current.invoke('smash-mirror-2') || current)
    .then(current => current.invoke('related') || current)
    .then(current => current.invoke('smash-mirror-3') || current)
    .then(current => current.invoke('related') || current)
    .then(current => current.invoke('smash-mirror-4') || current)
    .then(current => current.invoke('related') || current)
    .then(current => current.invoke('smash-mirror-5') || current)
    .then(current => current.invoke('related') || current)
    .then(current => current.invoke('smash-mirror-6') || current)
    .then(current => current.invoke('related') || current)
    .then(current => current.invoke('smash-mirror-7') || current)
    .then(current => current.invoke('related') || current)
    .then(current => current.invoke('look'))
    .then(current => current.invoke('enter-mirror'))
    .then(current => current.invoke('north'))
    .then(current => current.invoke('down'))
    .then(current => current.invoke('take-book-3'))
      """
    Then we will have completed the adventure
