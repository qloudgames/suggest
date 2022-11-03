import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import { routeEntry } from './entry/index';
import { databaseConnector } from './database';

const server: FastifyInstance = Fastify({
  logger: {
    level: 'warn',
  },
});

server.register(databaseConnector);
server.register(routeEntry);

const port = process.env.NODE_ENV === 'development' ? 3000 : 80;

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
