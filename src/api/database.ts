import { FastifyInstance } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import fastifyMongo from '@fastify/mongodb';

export const databaseConnector = fastifyPlugin(async (fastify: FastifyInstance) => {
  fastify.register(fastifyMongo, {
    url: 'mongodb://127.0.0.1:27017/suggest',
  });
});
