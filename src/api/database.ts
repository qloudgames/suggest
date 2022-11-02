import { FastifyInstance } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import fastifyMongo from '@fastify/mongodb';

export const databaseConnector = fastifyPlugin(async (fastify: FastifyInstance) => {
  fastify.register(fastifyMongo, {
    url: 'mongodb://127.0.0.1:27017/suggest',
  });
});

type CounterType = 'entryId' | 'commentId';

export async function getNextCounter(server: FastifyInstance, counterType: CounterType): Promise<number> {
  const counters = server.mongo.db.collection('counters');
  const result = await counters.findOne({ name: counterType });

  if (result == null) {
    // first one
    counters.insertOne({
      name: counterType,
      value: 1,
    });
    return 1;
  }

  // increment and update db
  const newId = result.value + 1;
  // make sure to await return to prevent race conditions
  await counters.updateOne(
    { _id: result._id },
    {
      $set: { value: newId },
    }
  );

  return newId;
}
