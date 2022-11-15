import { VoteState } from 'common/types';
import { calculateVoteCountChange } from 'common/util';
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
  fromVoteState: VoteState;
  toVoteState: VoteState;
};
type ReqBody = {
  fromVoteState: VoteState;
  toVoteState: VoteState;
}

export function routeVoteOnEntry(server: FastifyInstance) {
  const collection = server.mongo.db.collection('entries');

  const options = {
    config: {
      rateLimit: {
        // referencing the options from global rate_limit config
      }
    }
  }

  server.post('/entry/:entryId/vote', options, async (req: FastifyRequest, res: FastifyReply) => {

    const { entryId: _entryId } = req.params as Params;
    const entryId = parseInt(_entryId);
    const { fromVoteState = 'none', toVoteState = 'none' } = JSON.parse(req.body as string) as ReqBody;

    const voteChange = calculateVoteCountChange(fromVoteState, toVoteState);
    if (voteChange === 0)
      return;

    await collection.updateOne(
      { id: entryId },
      {
        $inc: {
          voteCount: voteChange,
        },
      }
    );

    res.code(200);
    // don't return any body
  });
}
