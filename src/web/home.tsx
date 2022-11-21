import * as React from 'react';
import { Alert, Button, Segmented, Typography } from 'antd';
import { Entry } from './entry';
import { Category, EntryData } from 'common/types';
import { LoadingSpinner, StyledLink } from './component_util';
import { ApiService } from './services/api_service';
import styles from './home.module.css';
import { TagsList } from './tags_list';
import { AllTags, TagType } from 'common/tags';
import { satisfiesTagFilter } from 'common/util';

const { Title } = Typography;

const Config = {
  heading: 'Welcome to the Loftia ideas hub!',
};

export type MainState = {
  selectedCategory: Category;
  entries: {
    hot?: EntryData[],
    top?: EntryData[],
    new?: EntryData[],
  },
};

export const Home = ({ state, apiService, onMount, onCategoryChange, onSearchTagsChange }: {
  state: MainState,
  apiService: ApiService,
  onMount(): void,
  onCategoryChange(category: Category): void,
  onSearchTagsChange(newTags: TagType[]): void,
}) => {

  React.useEffect(() => onMount(), []);

  const [tags, setTags] = React.useState<TagType[]>([]);

  const updateTags = (newTags: TagType[]) => {
    setTags(newTags);
    onSearchTagsChange(newTags);
  };

  const entries = state.entries[state.selectedCategory]
    ?.filter(entry => satisfiesTagFilter(entry.tags, tags))
    ?.filter(filteredEntry => !(apiService.getReportedEntries()?.includes(filteredEntry.id)))

  return (
    <>
      <Alert type="info" className={styles.submitAlert} message={
        <>
          <Title level={4} className={styles.heading}>{Config.heading}</Title>
          <div className={styles.submitAlertMessage}>
            <p>Here you can check out, vote and comment on all of the cool suggestions that others in the Loftia community have put forward.</p>
            <p>Or, do you have an idea for something you'd like to be in Loftia?</p>
          </div>
          <StyledLink to="/new" enabled={true}>
            <Button className={styles.submitAlertButton} shape="round" type="primary">Submit Your Idea!</Button>
          </StyledLink>
        </>
      }/>
      <Segmented
        className={styles.categories}
        block={true}
        value={state.selectedCategory}
        onChange={onCategoryChange}
        options={[
          {
            label: (
              <div className={styles.categoryLabel}>
                ✨ New
              </div>
            ),
            value: 'new',
          },
          {
            label: (
              <div className={styles.categoryLabel}>
                🔥Hot
              </div>
            ),
            value: 'hot',
          },
          {
            label: (
              <div className={styles.categoryLabel}>
                ⬆️ Top
              </div>
            ),
            value: 'top',
          },
        ]}
      />

      <TagsList mode="search" tags={tags} updateTags={updateTags}/>

      {entries == null && (
        <LoadingSpinner/>
      )}
      {entries && entries.map(entry => (
        <Entry key={entry.id} entry={entry} apiService={apiService} enableLinks={true}/>
      ))}
      {entries && entries.length === 0 && (
        <div className={styles.noResults}>No results were found 😔</div>
      )}
    </>
  );
};
