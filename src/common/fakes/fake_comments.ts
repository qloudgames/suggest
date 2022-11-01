import { CommentData } from 'common/types';

export function getFakeCommentsFor(entryId: number): CommentData[] {
  const comments = [];
  const numComments = Math.ceil(Math.random() * 10);

  for (let i = 0; i < numComments; i++) {
    const randId = Math.floor(Math.random() * 100);
    const randAuthorId = Math.floor(Math.random() * 100);
    comments.push({
      id: randId,
      author: `someone_${randAuthorId}`,
      timestamp: Date.now(),
      comment: `This is a pretty cool idea, I support this! - commenter_${randAuthorId}`,
    });
  }

  return comments;
}
