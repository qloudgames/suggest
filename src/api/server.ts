import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import { routeEntry } from './entry/index';
import { databaseConnector } from './database';
import { RequestLookupStore } from 'common/RequestLookupStore';

const server: FastifyInstance = Fastify({
  logger: {
    level: 'warn',
  },
});
server.register(import('@fastify/rate-limit'), {
  global: false, // setting it on all requests
  max: 100,
  ban: 2, // since ban doesn't work well with distributed system, we'll probably need a update our lookup system for this
  timeWindow: 1000 * 60, // 1 minute 
  store: RequestLookupStore
})
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
