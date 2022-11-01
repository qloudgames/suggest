import * as React from 'react';
import { Button, Card, Comment, Input, Tooltip } from 'antd';
import styles from './details.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import { FakeEntries } from 'common/fakes/fake_entries';
import { Entry } from './entry';
import { getFakeCommentsFor } from 'common/fakes/fake_comments';
import { Vote } from './vote';
import { Back } from './app';

export const Details = () => {
  const { entryId }= useParams();
  // TODO: fetch comments from API

  const index = Number.parseInt(entryId);
  const entry = FakeEntries[index];
  
  const addComment = (): void => undefined;
  const comments = getFakeCommentsFor(index);

  return (
    <div className={styles.details}>

      <Back/>

      <Entry entry={entry} enableLinks={false}/>

      <div className={styles.addComment}>
        <Input.TextArea className={styles.commentBox} rows={4} placeholder="what do you think about this idea?" maxLength={2000} />
        <Input className={styles.commentName} placeholder="your display name" maxLength={30}/>
        <Button className={styles.addButton} type="default" onClick={addComment}>Add your comment!</Button>
      </div>

      <Card className={styles.comments}>
        {comments.map(comment => (
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
                    // disabled={true}
                  >
                      Reply
                  </Button>
                </Tooltip>
              ]}
              author={comment.author}
              // avatar={<Avatar style={{ backgroundColor: randomColor() }} icon={<UserOutlined />} />}
              avatar={
                <Vote
                  voteCount={0}
                  state={'liked'}
                  onLike={() => undefined}
                  onDislike={() => undefined}
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
    </div>
  );
};
