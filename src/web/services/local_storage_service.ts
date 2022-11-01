import { VoteState } from 'web/vote';

export interface ILocalStorageService {
  getVoteStateForEntry(entryId: number): VoteState;

  updateVoteStateForEntry(entryId: number, voteState: VoteState): void;
}

/** Extended by both the HttpApiClient and the FakeApiService */
export class LocalStorageService implements ILocalStorageService {
  
  private readonly storage: Storage;

  constructor() {
    this.storage = window.localStorage;
  }

  getVoteStateForEntry(entryId: number): VoteState {
    const result = this.storage.getItem(`v_${entryId}`) as VoteState;
    switch (result) {
      case 'like':
      case 'dislike':
        return result;
      default:
        return undefined;
    }
  }

  updateVoteStateForEntry(entryId: number, voteState: VoteState): void {
    this.storage.setItem(`v_${entryId}`, voteState);
  }
}
