import { getNextCounter } from 'api/database';
import { AddEntryRequest, EntryDataFromServer } from 'common/types';
import { FastifyInstance, FastifyReply, FastifyRequest, RouteShorthandOptions } from 'fastify';

const opts: RouteShorthandOptions = {
  schema: {
    response: {
      200: {
        //
      }
    }
  }
};

export function routeCreateEntry(server: FastifyInstance) {
  const collection = server.mongo.db.collection('entries');

  server.post('/entry/create', {}, async (req: FastifyRequest, res: FastifyReply) => {
    const { title, body, name } = JSON.parse(req.body as string) as AddEntryRequest;

    const id = await getNextCounter(server, 'entryId');

    const document: EntryDataFromServer = {
      id,
      title,
      author: name,
      description: body,
      timestamp: Date.now(),
      voteCount: 1, // author automatically upvotes
    };
    collection.insertOne(document);

    return JSON.stringify({ entryId: id });
  });
}
