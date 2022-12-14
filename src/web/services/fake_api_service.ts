import { getFakeCommentsFor } from 'common/fakes/fake_comments';
import { FakeEntries } from 'common/fakes/fake_entries';
import { AddCommentRequest, AddEntryRequest, AddEntryResponse, EntryData, FullEntryData, ReportEntryRequest, VoteOnCommentRequest, VoteOnEntryRequest } from 'common/types';
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
        voteState: this.getVoteStateForComment(entryId, c.id),
      })),
    };
  }

  async addEntry(req: AddEntryRequest): Promise<AddEntryResponse> {
    await wait(300);
    // TODO: make creating posts work in fake mode
    return {
      entryId: 5,
    };
  }

  async addComment(req: AddCommentRequest): Promise<void> {
    const { entryId, name, comment } = req;
    await wait(100);
    // TODO: make commenting work in fake mode
  }

  async voteOnEntry(req: VoteOnEntryRequest): Promise<void> {
    await wait(100);
    this.updateVoteStateForEntry(req.id, req.toVoteState !== 'none' ? req.toVoteState : undefined);
  }

  async voteOnComment(req: VoteOnCommentRequest): Promise<void> {
    await wait(100);
    this.updateVoteStateForComment(req.entryId, req.commentId, req.toVoteState !== 'none' ? req.toVoteState : undefined);
  }

  async reportEntry(req: ReportEntryRequest): Promise<void> {
    await wait(100);
    // TODO: make reporting work in fake mode
  }
}
