import * as React from 'react';
import { Button, Input, Popover } from 'antd';
import styles from './create.module.css';
import { Back } from './app';
import { ApiService } from './services/api_service';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner } from './component_util';

export const Create = ({ apiService }: { apiService: ApiService }) => {
  const [title, setTitle] = React.useState('');
  const [name, setName] = React.useState(apiService.getLocalName());
  const [body, setBody] = React.useState('');
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [errorOpen, setErrorOpen] = React.useState<boolean>(false);
  const [sending, setSending] = React.useState(false);

  const navigate = useNavigate();

  const onTitleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(evt.target.value);
  };
  const onBodyChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBody(evt.target.value);
  };
  const onNameChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setName(evt.target.value);
    apiService.setLocalName(evt.target.value);
  };

  const create = (): void => {
    if (name.length < 3) {
      setError('your name is too short');
      setErrorOpen(true);
      setTimeout(() => setErrorOpen(false), 1000);
      return;
    }
    if (title.length < 10) {
      setError('your title is too short');
      setErrorOpen(true);
      setTimeout(() => setErrorOpen(false), 1000);
      return;
    }

    // post the idea
    setSending(true);
    apiService.addEntry({
      title,
      body,
      name,
    }).then(({ entryId }) => {
      // go to newly-created post
      navigate(`/details/${entryId}`);
    }).catch(err => {
      console.error('Failed to post entry', err);
      setSending(false);
    });
  };

  return (
    <div>
      <Back/>

      <div className={styles.createContainer}>
        <Input
          value={title}
          onChange={onTitleChange}
          prefix={<span style={{ fontWeight: 600 }}>title: </span>}
          className={styles.title}
          placeholder="title (summary of your idea)"
          maxLength={30}/>
        <Input.TextArea
          value={body}
          onChange={onBodyChange}
          className={styles.body}
          rows={4}
          placeholder="(optional) describe your idea in a bit more detail here!"
          maxLength={3000} />
        <Input
          value={name}
          onChange={onNameChange}
          prefix={<span style={{ fontWeight: 600 }}>your name: </span>}
          className={styles.name}
          placeholder="your display name"
          maxLength={30}/>

        {sending ? (
          <LoadingSpinner/>
        ) : (
          <Popover
            content={
              <span>{error}</span>
            }
            open={errorOpen}
          >
            <Button className={styles.createButton} type="default" shape="round" onClick={create}>Submit your idea!</Button>
          </Popover>
        )}
      </div>
    </div>
  );
};
