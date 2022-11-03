import { getNextCounter } from 'api/database';
import { AddEntryRequest, EntryDataFromServer } from 'common/types';
import { sanitizeText_Newlines } from 'common/util';
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
      description: sanitizeText_Newlines(body),
      timestamp: Date.now(),
      voteCount: 1, // author automatically upvotes
      numComments: 0,
    };
    collection.insertOne({
      ...document,
      comments: [],
    });

    return JSON.stringify({ entryId: id });
  });
}
