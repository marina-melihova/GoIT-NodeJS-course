require('dotenv').config({ path: './.env' });
// const path = require('path');
const jwt = require('jsonwebtoken');
const { default: context } = require('jest-plugin-context');
const supertest = require('supertest');
// const chai = require('chai');
const expect = require('chai').expect;
const UserModel = require('../src/api/users/usersModel');
const crudServer = require('../src/server');

describe('Update avatar Test Suite', () => {
  const fileName = 'avatar.svg';
  // const imgFile = path.join(__dirname, `../public/images/${fileName}`);
  const imgFile = `./public/images/${fileName}`;
  let app;
  let server;
  let request;
  let response;

  beforeAll(async () => {
    server = await crudServer.setup();
    app = server.app;
    request = supertest(app);
  });

  context('when bad token was provided', () => {
    before(async () => {
      response = await supertest(server)
        .patch('/api/v1/users/avatar')
        .set('Authorization', '')
        .attach('avatar', imgFile);
    });

    it('should return 401 error', () => {
      expect(response.status).toEqual(401);
    });
  });

  context('when good token was provided', () => {
    // const newUser = {
    //   email: 'testUser@email.com',
    //   password: 'qwerty12',
    // };
    const userDoc = await userModel.create({
      email: 'testUser@email.com',
      passwordHash: 'password_hash',
    });

    let createdUser, token;

    beforeAll(async () => {
      createdUser = await UserModel.getUserByEmail('testUser@email.com'); //?
      console.log(createdUser); //?
      token = jwt.sign({ userId: createdUser.id }, process.env.JWT_SECRET);

      response = await supertest(server)
        .patch('/users/avatar')
        .set('Authorization', `Bearer ${token}`)
        .attach('avatar', imgFile);
      
      updatedUser = await UserModel.getUserById(createdUser.id); //?
    });

    // after(async () => {
    //   await userModel.findByIdAndDelete(userDoc._id);
    // });

    it('should return 200 successfull response', () => {
      expect(response.status).toEqual(200);
    });

    it('should return expected result', () => {
      expect(response.body).toHaveProperty(avatarURL);
    });

    it("should create new field in user's document", () => {
      expect(updatedUser).toHaveProperty(avatarURL);
    });
  });
});
