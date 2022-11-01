import { FakeEntries } from 'common/fakes/fake_entries';
import { EntryData, VoteOnEntryRequest } from 'common/types';
import { ApiService } from './api_service';
import { LocalStorageService } from './local_storage_service';

export class FakeApiService extends LocalStorageService implements ApiService {

  async getEntries(): Promise<EntryData[]> {
    await new Promise(res => setTimeout(res, 500));
    return FakeEntries.map(e => ({
      ...e,
      voteState: this.getVoteStateForEntry(e.id),
    }));
  }

  async voteOnEntry(req: VoteOnEntryRequest): Promise<void> {
    await new Promise(res => setTimeout(res, 100));

    this.updateVoteStateForEntry(req.id, req.voteAction !== 'clear' ? req.voteAction : undefined);
  }
}
