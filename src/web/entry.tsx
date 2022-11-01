import * as React from 'react';
import { Card } from 'antd';
import styles from './entry.module.css';
import { EntryData, getEntryTimeElapsed } from 'common/types';
import { InlineSeparator, StyledLink } from './component_util';
import { Vote, VoteState } from './vote';

type Props = {
  entry: EntryData;
  enableLinks?: boolean;
}

export const Entry = ({ entry, enableLinks }: Props) => {
  //
  const [voteState, setVoted] = React.useState<VoteState>(undefined);
  const onLike = () => setVoted(voteState !== 'liked' ? 'liked' : undefined);
  const onDislike = () => setVoted(voteState !== 'disliked' ? 'disliked' : undefined);

  return (
    <div className={styles.entryWrapper}>
      <Card.Grid key={entry.id} title={entry.title} className={styles.entry}>

        <Vote state={voteState} voteCount={17} onLike={onLike} onDislike={onDislike}/>

        {/* Main area */}
        <div className={styles.entryContent}>
          <StyledLink to={`/details/${entry.id}`} enabled={enableLinks}>
            <div className={styles.description}>
              {entry.description}
            </div>
          </StyledLink>
          <div className={styles.metadata}>
            By {entry.author}, {getEntryTimeElapsed(entry)} ago
            <InlineSeparator/>
            <StyledLink to={`/details/${entry.id}`} enabled={enableLinks}>3 comments</StyledLink>
          </div>
        </div>

      </Card.Grid>
    </div>
  );
};
