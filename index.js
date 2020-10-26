const crudServer = require('./src/server');
crudServer.setup();
crudServer.startListening();

process.on('unhandledRejection', err => {
  throw err;
});

process.on('uncaughtException', err => {
  console.log(err);
  if (!err.isOperational) process.exit(1);
});
