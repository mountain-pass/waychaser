import { Given, Then } from '@cucumber/cucumber'
import { expect } from 'chai'
import fetch from 'isomorphic-fetch'
import logger from '../util/logger'

Given('Assuming a Siren API is available at {string}', async function (url) {
  const response = await fetch(url, {
    headers: {
      accept: 'application/vnd.siren+json'
    }
  })
  if (!response.ok) {
    logger.error(`URL not available: ${url}`)
    logger.error(`status code: ${response.statusText} ${response.status}`)
    return 'skipped'
  }
  this.currentResourceRoute = url
})

Then('the adventure will have started', async function () {
  expect(
    await this.waychaserProxy.find([this.result], 'move')
  ).to.not.be.undefined()
})

Then('we will have completed the adventure', async function () {
  const returnOperation = await this.waychaserProxy.find(
    [this.result],
    'return'
  )
  expect(returnOperation[0]).to.not.be.undefined()
  expect(returnOperation[0].title).to.equal('Return to the void.')
})

function example (waychaser) {
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
    .then(current => {
      if (current.response.status <= 500) return current.invoke('related')
      else throw new Error('Server Error')
    })
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
}
