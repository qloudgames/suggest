import { getNextCounter } from 'api/database';
import { AddEntryRequest, EntryDataFromServer } from 'common/types';
import { sanitizeText_Newlines } from 'common/util';
import { FastifyInstance, FastifyReply, FastifyRequest, RouteShorthandOptions } from 'fastify';
import { isValidEntryDescription, isValidEntryTags, isValidEntryTitle, isValidName } from '../validation';

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
    const { title, body, name, tags } = JSON.parse(req.body as string) as AddEntryRequest;

    // TODO: use proper fastify verification
    if (!isValidEntryTitle(title)
        || !isValidEntryDescription(body)
        || !isValidName(name)
        || !isValidEntryTags(tags)) {
      res.statusCode = 400;
      return;
    }

    const id = await getNextCounter(server, 'entryId');

    const document: EntryDataFromServer = {
      id,
      title,
      author: name,
      description: sanitizeText_Newlines(body),
      timestamp: Date.now(),
      voteCount: 1, // author automatically upvotes
      numComments: 0,
      tags,
    };
    collection.insertOne({
      ...document,
      comments: [],
    });

    return JSON.stringify({ entryId: id });
  });
}
