const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { contactsRouter } = require('./contacts/contacts.router');

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  { flags: 'a' },
);

class CrudServer {
  constructor() {
    this.app = null;
  }

  async start() {
    this.initServer();
    await this.initDatabase();
    this.initMiddlewares();
    this.initRouters();
    this.initErrorHandling();
    this.startListening();
  }

  initServer() {
    this.app = express();
  }

  async initDatabase() {
    try {
      mongoose.set('useCreateIndex', true);
      await mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      });
    } catch (err) {
      console.log(err);
      process.exit(1);
    }
  }

  initMiddlewares() {
    this.app.use(cors({ origin: process.env.ORIGIN }));
    this.app.use(express.json());
    this.app.use(morgan('combined', { stream: accessLogStream }));
  }

  initRouters() {
    this.app.use('/api/contacts', contactsRouter);
    this.app.use((req, res) =>
      res.status(404).json({
        message: 'Not found',
        description: 'The resource you tried to access does not exist.',
      }),
    );
  }

  initErrorHandling() {
    this.app.use((err, req, res, next) => {
      const statusCode = err.status || 500;
      res.status(statusCode);
      res.json({ message: err.message });
    });
  }

  startListening() {
    this.app.listen(process.env.PORT, () => {
      console.log('Server started listening on port', process.env.PORT);
    });
  }
}

exports.CrudServer = CrudServer;
exports.crudServer = new CrudServer();
