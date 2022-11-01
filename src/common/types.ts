export type EntryData = {
  id: number;
  author: string;
  timestamp: number,
  title: string;
  description: string;
};

export function getEntryTimeElapsed(entry: EntryData) {
  return '12 days';
}

export type CommentData = {
  id: number;
  author: string;
  timestamp: number;
  comment: string;
};
