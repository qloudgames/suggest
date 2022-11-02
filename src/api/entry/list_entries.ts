import { FakeEntries } from 'common/fakes/fake_entries';
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

    // return list of entries without comments
    return JSON.stringify(results);
  });
}
