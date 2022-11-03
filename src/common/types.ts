export type VoteState = 'like' | 'dislike' | 'none';

export type EntryData = {
  id: number;
  author: string;
  timestamp: number,
  title: string;
  description: string;
  voteCount: number;
  voteState: VoteState;
  numComments: number;
};

export type EntryDataFromServer = Omit<EntryData, 'voteState'>;

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

export type CommentData = {
  id: number;
  author: string;
  timestamp: number;
  comment: string;
  voteCount: number;
  voteState: VoteState;
};

export type FullEntryData = EntryData & {
  comments: CommentData[];
};

export type FullEntryDataFromServer = EntryDataFromServer & {
  comments: CommentDataFromServer[];
};

export type CommentDataFromServer = Omit<CommentData, 'voteState'>;

// network requests
export type AddEntryRequest = {
  title: string;
  name: string;
  body: string;
};

export type AddEntryResponse = {
  entryId: number;
};

export type AddCommentRequest = {
  entryId: number;
  name: string;
  comment: string;
};

export type VoteOnEntryRequest = {
  id: number;
  fromVoteState: VoteState;
  toVoteState: VoteState;
};

export type VoteOnCommentRequest = {
  entryId: number;
  commentId: number;
  fromVoteState: VoteState;
  toVoteState: VoteState;
};
