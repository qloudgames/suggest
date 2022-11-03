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
  commentId: string;
  fromVoteState: VoteState;
  toVoteState: VoteState;
};
type ReqBody = {
  fromVoteState: VoteState;
  toVoteState: VoteState;
}

export function routeVoteOnComment(server: FastifyInstance) {
  const collection = server.mongo.db.collection('entries');

  server.post('/entry/:entryId/comment/:commentId/vote', {}, async (req: FastifyRequest, res: FastifyReply) => {

    const { entryId: _entryId, commentId: _commentId } = req.params as Params;
    const entryId = parseInt(_entryId);
    const commentId = parseInt(_commentId);
    const { fromVoteState = 'none', toVoteState = 'none' } = JSON.parse(req.body as string) as ReqBody;

    const voteChange = calculateVoteCountChange(fromVoteState, toVoteState);
    if (voteChange === 0)
      return;
    
    await collection.updateOne(
      { id: entryId, "comments.id": commentId },
      {
        $inc: {
          "comments.$.voteCount": voteChange,
        },
      }
    );

    res.code(200);
    // don't return any body
  });
}
