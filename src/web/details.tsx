import * as React from 'react';
import { Alert, Button, Card, Comment, Input, Popover, Tooltip } from 'antd';
import styles from './details.module.css';
import { useParams } from 'react-router-dom';
import { Entry } from './entry';
import { Vote } from './vote';
import { Back } from './app';
import { ApiService } from './services/api_service';
import { CommentData, FullEntryData, getTimeElapsedText } from 'common/types';
import { LoadingSpinner } from './component_util';
import { calculateVoteCountChange } from 'common/util';

type CommentFormState = 'show' | 'sending' | 'hidden';

export const Details = ({ apiService }: { apiService: ApiService }) => {
  const entryId = parseInt(useParams().entryId);
  
  const [entry, setEntry] = React.useState<FullEntryData>(undefined);

  const loadEntryDetails = () => apiService.getEntryDetails(entryId).then(e => setEntry(e));

  React.useEffect(() => {
    loadEntryDetails();
  }, []);

  const onVoteComment = (comment: CommentData, button: 'like' | 'dislike') => {
    const toVoteState = comment.voteState !== button ? button : 'none';
    const voteCountChange = calculateVoteCountChange(comment.voteState, toVoteState);

    apiService.voteOnComment({
      entryId: entry.id,
      commentId: comment.id,
      fromVoteState: comment.voteState,
      toVoteState,
    });
    // update locally too
    setEntry({
      ...entry,
      comments: entry.comments.map(c => (
        c.id === comment.id
            ? {
                ...c,
                voteCount: comment.voteCount + voteCountChange,
                voteState: toVoteState !== 'none' ? toVoteState : undefined,
              }
            : c
      )),
    });
  };

  const [commentFormState, setCommentFormState] = React.useState<CommentFormState>('show');
  const [name, setName] = React.useState<string>(apiService.getLocalName());
  const [commentText, setCommentText] = React.useState<string>('');
  const [commentError, setCommentError] = React.useState<string | undefined>(undefined);
  const [commentErrorOpen, setCommentErrorOpen] = React.useState<boolean>(false);

  const onNameChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setName(evt.target.value);
    apiService.setLocalName(evt.target.value);
  };
  const onCommentTextChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentText(evt.target.value);
  };
  
  const addComment = (): void => {
    if (name.length < 3) {
      setCommentError('your name is too short');
      setCommentErrorOpen(true);
      setTimeout(() => setCommentErrorOpen(false), 1000);
      return;
    }
    if (commentText.length < 10) {
      setCommentError('your comment is too short');
      setCommentErrorOpen(true);
      setTimeout(() => setCommentErrorOpen(false), 1000);
      return;
    }
    // post comment
    setCommentFormState('sending');
    apiService.addComment({
      entryId: entry.id,
      name,
      comment: commentText,
    }).then(() => {
      setCommentFormState('hidden');
      setCommentText('');
      // reload comments to display our new comment
      loadEntryDetails();
    }).catch(err => {
      console.error('Failed to post comment', err);
      setCommentFormState('show');
    });
  };

  return (
    <div className={styles.details}>

      <Back/>

      {entry == null ? (
        <LoadingSpinner/>
      ) : (
        <>
          <Entry entry={entry} apiService={apiService} enableLinks={false} compact={false}/>

          {commentFormState === 'show' && (
            <div className={styles.addComment}>
              <Input.TextArea
                value={commentText}
                onChange={onCommentTextChange}
                className={styles.commentBox}
                rows={4}
                placeholder="what are your thoughts about this idea?"
                maxLength={1000} />
              <Input
                prefix={<span style={{ fontWeight: 600 }}>name: </span>}
                value={name}
                onChange={onNameChange}
                className={styles.commentName}
                placeholder="your display name"
                maxLength={30}/>
              <Popover
                content={
                  <span>{commentError}</span>
                }
                open={commentErrorOpen}
              >
                <Button className={styles.addButton} type="default" onClick={addComment}>Add your comment!</Button>
              </Popover>
            </div>
          )}
          {commentFormState === 'sending' && <LoadingSpinner/>}
          {commentFormState === 'hidden' && (
            <Alert
              className={styles.commentPosted}
              message="Thanks!"
              description="Your comment has been posted below."
              type="success"
              showIcon
              closable/>
          )}

          <Card className={styles.comments}>
            {entry.comments.map(comment => (
                <Comment
                  key={comment.id}
                  // TODO: only top-level comments are replyable
                  actions={[
                    <Tooltip title="nested comments coming soon..." placement="right">
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
                      voteCount={comment.voteCount}
                      state={comment.voteState}
                      onLike={() => onVoteComment(comment, 'like')}
                      onDislike={() => onVoteComment(comment, 'dislike')}
                      size="small"
                      likeEmoji="👍"
                      dislikeEmoji="👎"
                    />
                  }
                  content={<span style={{ whiteSpace: 'pre-line' }}>{comment.comment}</span>}
                  datetime={<span>{getTimeElapsedText(comment.timestamp)}</span>}
                />
            ))}
            {entry.comments.length === 0 && (
              <div className={styles.emptyComments}>There aren't any comments here yet. You could be the first!</div>
            )}
          </Card>
        </>
      )}
    </div>
  );
};
