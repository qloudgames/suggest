import { AddCommentRequest, AddEntryRequest, AddEntryResponse, EntryData, FullEntryData, VoteOnCommentRequest, VoteOnEntryRequest } from 'common/types';

export type ApiService = {

  getEntries(): Promise<EntryData[]>;

  getEntryDetails(entryId: number): Promise<FullEntryData>;

  addEntry(req: AddEntryRequest): Promise<AddEntryResponse>;

  voteOnEntry(req: VoteOnEntryRequest): Promise<void>;

  voteOnComment(req: VoteOnCommentRequest): Promise<void>;

  addComment(req: AddCommentRequest): Promise<void>;

  getLocalName(): string;

  setLocalName(name: string): void;
};
