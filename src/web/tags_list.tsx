import { Dropdown, Menu, Tag } from 'antd';
import * as React from 'react';
import { PlusOutlined, RedoOutlined } from '@ant-design/icons';
import styles from './tags_list.module.css';
import { AllTags, getColorForTag, TagType } from 'common/tags';
import classNames from 'classnames';

type Props = {
  mode: 'view' | 'edit' | 'search';

  tags: TagType[];
  tagsLimit?: number;
  updateTags(updatedTags: TagType[]): void;
  messageWhenEmpty?: JSX.Element | string;
};

export const TagsList = ({ mode, tags, updateTags, messageWhenEmpty, tagsLimit }: Props) => {
  const onRemove = (tag: TagType) => {
    const idx = tags.indexOf(tag);
    if (idx === -1)
      return;

    const updated = [...tags];
    updated.splice(idx, 1);
    updateTags(updated);
  };
  const onReset = () => updateTags([]);
  const addTag = (tag: TagType) => {
    updateTags([...tags, tag]);
  };

  const addableTags = AllTags.filter(tag => !tags.includes(tag));
  const AddTagsMenu = () => <Menu className={styles.addTagsMenu} items={addableTags.map(tag => ({
    key: tag,
    label: <span className={styles.addTagOption}>{tag}</span>,
    onClick: () => addTag(tag),
    className: styles.addTagsMenuItem,
  }))}/>;
  const disableAddTags = addableTags.length === 0 || (tagsLimit && tags.length >= tagsLimit);

  return (
    <div className={classNames(styles.tagsList, {
      [styles.viewOnly]: mode === 'view',
    })}>
      <div>
        {tags.map(tag => (
          <Tag
              key={tag}
              className={styles.tag}
              color={getColorForTag(tag)}
              closable={mode !== 'view'}
              onClose={(e: React.MouseEvent<HTMLElement, MouseEvent>) => {
                e.preventDefault();
                onRemove(tag);
              }}
          >
            {tag}
          </Tag>
        ))}

        {tags.length === 0 && messageWhenEmpty != null && (
          messageWhenEmpty
        )}
      </div>

      {mode !== 'view' && (
        <>
          <Dropdown disabled={disableAddTags} overlay={AddTagsMenu} placement="bottomLeft">
            <Tag
              className={classNames(styles.actionButton, styles.tag, {
                [styles.disabled]: disableAddTags,
              })}
            >
              <PlusOutlined /> {mode === 'edit' ? 'Add Tag' : 'Add Search Filter'}
            </Tag>
          </Dropdown>

          <Tag className={classNames(styles.resetButton, styles.tag, {
            [styles.disabled]: tags.length === 0,
          })} onClick={onReset}>
            <RedoOutlined /> Reset
          </Tag>
        </>
      )}
    </div>
  );
};
