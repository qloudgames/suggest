import { VoteState } from "web/vote";

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
};

export type VoteAction = 'like' | 'dislike' | 'clear';

// network requests
export type VoteOnEntryRequest = {
  id: number;
  voteAction: VoteAction;
};
