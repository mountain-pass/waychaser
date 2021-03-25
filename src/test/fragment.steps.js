import { Given, Then } from '@cucumber/cucumber'
import { expect } from 'chai'
import {
  createLinks,
  createOkRouteWithLinks,
  randomApiPath
} from './resource.steps'

Given(
  'a resource with a {string} operation that returns a fragment of the resource',
  async function (relationship) {
    const body = {
      title: 'Tale of the Wellerman',
      tableOfContents: []
    }
    this.currentFragment = body.tableOfContents
    this.currentResourceRoute = randomApiPath()
    const links = createLinks(
      relationship,
      `${this.currentResourceRoute}#/tableOfContents`
    )
    await createOkRouteWithLinks.bind(this)(
      this.currentResourceRoute,
      links,
      undefined,
      undefined,
      undefined,
      body
    )
  }
)

Then('the fragment will be returned', async function () {
  // this.results contains the results
  const bodies = await this.waychaserProxy.getBodies(this.results)
  for (const body of bodies) {
    expect(body).to.deep.equal(this.currentFragment)
  }
})
