import * as React from 'react';
import { Card } from 'antd';
import styles from './entry.module.css';
import { EntryData, getEntryTimeElapsed } from 'common/types';
import { InlineSeparator, StyledLink } from './component_util';
import { Vote, VoteState } from './vote';
import * as classNames from 'classnames';

type Props = {
  entry: EntryData;
  compact?: boolean;
  enableLinks?: boolean;
}

export const Entry = ({ entry, compact = true, enableLinks }: Props) => {
  //
  const [voteState, setVoted] = React.useState<VoteState>(undefined);
  const onLike = () => setVoted(voteState !== 'liked' ? 'liked' : undefined);
  const onDislike = () => setVoted(voteState !== 'disliked' ? 'disliked' : undefined);

  return (
    <Card.Grid key={entry.id} title={entry.title} className={classNames(styles.entry, { [styles.compact]: compact })}>

      <Vote state={voteState} voteCount={17} onLike={onLike} onDislike={onDislike}/>

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
          <StyledLink to={`/details/${entry.id}`} enabled={enableLinks}>3 comments</StyledLink>
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

  // split into excert, and "read more..."
  return (
    <>
      <>{entry.description.substring(0, 201)}...</>
      <StyledLink to={`/details/${entry.id}`} enabled={true}>
        <span className={styles.readMore}>[read more]</span>
      </StyledLink>
    </>
  )
}
