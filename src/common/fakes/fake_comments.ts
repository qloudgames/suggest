import { CommentDataFromServer } from 'common/types';

export function getFakeCommentsFor(entryId: number): CommentDataFromServer[] {
  const comments = [];
  const numComments = 10;

  for (let i = 0; i < numComments; i++) {
    const randAuthorId = Math.floor(Math.random() * 100);
    comments.push({
      id: (entryId * 10000) + i,
      author: `someone_${randAuthorId}`,
      timestamp: Date.now(),
      comment: `This is a pretty cool idea, I support this! - commenter_${randAuthorId}`,
      voteCount: Math.floor(Math.random() * 50),
    });
  }

  return comments;
}
