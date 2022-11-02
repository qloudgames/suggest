export type VoteState = 'like' | 'dislike' | undefined;

export type EntryData = {
  id: number;
  author: string;
  timestamp: number,
  title: string;
  description: string;
  voteCount: number;
  voteState: VoteState;
};

export type EntryDataFromServer = Omit<EntryData, 'voteState'>;

export function getEntryTimeElapsed(entry: EntryData) {
  return '12 days';
}

export type CommentData = {
  id: number;
  author: string;
  timestamp: number;
  comment: string;
  voteState: VoteState;
};

export type FullEntryData = EntryData & {
  comments: CommentData[];
};

export type FullEntryDataFromServer = EntryDataFromServer & {
  comments: CommentDataFromServer[];
};

export type CommentDataFromServer = Omit<CommentData, 'voteState'>;

export type VoteAction = 'like' | 'dislike' | 'clear';

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
  voteAction: VoteAction;
};

export type VoteOnCommentRequest = {
  id: number;
  voteAction: VoteAction;
};
