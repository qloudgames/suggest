import { getFakeCommentsFor } from 'common/fakes/fake_comments';
import { FakeEntries } from 'common/fakes/fake_entries';
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

type Params = {
  entryId: string;
};

export function routeGetEntry(server: FastifyInstance) {
  server.get('/entry/:entryId', {}, async (req: FastifyRequest, res: FastifyReply) => {
    // return full entry, including comments
    const params: Params = req.params as Params;
    // TODO: verify params is integer
    const entryId = parseInt(params.entryId);

    // TODO: use database
    // const result = await collection.find().toArray();

    const entry = {
      ...FakeEntries[entryId],
      comments: getFakeCommentsFor(entryId),
    };
    return JSON.stringify(entry);
  });
}
