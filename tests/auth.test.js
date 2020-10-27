// const path = require('path');
require('dotenv').config({ path: './.env' });

const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const chai = require('chai');
const { authorize } = require('../src/helpers/authorize');
const UserModel = require('../src/api/users/usersModel');

describe('Authmiddleware test suite', () => {
  context('No auth header provided', () => {
    let sandbox;

    const req = { headers: {} };
    let res;
    let next;

    before(async () => {
      sandbox = sinon.createSandbox();
      res = { status: sandbox.stub(), send: sandbox.stub() };
      res.status.returns(res);
      next = sandbox.stub();
      sandbox.stub(UserModel, 'getUserById');

      await authorize(req, res, next);
    });

    after(() => {
      sandbox.restore();
    });

    it('should call res.status once', () => {
      sinon.assert.calledOnce(res.status);
      sinon.assert.calledWithExactly(res.status, 401);
    });
    it('should call res.send once', () => {
      sinon.assert.calledOnce(res.send);
    });

    it('should not call findById', () => {
      sinon.assert.notCalled(UserModel.getUserById);
    });
    it('should not call next()', () => {
      sinon.assert.notCalled(next);
    });
  });

  context('jwt token is invalid', () => {
    let sandbox;

    const req = { headers: { authorization: '' } };
    let res;
    let next;

    before(async () => {
      sandbox = sinon.createSandbox();
      res = { status: sandbox.stub(), send: sandbox.stub() };
      res.status.returns(res);
      next = sandbox.stub();
      sandbox.stub(UserModel, 'getUserById');

      await authorize(req, res, next);
    });

    after(() => {
      sandbox.restore();
    });

    it('should call res.status once', () => {
      sinon.assert.calledOnce(res.status);
      sinon.assert.calledWithExactly(res.status, 401);
    });
    it('should call res.send once', () => {
      sinon.assert.calledOnce(res.send);
    });

    it('should not call findById', () => {
      sinon.assert.notCalled(UserModel.getUserById);
    });
    it('should not call next()', () => {
      sinon.assert.notCalled(next);
    });
  });

  context('everything is ok', () => {
    let sandbox;

    const userId = 'user_id';
    const user = { id: 'users_info_from_DB' };
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET);
    const req = { headers: { authorization: `Bearer ${token}` } };
    let res;
    let next;

    before(async () => {
      sandbox = sinon.createSandbox();
      res = { status: sandbox.stub(), send: sandbox.stub() };
      res.status.returns(res);
      next = sandbox.stub();
      sandbox.stub(UserModel, 'getUserById').resolves(user);

      await authorize(req, res, next);
    });

    after(() => {
      sandbox.restore();
    });

    it('should not call res.status once', () => {
      sinon.assert.notCalled(res.status);
    });
    it('should not call res.send once', () => {
      sinon.assert.notCalled(res.send);
    });

    it('should call findById once', () => {
      sinon.assert.calledOnce(UserModel.getUserById);
      sinon.assert.calledWithExactly(UserModel.getUserById, userId);
    });

    it('should pass user to req', () => {
      chai.assert.equal(req.user, user);
    });

    it('should call next() once', () => {
      sinon.assert.calledOnce(next);
      sinon.assert.calledWithExactly(next);
    });
  });
});
