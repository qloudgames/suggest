import { Bounds } from 'common/bounds';
import { ReportReasons } from 'common/reporting';
import { AllTags, MaxTagsPerEntry, TagType } from 'common/tags';

export function isValidEntryTitle(title: string) {
  return typeof title === 'string' && title.length <= Bounds.entry.title.max && title.length >= Bounds.entry.title.min;
}

export function isValidEntryDescription(desc: string) {
  return desc == null || (typeof desc === 'string' && desc.length <= Bounds.entry.description.max);
}

export function isValidName(name: string) {
  return typeof name === 'string' && name.length <= Bounds.name.max && name.length >= Bounds.name.min;
}

export function isValidEntryTags(tags: TagType[]) {
  return Array.isArray(tags) && tags.length <= MaxTagsPerEntry && tags.every(tag => AllTags.includes(tag));
}

export function isValidComment(comment: string) {
  return typeof comment === 'string' && comment.length <= Bounds.comment.max && comment.length >= Bounds.comment.min;
}

export function isValidReasons(reasons: string[]) {
  return Array.isArray(reasons) && reasons.some((reason) => Object.values(ReportReasons).includes(reason as ReportReasons));
}

export function isValidIssue(issue: string) {
  return typeof issue === 'string' && issue.length <= Bounds.issue.max;
}