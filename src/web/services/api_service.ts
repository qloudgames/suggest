import { EntryData, FullEntryData, VoteOnCommentRequest, VoteOnEntryRequest } from 'common/types';

export type ApiService = {

  getEntries(): Promise<EntryData[]>;

  getEntryDetails(entryId: number): Promise<FullEntryData>;

  voteOnEntry(req: VoteOnEntryRequest): Promise<void>;

  voteOnComment(req: VoteOnCommentRequest): Promise<void>;
};
