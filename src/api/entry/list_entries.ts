import { EntryDataFromServer } from 'common/types';
import { FastifyInstance, FastifyReply, FastifyRequest, RouteShorthandOptions } from 'fastify';

const opts: RouteShorthandOptions = {
  // schema: {
  //   response: {
  //     200: {
  //       type: 'object',
  //       properties: {
  //         pong: {
  //           type: 'string'
  //         }
  //       }
  //     }
  //   }
  // }
};

export function routeListEntries(server: FastifyInstance) {
  const collection = server.mongo.db.collection('entries');

  server.get('/', opts, async (req: FastifyRequest, res: FastifyReply) => {

    const results = await collection.find().toArray();

    // TODO: improve performance by not loading comments here (and denormalizing numComments to another field?)
    const entries: EntryDataFromServer[] = results.map(({
      id,
      title,
      author,
      description,
      timestamp,
      voteCount,
      
      // mutate these
      comments,
    }) => ({
      id,
      title,
      author,
      description,
      timestamp,
      voteCount,
      numComments: comments.length,
    }));

    // return list of entries without comments
    return JSON.stringify(entries);
  });
}
