const crudServer = require('./src/server');

crudServer
  .setup()
  .then(server => server.startListening())
  .catch(err => console.log('server not setup', err));

process.on('unhandledRejection', err => {
  throw err;
});

process.on('uncaughtException', err => {
  console.log(err);
  if (!err.isOperational) process.exit(1);
});
