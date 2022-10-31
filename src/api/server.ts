// Require the framework and instantiate it
import fastify from 'fastify';

const fast = fastify({ log: true });

// Declare a route
fast.get('/', async (request, reply) => {
  return { hello: 'world' }
});

// Run the server!
const start = async () => {
  try {
    await fast.listen({ port: 3000 })
  } catch (err) {
    fast.log.error(err)
    process.exit(1)
  }
};
start();
