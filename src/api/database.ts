// ESM
import fastifyPlugin from 'fastify-plugin';
import fastifyMongo from '@fastify/mongodb';
import { FastifyInstance } from 'fastify';

/**
 * @param {FastifyInstance} fastify
 * @param {Object} options
 */
export const databaseConnector = fastifyPlugin(async (fastify: FastifyInstance) => {
  fastify.register(fastifyMongo, {
    url: 'mongodb://localhost:27017/suggest',
  });
});
