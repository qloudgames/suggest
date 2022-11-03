import { VoteState } from './types';

export function calculateVoteCountChange(fromState: VoteState, toState: VoteState) {
  return voteStateToCount(toState) - voteStateToCount(fromState);
}

function voteStateToCount(state: VoteState) {
  switch (state) {
    case 'like':
      return 1;
    case 'dislike':
      return -1;
    default:
      return 0;
  }
}

export function sanitizeText_Newlines(body: string): string {
  body = body.trim();
  while (body.includes('\n\n\n')) {
    body = body.replace('\n\n\n', '\n\n');
  }
  return body;
}
