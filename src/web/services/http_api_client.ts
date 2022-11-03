import { AddCommentRequest, AddEntryRequest, AddEntryResponse, EntryData, EntryDataFromServer, FullEntryData, FullEntryDataFromServer, VoteOnCommentRequest, VoteOnEntryRequest } from 'common/types';
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

    if (this.cachedGetEntries && this.cachedGetEntries.findIndex(e => e.id === 1) !== -1) {
      const theVoteState = this.cachedGetEntries.find(e => e.id === 1).voteState;
      console.log('ApiClient.getEntries() returning! voteState for entry 1 is: ' + theVoteState);
    }

    return this.cachedGetEntries;
  }

  async getEntryDetails(entryId: number): Promise<FullEntryData> {
    const res = await fetch(`${this.baseUrl}/entry/${entryId}`);
    const entry: FullEntryDataFromServer = await res.json();
    return {
      ...entry,
      voteState: this.getVoteStateForEntry(entry.id),
      comments: entry.comments.map(c => ({
        ...c,
        voteState: this.getVoteStateForComment(c.id),
      })),
    };
  }

  async addEntry(req: AddEntryRequest): Promise<AddEntryResponse> {
    const { title, name, body } = req;
    const res = await fetch(`${this.baseUrl}/entry/create`, {
      method: 'post',
      body: JSON.stringify({
        title,
        name,
        body,
      }),
    });

    // set localStorage to automatically upvote this one
    const { entryId } = await res.json();
    this.updateVoteStateForEntry(entryId, 'like');

    this.clearGetEntriesCache();

    return { entryId };
  }

  async addComment(req: AddCommentRequest): Promise<void> {
    const { entryId, name, comment } = req;
    await fetch(`${this.baseUrl}/entry/${req.entryId}/comment`, {
      method: 'post',
      body: JSON.stringify({
        entryId,
        name,
        comment,
      }),
    });
    this.clearGetEntriesCache();
  }

  async voteOnEntry(req: VoteOnEntryRequest): Promise<void> {
    const res = await fetch(`${this.baseUrl}/entry/${req.id}/vote`, {
      method: 'post',
      body: JSON.stringify({
        fromVoteState: req.fromVoteState,
        toVoteState: req.toVoteState,
      }),
    });
    if (res.status !== 200) {
      throw Error(`failed to vote on entry, status came back as: ${res.status}`);
    }
    
    this.updateVoteStateForEntry(req.id, req.toVoteState);
    console.log('set vote state for entry ' + req.id + ' to: ' + req.toVoteState);

    this.clearGetEntriesCache();
  }

  async voteOnComment(req: VoteOnCommentRequest): Promise<void> {
    const res = await fetch(`${this.baseUrl}/entry/${req.entryId}/comment/${req.commentId}/vote`, {
      method: 'post',
      body: JSON.stringify({
        fromVoteState: req.fromVoteState,
        toVoteState: req.toVoteState,
      }),
    });
    if (res.status !== 200) {
      throw Error(`failed to vote on comment, status came back as: ${res.status}`);
    }
    
    this.updateVoteStateForComment(req.commentId, req.toVoteState !== 'none' ? req.toVoteState : undefined);
  }

  /** Clear getEntries() cache whenever we make an action that could affect any data on the homepage's listview */
  private clearGetEntriesCache(): void {
    this.lastGetEntriesTimestamp = 0;
    this.cachedGetEntries = [];
  }
}
