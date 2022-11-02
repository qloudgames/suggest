import * as React from 'react';
import { Button, Card, Comment, Input, Tooltip } from 'antd';
import styles from './details.module.css';
import { useParams } from 'react-router-dom';
import { Entry } from './entry';
import { Vote } from './vote';
import { Back } from './app';
import { ApiService } from './services/api_service';
import { CommentData, FullEntryData } from 'common/types';
import { LoadingSpinner } from './component_util';

export const Details = ({ apiService }: { apiService: ApiService }) => {
  const entryId = parseInt(useParams().entryId);
  
  let [entry, setEntry] = React.useState<FullEntryData>(undefined);

  React.useEffect(() => {
    apiService.getEntryDetails(entryId)
        .then(e => setEntry(e));
  }, []);

  const onVoteComment = (comment: CommentData, button: 'like' | 'dislike') => {
    const voteAction = comment.voteState !== button ? button : 'clear';
    apiService.voteOnComment({
      id: comment.id,
      voteAction,
    });
    // update locally too
    setEntry({
      ...entry,
      comments: entry.comments.map(c => (
        c.id === comment.id
            ? {
                ...c,
                voteState: voteAction !== 'clear' ? voteAction : undefined,
              }
            : c
      )),
    });
  };
  
  const addComment = (): void => undefined;

  return (
    <div className={styles.details}>

      <Back/>

      {entry == null ? (
        <LoadingSpinner/>
      ) : (
        <>
          <Entry entry={entry} apiService={apiService} enableLinks={false} compact={false}/>

          <div className={styles.addComment}>
            <Input.TextArea className={styles.commentBox} rows={4} placeholder="what are your thoughts about this idea?" maxLength={2000} />
            <Input className={styles.commentName} placeholder="your display name" maxLength={30}/>
            <Button className={styles.addButton} type="default" onClick={addComment}>Add your comment!</Button>
          </div>

          <Card className={styles.comments}>
            {entry.comments.map(comment => (
                <Comment
                  key={comment.id}
                  // TODO: only top-level comments are replyable
                  actions={[
                    <Tooltip title="feature coming soon..." placement="right">
                      <Button
                        key={`reply-${comment.id}`}
                        type="default"
                        size="small"
                        className={styles.commentReplyButton}
                      >
                          Reply
                      </Button>
                    </Tooltip>
                  ]}
                  author={comment.author}
                  avatar={
                    <Vote
                      voteCount={0}
                      state={comment.voteState}
                      onLike={() => onVoteComment(comment, 'like')}
                      onDislike={() => onVoteComment(comment, 'dislike')}
                      size="small"
                      likeEmoji="👍"
                      dislikeEmoji="👎"
                    />
                  }
                  content={comment.comment}
                  datetime={<span>9 hours ago</span>}
                />
            ))}
          </Card>
        </>
      )}
    </div>
  );
};
