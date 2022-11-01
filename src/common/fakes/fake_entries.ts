import { EntryData } from 'common/types';

export const FakeEntries: EntryData[] = Array(10).fill(0).map((_, i) => createFakeEntry(i));

function createFakeEntry(id: number) {
  return {
    id,
    author: `Author_${id}`,
    timestamp: Date.now(),
    title: `Idea from person ${id}`,
    description: 'We want all of the pets and all of the pet accessories!',
  };
}
