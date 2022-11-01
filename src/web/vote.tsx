import * as React from 'react';
import { Button, Tooltip } from 'antd';
import styles from './vote.module.css';
import * as classNames from 'classnames';

export type VoteState = 'liked' | 'disliked' | undefined;

type Props = {
  voteCount: number;
  state: VoteState;
  onLike(): void;
  onDislike(): void;
  size?: 'small' | 'middle';
  likeEmoji?: string;
  dislikeEmoji?: string;
};

const MaybeTooltip = ({ title, enabled, children }: { title: string, enabled: boolean, children: any }) => (
  enabled
    ? <Tooltip title={title} placement="left">{children}</Tooltip>
    : children
);

export const Vote = ({ voteCount, state, onLike, onDislike, size = 'middle', likeEmoji, dislikeEmoji }: Props) => {

  const small = size === 'small';
  const likedButtonType = !small ? 'primary' : 'dashed';

  return (
    <div className={classNames(styles.vote, {
      [styles.small]: size === 'small',
    })}>
      <MaybeTooltip title="I like this idea!" enabled={!small}>
        <Button
          type={state === 'liked' ? likedButtonType : 'dashed'}
          danger={!small}
          shape="circle"
          className={classNames(styles.voteButton, { [styles.faded]: size === 'small' && state !== 'liked' })}
          onClick={onLike}
          size={size}
        >
          {likeEmoji || '😍'}
        </Button>
      </MaybeTooltip>
      <span className={styles.voteCount}>
        {voteCount}
      </span>
      <MaybeTooltip title="Not too sure about this" enabled={!small}>
        <Button
          type={state === 'disliked' ? likedButtonType : 'dashed'}
          shape="circle"
          className={classNames(styles.voteButton, { [styles.faded]: size === 'small' && state !== 'disliked' })}
          onClick={onDislike}
          size={size}
        >
          {dislikeEmoji || '😞'}
        </Button>
      </MaybeTooltip>
    </div>
  );
};
