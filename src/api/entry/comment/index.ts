import { FastifyInstance } from 'fastify';
import { routeAddComment } from './add_comment';
import { routeVoteOnComment } from './vote_comment';

export async function routeEntryComments(server: FastifyInstance) {
  await routeAddComment(server);
  await routeVoteOnComment(server);
}
