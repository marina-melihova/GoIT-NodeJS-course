const express = require('express');
const { contactsRouter, authRouter, usersRouter } = require('./api');

const app = express();
app.use('/contacts', contactsRouter);
app.use('/auth', authRouter);
app.use('/users', usersRouter);

module.exports = app;
