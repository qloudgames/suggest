import * as React from 'react';
import { Card } from 'antd';
import styles from './entry.module.css';
import { EntryData, getEntryTimeElapsed, VoteState } from 'common/types';
import { InlineSeparator, StyledLink } from './component_util';
import { Vote } from './vote';
import * as classNames from 'classnames';
import { ApiService } from './services/api_service';

type Props = {
  entry: EntryData;
  apiService: ApiService,
  compact?: boolean;
  enableLinks?: boolean;
}

export const Entry = ({ entry, apiService, compact = true, enableLinks }: Props) => {
  //
  const [voteState, setVoted] = React.useState<VoteState>(entry.voteState);
  const onLike = () => {
    setVoted(voteState !== 'like' ? 'like' : undefined);
    apiService.voteOnEntry({
      id: entry.id,
      voteAction: voteState !== 'like' ? 'like' : 'clear',
    });
  };
  const onDislike = () => {
    setVoted(voteState !== 'dislike' ? 'dislike' : undefined);
    apiService.voteOnEntry({
      id: entry.id,
      voteAction: voteState !== 'dislike' ? 'dislike' : 'clear',
    });
  };

  return (
    <Card.Grid key={entry.id} title={entry.title} className={classNames(styles.entry, { [styles.compact]: compact })}>

      <Vote state={voteState} voteCount={entry.voteCount} onLike={onLike} onDislike={onDislike}/>

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
          <StyledLink to={`/details/${entry.id}`} enabled={enableLinks}>{entry.numComments} comments</StyledLink>
        </div>
      </div>

    </Card.Grid>
  );
};

const CompactMaxLength = 200;

function createEntryDescription(entry: EntryData, compact: boolean) {
  if (!compact || entry.description.length <= CompactMaxLength) {
    return entry.description;
  }

  // split into excerpt, and "read more..."
  return (
    <>
      <>{entry.description.substring(0, 201)}...</>
      <span className={styles.readMore}>[read more]</span>
    </>
  )
}
