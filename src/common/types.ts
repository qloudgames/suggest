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
