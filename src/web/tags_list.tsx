import { Dropdown, Menu, Tag } from 'antd';
import * as React from 'react';
import { PlusOutlined, RedoOutlined } from '@ant-design/icons';
import styles from './tags_list.module.css';
import { AllTags, getColorForTag, TagType } from 'common/tags';
import * as classNames from 'classnames';

type Props = {
  mode: 'modify' | 'search';

  tags: TagType[];
  updateTags(updatedTags: TagType[]): void;
};

export const TagsList = ({ mode, tags, updateTags }: Props) => {
  const [addTagsOpen, setAddTagsOpen] = React.useState(false);

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
    setAddTagsOpen(false);
  };

  const addableTags = AllTags.filter(tag => !tags.includes(tag));
  const AddTagsMenu = () => <Menu className={styles.addTagsMenu} items={addableTags.map(tag => ({
    key: tag,
    label: tag,
    onClick: () => addTag(tag),
    className: styles.addTagsMenuItem,
  }))}/>;

  return (
    <div className={styles.tagsList}>
      <div>
      {tags.map(tag => (
        <Tag
            className={styles.tag}
            color={getColorForTag(tag)}
            closable={true}
            onClose={(e: React.MouseEvent<HTMLElement, MouseEvent>) => {
              e.preventDefault();
              onRemove(tag);
            }}
        >
          {tag}
        </Tag>
      ))}
      </div>

      <Dropdown open={addTagsOpen} disabled={addableTags.length === 0} overlay={AddTagsMenu} placement="bottomLeft" transitionName={undefined}>
        <Tag
          onClick={() => setAddTagsOpen(!addTagsOpen)}
          className={classNames(styles.actionButton, styles.tag, {
            [styles.disabled]: addableTags.length === 0,
          })}
        >
          <PlusOutlined /> {mode === 'modify' ? 'Add Tag' : 'Add Search Filter'}
        </Tag>
      </Dropdown>

      {mode === 'search' && (
        <Tag className={classNames(styles.resetButton, styles.tag, {
          [styles.disabled]: tags.length === 0,
        })} onClick={onReset}>
          <RedoOutlined /> Reset Filters
        </Tag>
      )}
    </div>
  );
};
