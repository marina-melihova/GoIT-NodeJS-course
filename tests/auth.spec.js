require('dotenv').config({ path: './.env' });
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const { assert } = require('chai');
const { authorize } = require('../src/helpers/authorize');
const UserModel = require('../src/api/users/usersModel');
const AppError = require('../src/helpers/appError');

describe('Authmiddleware test suite', () => {
  let sandbox;
  let getUserByIdStub;
  let nextStub;

  before(async () => {
    sandbox = sinon.createSandbox();
    getUserByIdStub = sandbox.stub(UserModel, 'getUserById');
    nextStub = sandbox.stub();
  });

  after(() => {
    sandbox.restore();
  });

  context('when auth header not provided', () => {
    const request = { headers: { authorization: '' } };

    before(async () => {
      await authorize(request, null, nextStub);
    });

    after(() => {
      sandbox.reset();
    });

    it('should not call getUserById', () => {
      sinon.assert.notCalled(getUserByIdStub);
    });

    it('request should contain user info', () => {
      assert.strictEqual(request.user, undefined);
    });

    it('should call next once', () => {
      sinon.assert.calledOnce(nextStub);
      sinon.assert.calledWithExactly(
        nextStub,
        sinon.match.instanceOf(AppError),
      );
    });
  });

  context('when token verification fails', () => {
    const request = { headers: { authorization: 'Bearer test_token' } };

    before(async () => {
      await authorize(request, null, nextStub);
    });

    after(() => {
      sandbox.reset();
    });

    it('should not call getUserById', () => {
      sinon.assert.notCalled(getUserByIdStub);
    });

    it('request should not contain user info', () => {
      assert.strictEqual(request.user, undefined);
    });

    it('should call next once', () => {
      sinon.assert.calledOnce(nextStub);
      sinon.assert.calledWithExactly(
        nextStub,
        sinon.match.instanceOf(AppError),
      );
    });
  });

  context('when corresponding user not found', () => {
    const token = jwt.sign({ userId: 'user_id' }, process.env.JWT_SECRET);
    const request = { headers: { authorization: `Bearer ${token}` } };

    before(async () => {
      await authorize(request, null, nextStub);
    });

    after(() => {
      sandbox.reset();
    });

    it('should call getUserById once', () => {
      sinon.assert.calledOnce(getUserByIdStub);
      sinon.assert.calledWithExactly(getUserByIdStub, 'user_id');
    });

    it('request should not contain user info', () => {
      assert.strictEqual(request.user, undefined);
    });

    it('should call next once', () => {
      sinon.assert.calledOnce(nextStub);
      sinon.assert.calledWithExactly(
        nextStub,
        sinon.match.instanceOf(AppError),
      );
    });
  });

  context('when user with this token has already logged out', () => {
    const token = jwt.sign({ userId: 'user_id' }, process.env.JWT_SECRET);
    const request = { headers: { authorization: `Bearer ${token}` } };
    const user = {
      id: 'user_id',
      token: null,
    };

    before(async () => {
      getUserByIdStub.resolves(user);
      await authorize(request, null, nextStub);
    });

    after(() => {
      sandbox.reset();
    });

    it('should call getUserById once', () => {
      sinon.assert.calledOnce(getUserByIdStub);
      sinon.assert.calledWithExactly(getUserByIdStub, user.id);
    });

    it('request should not contain user info', () => {
      assert.strictEqual(request.user, undefined);
    });

    it('should call next once', () => {
      sinon.assert.calledOnce(nextStub);
      sinon.assert.calledWithExactly(
        nextStub,
        sinon.match.instanceOf(AppError),
      );
    });
  });

  context('when everything is OK', () => {
    const token = jwt.sign({ userId: 'user_id' }, process.env.JWT_SECRET);
    const request = { headers: { authorization: `Bearer ${token}` } };
    const user = {
      id: 'user_id',
      token: token,
    };

    before(async () => {
      getUserByIdStub.resolves(user);
      await authorize(request, null, nextStub);
    });

    after(() => {
      sandbox.reset();
    });

    it('should call getUserById once', () => {
      sinon.assert.calledOnce(getUserByIdStub);
      sinon.assert.calledWithExactly(getUserByIdStub, user.id);
    });

    it('request should contain user info', () => {
      assert.strictEqual(request.user, user);
    });

    it('should call next once', () => {
      sinon.assert.calledOnce(nextStub);
      sinon.assert.calledWithExactly(nextStub);
    });
  });
});
