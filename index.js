const CrudServer = require('./src/server');

new CrudServer()
  .setup()
  .then(server => server.startListening())
  .catch(console.log);

process.on('unhandledRejection', err => {
  throw err;
});

process.on('uncaughtException', err => {
  console.log(err);
  if (!err.isOperational) process.exit(1);
});
