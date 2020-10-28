require('dotenv').config({ path: './.env' });
const path = require('path');
const jwt = require('jsonwebtoken');
// const { default: context } = require('jest-plugin-context');
const supertest = require('supertest');
// const chai = require('chai');
const expect = require('chai').expect;
const UserModel = require('../src/api/users/usersModel');
const crudServer = require('../src/server');

describe('Update avatar Test Suite', () => {
  const fileName = 'avatar.jpg';
  const imgFile = path.join(__dirname, `../public/images/${fileName}`);
  let app;
  let response;

  before(async () => {
    const server = await crudServer.setup();
    app = server.app;
  });

  // afterAll(async () => {
  //   await fsPromises.unlink(response.body.localPath);
  // });

  // context('when bad token was provided', () => {
  //   before(async () => {
  //     response = await supertest(app)
  //       .patch('/users/avatar')
  //       .set('Authorization', '')
  //       .attach('avatar', imgFile);
  //   });

  it('should return 401 error when bad token was provided', async () => {
    // expect(response.status).toEqual(401);
    await supertest(app)
      .patch('/users/avatar')
      .set('Authorization', '')
      .attach('avatar', imgFile)
      .expect(401);
  });
  // });

  context('when good token was provided', () => {
    let createdUser, token;
    const newUser = {
      email: 'testUser@email.com',
      password: 'qwerty12',
    };

    before(async () => {
      response = await supertest(app).post('/auth/register').json(newUser);
      createdUser = await UserModel.findById(response.body.id);
      token = jwt.sign({ userId: createdUser.id }, process.env.JWT_SECRET);

      response = await supertest(app)
        .patch('/users/avatar')
        .set('Authorization', `Bearer ${token}`)
        .attach('avatar', imgFile);
    });

    it('should return 200 successfull response', () => {
      // expect(response.status).toEqual(200);
      expect(response.status).to.equal(200);
    });

    it('should return expected result', () => {
      // expect(response.body).toEqual({avatarURL: `http://localhost/images${fileName}`});
      expect(response.body).to.deep.equal({
        avatarURL: `http://localhost/images${fileName}`,
      });
    });

    it("should create new field in user's document", () => {
      // expect(createdUser.avatarURL).toEqual(`http://localhost/images${fileName}`);
      expect(createdUser.avatarURL).to.equal(
        `http://localhost/images${fileName}`,
      );
    });
  });
});
