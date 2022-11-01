import { EntryData, EntryDataFromServer, VoteOnEntryRequest } from 'common/types';
import { ApiService } from './api_service';
import { LocalStorageService } from './local_storage_service';

export class HttpApiClient extends LocalStorageService implements ApiService {

  private lastGetEntriesTimestamp: number = 0;
  private cachedGetEntries: EntryData[] = [];

  constructor(private readonly baseUrl: string) {
    super();
  }

  async getEntries(): Promise<EntryData[]> {
    const now = Date.now();
    if (now - this.lastGetEntriesTimestamp < 10000) {
      // prevent firing GetEntries request more than once every 10 seconds
      return this.cachedGetEntries;
    }
    this.lastGetEntriesTimestamp = now;

    const res = await fetch(this.baseUrl);
    const entries: EntryDataFromServer[] = await res.json();
    this.cachedGetEntries = entries.map(e => ({
      ...e,
      voteState: this.getVoteStateForEntry(e.id),
    }));
    return this.cachedGetEntries;
  }

  async voteOnEntry(req: VoteOnEntryRequest): Promise<void> {
    const res = await fetch(`${this.baseUrl}/entries/vote?id=${req.id}&action=${req.voteAction}`);
    if (res.status !== 200) {
      throw Error(`failed to vote, status came back as: ${res.status}`);
    }
    
    this.updateVoteStateForEntry(req.id, req.voteAction !== 'clear' ? req.voteAction : undefined);
  }
}
