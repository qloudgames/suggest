import * as React from 'react';
import { Button, Card, Tooltip } from 'antd';
import styles from './details.module.css';
import { CommentData, EntryData } from 'common/types';
import { useParams } from 'react-router-dom';
import { FakeEntries } from 'common/fakes/fake_entries';
import { Entry } from './entry';

export const Details = () => {
  const { entryId }= useParams();
  // TODO: fetch comments from API

  const index = Number.parseInt(entryId);
  const entry = FakeEntries[index];

  return (
    <div className={styles.details}>
      <Entry entry={entry}/>
      <div className={styles.comments}>
        Comments...asd
      </div>
    </div>
  );
};
