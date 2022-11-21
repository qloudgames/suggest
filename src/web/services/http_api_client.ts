import { AddCommentRequest, AddEntryRequest, AddEntryResponse, Category, EntryData, EntryDataFromServer, FullEntryData, FullEntryDataFromServer, ReportEntryRequest, VoteOnCommentRequest, VoteOnEntryRequest } from 'common/types';
import { ApiService } from './api_service';
import { LocalStorageService } from './local_storage_service';

export class HttpApiClient extends LocalStorageService implements ApiService {

  private cachedEntries: {
    hot: { entries?: EntryData[], lastTimestamp: number },
    top: { entries?: EntryData[], lastTimestamp: number },
    new: { entries?: EntryData[], lastTimestamp: number },
  } = {
      hot: { lastTimestamp: 0 },
      top: { lastTimestamp: 0 },
      new: { lastTimestamp: 0 },
    };

  constructor(private readonly baseUrl: string) {
    super();
  }

  async getEntries(category: Category): Promise<EntryData[]> {
    const cache = this.cachedEntries[category];
    const now = Date.now();
    if (now - cache.lastTimestamp < 10000 && cache.entries != null) {
      // prevent firing GetEntries request more than once every 10 seconds
      return cache.entries;
    }
    cache.lastTimestamp = now;

    const res = await fetch(`${this.baseUrl}/list/${category}`);
    const entries: EntryDataFromServer[] = await res.json();
    cache.entries = entries.map(e => ({
      ...e,
      voteState: this.getVoteStateForEntry(e.id),
    }));

    return cache.entries;
  }

  async getEntryDetails(entryId: number): Promise<FullEntryData> {
    const res = await fetch(`${this.baseUrl}/entry/${entryId}`);
    const entry: FullEntryDataFromServer = await res.json();
    return {
      ...entry,
      voteState: this.getVoteStateForEntry(entry.id),
      comments: entry.comments.map(c => ({
        ...c,
        voteState: this.getVoteStateForComment(entry.id, c.id),
      })),
    };
  }

  async addEntry(req: AddEntryRequest): Promise<AddEntryResponse> {
    const { title, name, body, tags } = req;
    const res = await fetch(`${this.baseUrl}/entry/create`, {
      method: 'post',
      body: JSON.stringify({
        title,
        name,
        body,
        tags,
      }),
    });

    // set localStorage to automatically upvote this one
    const { entryId } = await res.json();
    this.updateVoteStateForEntry(entryId, 'like');

    this.clearAllEntriesCaches();

    return { entryId };
  }

  async addComment(req: AddCommentRequest): Promise<void> {
    const { entryId, name, comment } = req;
    const res = await fetch(`${this.baseUrl}/entry/${req.entryId}/comment`, {
      method: 'post',
      body: JSON.stringify({
        entryId,
        name,
        comment,
      }),
    });
    const { commentId } = await res.json();
    this.updateVoteStateForComment(entryId, commentId, 'like');
    this.clearAllEntriesCaches();
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

    this.clearAllEntriesCaches();
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

    this.updateVoteStateForComment(req.entryId, req.commentId, req.toVoteState !== 'none' ? req.toVoteState : undefined);
  }

  /** Clear getEntries() cache whenever we make an action that could affect any data on the homepage's listview */
  private clearAllEntriesCaches(): void {
    this.cachedEntries = {
      hot: { lastTimestamp: 0 },
      top: { lastTimestamp: 0 },
      new: { lastTimestamp: 0 },
    };
  }

  async reportEntry(req: ReportEntryRequest): Promise<void> {
    const res = await fetch(`${this.baseUrl}/entry/${req.entryId}/report`, {
      method: 'post',
      body: JSON.stringify({
        ...req
      })
    });
    if (res.status !== 200) {
      throw Error(`failed to report the entry, status came back as: ${res.status}`);
    }

    this.setReportedEntries(req.entryId);
  }

}
