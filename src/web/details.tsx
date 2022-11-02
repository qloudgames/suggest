import * as React from 'react';
import { Alert, Button, Card, Comment, Input, Popover, Tooltip } from 'antd';
import styles from './details.module.css';
import { useParams } from 'react-router-dom';
import { Entry } from './entry';
import { Vote } from './vote';
import { Back } from './app';
import { ApiService } from './services/api_service';
import { CommentData, FullEntryData } from 'common/types';
import { LoadingSpinner } from './component_util';

type CommentFormState = 'show' | 'sending' | 'hidden';

export const Details = ({ apiService }: { apiService: ApiService }) => {
  const entryId = parseInt(useParams().entryId);
  
  const [entry, setEntry] = React.useState<FullEntryData>(undefined);

  const loadEntryDetails = () => apiService.getEntryDetails(entryId).then(e => setEntry(e));

  React.useEffect(() => {
    loadEntryDetails();
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
                maxLength={2000} />
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
