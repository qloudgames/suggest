import * as React from 'react';
import { Button, Card, Tooltip } from 'antd';
import styles from './details.module.css';
import { CommentData, EntryData } from 'common/types';

export type FShowEntryDetails = (entry: EntryData) => void;

type Props = {
  entry: EntryData;
}

export const Details = ({ entry }: Props) => {

  // TODO: fetch comments from API

  return (
    <div className={styles.details}>
      Details panel
    </div>
  )
};
