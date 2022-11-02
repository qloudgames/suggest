import { FastifyInstance } from 'fastify';
import { MongoClient } from 'mongodb';

const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);
const dbName = 'suggest';

export const connectToDatabase = async (server: FastifyInstance) => {
  await client.connect();
  
  server.log.warn('connected to database server!');
};
