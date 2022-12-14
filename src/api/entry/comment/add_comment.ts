import { AddCommentRequest, CommentDataFromServer } from 'common/types';
import { sanitizeText_Newlines } from 'common/util';
import { FastifyInstance, FastifyReply, FastifyRequest, RouteShorthandOptions } from 'fastify';
import { Collection, Document } from 'mongodb';
import { isValidComment, isValidName } from '../../validation';

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

    // TODO: change to using proper fastify verification
    if (typeof entryId !== 'number'
        || !isValidName(name)
        || !isValidComment(comment)) {
      res.statusCode = 400;
      return;
    }
    
    const id = await getNextCommentId(collection, entryId);
    // invalid entryId specified by client
    if (id === -1) {
      res.code(404);
      return;
    }

    const commentDocument: CommentDataFromServer = {
      id,
      author: name,
      comment: sanitizeText_Newlines(comment),
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

    return JSON.stringify({ commentId: id });
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
