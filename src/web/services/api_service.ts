import { EntryData, VoteOnEntryRequest } from 'common/types';
import { ILocalStorageService } from './local_storage_service';

export type ApiService = ILocalStorageService & {

  getEntries(): Promise<EntryData[]>;

  voteOnEntry(req: VoteOnEntryRequest): Promise<void>;
};
