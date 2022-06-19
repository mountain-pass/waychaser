import { getNewRouter, startServer } from '../src/test/fakes/server'

console.log('DEVELOPMENT SERVER STARTED')

startServer().then(() => {
  const router = getNewRouter()
  router.route('/api').get(async (request, response) => {
    response.status(200).send({ status: 200 })
  })
})
