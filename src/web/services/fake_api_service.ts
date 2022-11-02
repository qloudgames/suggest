import { getFakeCommentsFor } from 'common/fakes/fake_comments';
import { FakeEntries } from 'common/fakes/fake_entries';
import { EntryData, FullEntryData, VoteOnCommentRequest, VoteOnEntryRequest } from 'common/types';
import { ApiService } from './api_service';
import { LocalStorageService } from './local_storage_service';

async function wait(ms: number): Promise<void> {
  return new Promise(res => setTimeout(res, ms));
}

export class FakeApiService extends LocalStorageService implements ApiService {

  async getEntries(): Promise<EntryData[]> {
    await wait(500);
    return FakeEntries.map(e => ({
      ...e,
      voteState: this.getVoteStateForEntry(e.id),
    }));
  }

  async getEntryDetails(entryId: number): Promise<FullEntryData> {
    await wait(100);
    return {
      ...FakeEntries[entryId],
      voteState: this.getVoteStateForEntry(entryId),
      comments: getFakeCommentsFor(entryId).map(c => ({
        ...c,
        voteState: this.getVoteStateForComment(c.id),
      })),
    };
  }

  async voteOnEntry(req: VoteOnEntryRequest): Promise<void> {
    await wait(100);
    this.updateVoteStateForEntry(req.id, req.voteAction !== 'clear' ? req.voteAction : undefined);
  }

  async voteOnComment(req: VoteOnCommentRequest): Promise<void> {
    await wait(100);
    this.updateVoteStateForComment(req.id, req.voteAction !== 'clear' ? req.voteAction : undefined);
  }
}
