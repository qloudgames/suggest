import { AddCommentRequest, CommentDataFromServer } from 'common/types';
import { FastifyInstance, FastifyReply, FastifyRequest, RouteShorthandOptions } from 'fastify';
import { Collection, Document } from 'mongodb';

const opts: RouteShorthandOptions = {
  schema: {
    response: {
      200: {
        //
      }
    }
  }
};

export function routeAddComment(server: FastifyInstance) {
  const collection = server.mongo.db.collection('entries');

  server.post('/entry/:entryId/comment', {}, async (req: FastifyRequest, res: FastifyReply) => {

    const { entryId, name, comment } = JSON.parse(req.body as string) as AddCommentRequest;

    const id = await getNextCommentId(collection, entryId);
    server.log.warn(`created comment with comment id = ${id}`);
    if (id === -1) {
      res.code(404);
      return;
    }

    const commentDocument: CommentDataFromServer = {
      id,
      author: name,
      comment,
      timestamp: Date.now(),
      voteCount: 1,
    };

    // add to entry
    const result = await collection.updateOne(
      { id: entryId },
      {
        $push: {
          comments: commentDocument,
        },
        $inc: {
          numComments: 1,
        }
      }
    );

    res.code(200);
    // don't return any body
  });
}

async function getNextCommentId(collection: Collection<Document>, entryId: number) {
  const result = await collection.findOne(
    { id: entryId },
  );
  if (result == null) {
    return -1;
  }
  return result.numComments;
}
