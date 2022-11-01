import * as React from 'react';
import { Button, Input } from 'antd';
import styles from './create.module.css';
import { Back } from './app';

export const Create = () => {
  const create = (): void => undefined;

  return (
    <div>
      <Back/>

      <div className={styles.createContainer}>
        <Input className={styles.title} placeholder="title (summary of your idea)" maxLength={30}/>
        <Input.TextArea className={styles.body} rows={4} placeholder="describe your idea in a bit more detail here!" maxLength={2000} />
        <Input className={styles.name} placeholder="your display name" maxLength={30}/>
        <Button className={styles.createButton} type="default" shape="round" onClick={create}>Submit your idea!</Button>
      </div>
    </div>
  );
};
