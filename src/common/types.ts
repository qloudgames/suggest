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

export type Category = 'top' | 'hot' | 'new';

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
