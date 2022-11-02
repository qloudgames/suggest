import { VoteState } from 'common/types';

/** Extended by both the HttpApiClient and the FakeApiService */
export class LocalStorageService {
  
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

  getVoteStateForComment(commentId: number): VoteState {
    const result = this.storage.getItem(`vc_${commentId}`) as VoteState;
    switch (result) {
      case 'like':
      case 'dislike':
        return result;
      default:
        return undefined;
    }
  }

  updateVoteStateForComment(commentId: number, voteState: VoteState): void {
    this.storage.setItem(`vc_${commentId}`, voteState);
  }

  getLocalName(): string {
    return this.storage.getItem('local_name') || '';
  }

  setLocalName(name: string) {
    this.storage.setItem('local_name', name);
  }
}
