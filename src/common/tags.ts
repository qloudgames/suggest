export const AllTags = [
  'gameplay',
  'lore & story',
  'farming',
  'pets',
  'customization',
  'characters',
  'sustainability',
  'world & setting',
  'other',
] as const;

export const MaxTagsPerEntry = 5;

export type TagType = typeof AllTags[number];

export const TagColors: string[] = [
  'magenta',
  'red',
  'volcano',
  'orange',
  'gold',
  'lime',
  'green',
  'cyan',
  'blue',
  'geekblue',
  'purple',
];

export function getColorForTag(tag: TagType) {
  return TagColors[AllTags.indexOf(tag) % TagColors.length];
}
