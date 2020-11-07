import { resetRouter, startServer } from '../src/test/server';

console.log('DEVELOPMENT SERVER STARTED');

startServer();
const router = resetRouter();
router.route('/').get(async (request, response) => {
  response.status(200).send({ status: 200 });
});
