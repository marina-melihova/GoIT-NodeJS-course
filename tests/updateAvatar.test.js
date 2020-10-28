const supertest = require('supertest');
const crudServer = require('../src/server');

describe('Update avatar Test Suite', () => {
  let app;
  let response;

  beforeAll(async () => {
    await crudServer.setup();
    app = crudServer.app;
    request = supertest(server);

    response = await request
      .post('/sign-up')
      .field('username', 'user1')
      .field('password', 'qwerty')
      .attach('avatar', '1603529226139.jpg');
  });

  afterAll(async () => {
    await fsPromises.unlink(response.body.localPath);
  });

  it('should return 200', () => {
    expect(response.status).toEqual(200);
  });

  it('should save file', async () => {
    const localPath = response.body.localPath;
    await fsPromises.lstat(localPath);
  });
});
