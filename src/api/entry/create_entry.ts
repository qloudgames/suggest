import { getNextCounter } from 'api/database';
import { AllTags, MaxTagsPerEntry, TagType } from 'common/tags';
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
    const { title, body, name, tags } = JSON.parse(req.body as string) as AddEntryRequest;

    // verification for tags
    if (!Array.isArray(tags) || tags.length > MaxTagsPerEntry || !tags.every(tag => AllTags.includes(tag))) {
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
