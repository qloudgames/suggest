import * as React from 'react';
import { Button, Tooltip } from 'antd';
import styles from './vote.module.css';
import * as classNames from 'classnames';

export type VoteState = 'like' | 'dislike' | undefined;

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
  const likedButtonType = !small ? 'primary' : 'default';

  return (
    <div className={classNames(styles.vote, {
      [styles.small]: size === 'small',
    })}>
      <MaybeTooltip title="I like this idea!" enabled={!small}>
        <Button
          type={state === 'like' ? likedButtonType : 'dashed'}
          danger={!small}
          shape="circle"
          className={classNames(styles.voteButton, {
            [styles.faded]: size === 'small' && state !== 'like',
            [styles.small]: small,
            [styles.active]: state === 'like',
          })}
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
          type={state === 'dislike' ? likedButtonType : 'dashed'}
          shape="circle"
          className={classNames(styles.voteButton, {
            [styles.faded]: size === 'small' && state !== 'dislike',
            [styles.small]: small,
            [styles.active]: state === 'dislike',
          })}
          onClick={onDislike}
          size={size}
        >
          {dislikeEmoji || '😞'}
        </Button>
      </MaybeTooltip>
    </div>
  );
};
