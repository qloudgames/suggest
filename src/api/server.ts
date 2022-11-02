import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import { routeEntry } from './entry/index';
import { databaseConnector } from './database';

const server: FastifyInstance = Fastify({
  logger: {
    level: 'warn',
  },
});
// server.register(databaseConnector);
server.register(routeEntry);

const start = async () => {
  await server.register(cors, {
    // opts...
  });

  server.log.info('Registering endpoints...');

  try {
    await server.listen({ port: 3000, host: '0.0.0.0' });

    const address = server.server.address();
    const addressStr = typeof address === 'string'
        ? address
        : `${address.address}:${address.port}`;

    server.log.warn(`Server now listening on: ${addressStr}`);

  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

start();
