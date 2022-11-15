import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import { routeEntry } from './entry/index';
import { databaseConnector } from './database';
import { rateLimitOptions } from './config/rate_limit';

const server: FastifyInstance = Fastify({
  logger: {
    level: 'warn',
  },
});
server.register(import('@fastify/rate-limit'), rateLimitOptions)
server.register(databaseConnector);
server.register(routeEntry);

const port = 3000;

async function main() {

  await server.register(cors, {
    // opts...
  });

  try {
    await server.listen({ port, host: '0.0.0.0' });

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

main();
