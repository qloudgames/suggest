import { EntryDataFromServer } from 'common/types';

export const FakeEntries: EntryDataFromServer[] = Array(10).fill(0).map((_, i) => createFakeEntry(i));

FakeEntries[FakeEntries.length - 1].description = multiply('W', 200);

function createFakeEntry(id: number) {
  return {
    id,
    author: `Author_${id}`,
    timestamp: Date.now(),
    title: `Idea from person ${id}`,
    description: 'We want all of the pets and all of the pet accessories!',
    voteCount: Math.floor(Math.random() * 500),
  };
}

function multiply(str: string, multiple: number) {
  let result = '';
  for (let i = 0; i < multiple; i++) {
    result += (result === '' ? '' : ' ') + str;
  }
  return result;
}
