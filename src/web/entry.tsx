import * as React from 'react';
import { Card } from 'antd';
import styles from './entry.module.css';
import { EntryData, VoteState } from 'common/types';
import { InlineSeparator, StyledLink } from './component_util';
import { Vote } from './vote';
import * as classNames from 'classnames';
import { ApiService } from './services/api_service';
import { calculateVoteCountChange, getTimeElapsedText } from 'common/util';
import { TagsList } from './tags_list';
import { ReportModal } from './report_modal';

type Props = {
  entry: EntryData;
  apiService: ApiService,
  compact?: boolean;
  enableLinks?: boolean;
  displayTags?: boolean;
}

export const Entry = ({ entry, apiService, compact = true, enableLinks, displayTags = true }: Props) => {
  const [voteState, setVoteState] = React.useState<VoteState>(entry.voteState);
  const [voteCount, setVoteCount] = React.useState<number>(entry.voteCount);
  const [isReportingVisible, setIsReportingVisible] = React.useState<boolean>(false);
  // hack to fix issue with:
  // - changing vote state on 'details' page, then flicking back to listview, would result in outdated votestate
  //   on listview
  // TODO: not sure why this bug occurs, need to come back and fix this without this hack
  if (voteState !== entry.voteState) {
    setVoteState(entry.voteState);
    setVoteCount(entry.voteCount);
  }

  const onVote = (button: 'like' | 'dislike') => {
    const toVoteState = voteState !== button ? button : 'none';

    apiService.voteOnEntry({
      id: entry.id,
      fromVoteState: entry.voteState,
      toVoteState,
    });

    entry.voteState = voteState !== button ? button : undefined;
    setVoteState(entry.voteState);

    const voteCountChange = calculateVoteCountChange(voteState, toVoteState);
    entry.voteCount = voteCount + voteCountChange;
    setVoteCount(entry.voteCount);
  };

  const showReport = () => {
    setIsReportingVisible(true);
  }

  const hideReport = () => {
    setIsReportingVisible(false);
  }

  return (
    <Card.Grid key={entry.id} title={entry.title} className={classNames(styles.entry, { [styles.compact]: compact })}>

      <Vote state={voteState} voteCount={voteCount} onLike={() => onVote('like')} onDislike={() => onVote('dislike')}/>

      {/* Main area */}
      <div className={styles.entryContent} onMouseEnter={showReport} onMouseLeave={hideReport}>
        <div>
        <div className={styles.entryMain}>
          <StyledLink to={`/details/${entry.id}`} enabled={enableLinks}>
            <div className={styles.title}>
              {createEntryTitle(entry, compact)}
            </div>
            <div className={styles.description}>
              {createEntryDescription(entry, compact)}
            </div>
          </StyledLink>
          <div className={styles.tags}>
            <TagsList mode="view" tags={entry.tags} updateTags={() => undefined}/>
          </div>
        </div>

        <div className={styles.metadata}>
          By {entry.author}, {getTimeElapsedText(entry.timestamp)}
          <InlineSeparator/>
          <StyledLink to={`/details/${entry.id}`} enabled={enableLinks}>{entry.numComments} comment{entry.numComments !== 1 && 's'}</StyledLink>
        </div>
        </div>
        {isReportingVisible ? <div>
          <ReportModal 
            entryId={entry.id} 
          />
        </div> : null}
      </div>

    </Card.Grid>
  );
};

// okay I'm not proud of the code here...
// TODO: fix this crap
const CompactTitleMaxLength = 60;
const CompactDescriptionMaxLength = 200;

function createEntryTitle(entry: EntryData, compact: boolean) {
  const numWideChars = countWideChars(entry.title);
  const estimatedRenderedLength = entry.title.length + numWideChars;
  if (compact && estimatedRenderedLength > CompactTitleMaxLength) {
    const wideCharsInExcerpt = countWideChars(entry.title.substring(0, CompactTitleMaxLength));
    const fullyShortenedLength = CompactTitleMaxLength - (wideCharsInExcerpt / 2);
    return entry.title.substring(0, fullyShortenedLength) + '...';
  }

  return entry.title;
}

function createEntryDescription(entry: EntryData, compact: boolean) {
  if (compact) {
    const numWideChars = countWideChars(entry.description);
    const estimatedRenderedLength = entry.description.length + numWideChars;
    if (estimatedRenderedLength <= CompactDescriptionMaxLength) {
      // no newlines/paragraphs
      return entry.description;
    }

    // split into excerpt, and "read more..."
    const wideCharsInExcerpt = countWideChars(entry.description.substring(0, CompactDescriptionMaxLength));
    const fullyShortenedLength = CompactDescriptionMaxLength - (wideCharsInExcerpt / 2);
    return (
      <>
        <>{entry.description.substring(0, fullyShortenedLength)}...</>
        <span className={styles.readMore}>[read more]</span>
      </>
    );
  };

  // with formatting
  return <span style={{ whiteSpace: 'pre-line' }}>{entry.description}</span>;
}

function countWideChars(str: string) {
  let wCount = 0;
  for (let i = 0; i < str.length; i++) {
    if (str.charAt(i).toLowerCase() === 'w')
      wCount++;
  }
  return wCount;
}
