import { TagType } from './tags';
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

export function satisfiesTagFilter(tags: TagType[], filters: TagType[]) {
  return filters.length === 0 || tags.find(tag => filters.includes(tag)) != null;
}

export function sanitizeText_Newlines(body: string): string {
  body = body.trim();
  while (body.includes('\n\n\n')) {
    body = body.replace('\n\n\n', '\n\n');
  }
  return body;
}

export function getTimeElapsedText(timestamp: number) {
  let diff = Date.now() - timestamp;
  if (diff < 0) {
    // can occur if os clock is inaccurate
    diff = 0;
  }

  if (diff < 1000) {
    // less than 1 second ago
    return 'just now';
  }

  const seconds = diff / 1000;
  if (seconds < 60) {
    return `${Math.floor(seconds)} sec ago`;
  }
  
  const minutes = seconds / 60;
  if (minutes < 60) {
    return `${Math.floor(minutes)} min${minutes >= 2 ? 's' : ''} ago`;
  }

  const hours = minutes / 60;
  if (hours < 24) {
    return `${Math.floor(hours)} hour${hours >= 2 ? 's' : ''} ago`;
  }

  const days = hours / 24;
  if (days < 7) {
    return `${Math.floor(days)} day${days >= 2 ? 's' : ''} ago`;
  }

  const weeks = days / 7;
  const months = days / 30;
  if (months < 1) {
    return `${Math.floor(weeks)} week${weeks >= 2 ? 's' : ''} ago`;
  }
  if (months < 12) {
    return `${Math.round(months)} month${months >= 2 ? 's' : ''} ago`;
  }

  const years = days / 365;
  return `${Math.floor(years)} years ago`;
}
