// import { Given, Then } from '@cucumber/cucumber'
// import { assert, expect } from 'chai'
// import { invokeSuccessfully } from './operations.steps'
// import {
//   createLinks,
//   createOkRouteWithLinks,
//   randomApiPath
// } from './resource.steps'



// Given(
//   'a resource with a {string} operation that returns a fragment of the resource which has a {string} operation',
//   createResourceWithFragment
// )



// Then(
//   'it will have a {string} operation that returns the same fragment',
//   async function (relationship) {
//     // eslint-disable-next-line unicorn/no-array-callback-reference
//     // eslint-disable-next-line unicorn/no-array-method-this-argument
//     const found = await this.waychaserProxy.find(this.results, relationship)
//     for (const key in found) {
//       assert.isDefined(found[key])
//     }
//     await invokeSuccessfully.bind(this)(this.results[0], relationship)
//     const bodies = await this.waychaserProxy.getBodies(this.results)
//     for (const body of bodies) {
//       expect(body).to.deep.equal(this.currentFragment)
//     }
//   }
// )

// Then('it will *not* have a {string} operation', async function (relationship) {
//   // eslint-disable-next-line unicorn/no-array-method-this-argument
//   const found = await this.waychaserProxy.find(this.results, relationship)
//   for (const key in found) {
//     assert.isUndefined(found[key])
//   }
// })
