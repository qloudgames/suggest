import * as React from 'react';
import { Button, Card, Tooltip } from 'antd';
import styles from './entry.module.css';
import { EntryData, getEntryTimeElapsed } from 'common/types';
import { InlineSeparator, StyledLink } from './component_util';

type Props = {
  entry: EntryData;
}

export const Entry = ({ entry }: Props) => {
  //
  const [voted, setVoted] = React.useState<string>('');
  const onLike = () => setVoted(voted !== 'like' ? 'like' : '');
  const onDislike = () => setVoted(voted !== 'dislike' ? 'dislike' : '');

  return (
    <div className={styles.entryWrapper}>
      <Card.Grid key={entry.id} title={entry.title} className={styles.entry}>

        {/* Vote area */}
        <div className={styles.vote}>
          <Tooltip title="I like this idea!" placement="left">
            <Button
              type={voted === 'like' ? 'primary' : 'dashed'}
              danger
              shape="circle"
              className={styles.voteButton}
              onClick={onLike}
            >
              😍
            </Button>
          </Tooltip>
          <span className={styles.voteCount}>
            17
          </span>
          <Tooltip title="Not too sure about this" placement="left">
            <Button
              type={voted === 'dislike' ? 'primary' : 'dashed'}
              shape="circle"
              className={styles.voteButton}
              onClick={onDislike}
            >
              😞
            </Button>
          </Tooltip>
        </div>

        {/* Main area */}
        <div className={styles.entryContent}>
          <div className={styles.description}>
            <StyledLink to="/details">
              {entry.description}
            </StyledLink>
          </div>
          <div className={styles.metadata}>
            By {entry.author}, {getEntryTimeElapsed(entry)} ago
            <InlineSeparator/>
            <StyledLink to="/details">3 comments</StyledLink>
          </div>
        </div>

      </Card.Grid>
    </div>
  );
};
