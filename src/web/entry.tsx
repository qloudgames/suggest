import * as React from 'react';
import { Card } from 'antd';
import styles from './entry.module.css';
import { EntryData, getEntryTimeElapsed, VoteState } from 'common/types';
import { InlineSeparator, StyledLink } from './component_util';
import { Vote } from './vote';
import * as classNames from 'classnames';
import { ApiService } from './services/api_service';
import { calculateVoteCountChange } from 'common/util';

type Props = {
  entry: EntryData;
  apiService: ApiService,
  compact?: boolean;
  enableLinks?: boolean;
}

export const Entry = ({ entry, apiService, compact = true, enableLinks }: Props) => {
  const [voteState, setVoteState] = React.useState<VoteState>(entry.voteState);
  const [voteCount, setVoteCount] = React.useState<number>(entry.voteCount);

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

  return (
    <Card.Grid key={entry.id} title={entry.title} className={classNames(styles.entry, { [styles.compact]: compact })}>

      <Vote state={voteState} voteCount={voteCount} onLike={() => onVote('like')} onDislike={() => onVote('dislike')}/>

      {/* Main area */}
      <div className={styles.entryContent}>
        <StyledLink to={`/details/${entry.id}`} enabled={enableLinks}>
          <div className={styles.title}>
            {entry.title}
          </div>
          <div className={styles.description}>
            {createEntryDescription(entry, compact)}
          </div>
        </StyledLink>
        <div className={styles.metadata}>
          By {entry.author}, {getEntryTimeElapsed(entry)} ago
          <InlineSeparator/>
          <StyledLink to={`/details/${entry.id}`} enabled={enableLinks}>{entry.numComments} comment{entry.numComments !== 1 && 's'}</StyledLink>
        </div>
      </div>

    </Card.Grid>
  );
};

const CompactMaxLength = 200;

function createEntryDescription(entry: EntryData, compact: boolean) {
  if (compact) {
    if (entry.description.length <= CompactMaxLength) {
      // no newlines/paragraphs
      return entry.description;
    }

    // split into excerpt, and "read more..."
    return (
      <>
        <>{entry.description.substring(0, 201)}...</>
        <span className={styles.readMore}>[read more]</span>
      </>
    );
  };

  // with formatting
  return <span style={{ whiteSpace: 'pre-line' }}>{entry.description}</span>;
}
