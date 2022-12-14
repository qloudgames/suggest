import { getFakeCommentsFor } from 'common/fakes/fake_comments';
import { FakeEntries } from 'common/fakes/fake_entries';
import { FullEntryDataFromServer } from 'common/types';
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
  const collection = server.mongo.db.collection('entries');

  server.get('/entry/:entryId', {}, async (req: FastifyRequest, res: FastifyReply) => {
    // return full entry, including comments
    const params: Params = req.params as Params;
    // TODO: verify params is integer
    const entryId = parseInt(params.entryId);

    const result = await collection.findOne(
      { id: entryId },
    );

    if (result == null) {
      res.code(404);
      return;
    }

    const {
      id,
      title,
      author,
      description,
      timestamp,
      voteCount,
      comments,
      tags = [], // backwards-compat
    } = result;
    const entry: FullEntryDataFromServer = {
      id,
      title,
      author,
      description,
      timestamp,
      voteCount,
      tags,
      comments: comments.map(({ id, author, timestamp, comment, voteCount: commentVoteCount }: any) => ({
        // intentionally omitting _id
        id,
        author,
        timestamp,
        comment,
        voteCount: commentVoteCount,
      })),
      numComments: comments.length,
    };
    
    return JSON.stringify(entry);
  });
}
