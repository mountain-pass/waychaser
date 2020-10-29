import { Given, When, Then } from 'cucumber';
// eslint-disable-next-line no-unused-vars
import { PORT } from './config';

Given('a API returning {int}', async function (status) {
  await this.router.route('/').get(async (request, response) => {
    response.status(status).send({ status });
  });
  // .all((request, res) => {
  //   res.status(406).send({});
  // });
});

When('we try to load that API', async function () {
  this.attempt = this.waychaser.load(`http://localhost:${PORT}`);
});

Then('the API will load successfully', { timeout: 40000 }, async function () {
  await expect(this.attempt).to.not.be.rejectedWith(Error);
});

Then('the API will NOT load successfully', async function () {
  await expect(this.attempt).to.be.rejectedWith(Error);
});
