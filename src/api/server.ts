import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import { routeEntry } from './entry/index';
import { connectToDatabase } from './database';

async function main() {
  const server: FastifyInstance = Fastify({
    logger: {
      level: 'warn',
    },
  });

  connectToDatabase(server);

  server.register(routeEntry);

  await server.register(cors, {
    // opts...
  });

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

main();
