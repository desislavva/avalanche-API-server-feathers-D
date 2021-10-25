/* eslint-disable no-console */
const logger = require('./logger');
const app = require('./app');

const dotenv = require('dotenv');
dotenv.config();

const websocketServer = require('./websocket');

const port = process.env.SERVER_PORT;

const server = app.listen(port);


process.on('unhandledRejection', (reason, p) =>
  logger.error('Unhandled Rejection at: Promise ', p, reason)
);

server.on('listening', () =>
  logger.info('Feathers application started on http://%s:%d', app.get('host'), port)
);
