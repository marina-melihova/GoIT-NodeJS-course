require('dotenv').config({ path: './.env' });
const path = require('path');
const { promises: fsPromises } = require('fs');
const jwt = require('jsonwebtoken');
const supertest = require('supertest');
const UserModel = require('../src/api/users/usersModel');
const CrudServer = require('../src/server');

describe('Update avatar Test Suite', () => {
  const fileName = 'avatar.svg';
  const imgFile = path.join(__dirname, `../public/images/${fileName}`);
  let request;
  let response;

  beforeAll(async () => {
    const server = await new CrudServer().setup();
    request = supertest(server.app);
    process.on('unhandledRejection', console.warn);
    process.on('uncaughtException', console.warn);
  });

  describe('when bad token was provided', () => {
    beforeAll(async () => {
      response = await request
        .patch('/api/v1/users/avatar')
        .set('Authorization', 'Bearer bad_token')
        .attach('avatar', imgFile)
        .set('Connection', 'keep-alive');
    });

    it('should return 401 error', () => {
      expect(response.status).toEqual(401);
    });
  });

  describe('when good token was provided', () => {
    let userDoc, updatedUser, token;

    beforeAll(async () => {
      userDoc = await UserModel.addUser({
        email: 'test@email.com',
        passwordHash: 'password_hash',
      });

      token = jwt.sign({ userId: userDoc._id }, process.env.JWT_SECRET);
      await UserModel.updateToken(userDoc._id, token);

      response = await request
        .patch('/api/v1/users/avatar')
        .set('Authorization', `Bearer ${token}`)
        .attach('avatar', imgFile);
    });

    afterAll(async () => {
      await UserModel.deleteUser(userDoc._id);
      const { base } = path.parse(response.body.avatarURL);
      const testFile = path.join(__dirname, `../public/images/${base}`);
      await fsPromises.unlink(testFile);
    });

    it('should return 200 successfull response', () => {
      expect(response.status).toEqual(200);
    });

    it('should return expected result', () => {
      expect(response.body).toHaveProperty('avatarURL');
    });

    it("should create new field in user's document", async () => {
      updatedUser = await UserModel.getUserById(userDoc._id);
      expect(updatedUser).toHaveProperty('avatarURL');
    });
  });
});
