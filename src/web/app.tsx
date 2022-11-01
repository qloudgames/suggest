import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Card, Typography } from 'antd';
// TODO: clean this up
import 'antd/dist/antd.css';
import styles from './app.module.css';
import { FakeEntries } from 'common/fakes/fake_entries';
import { Entry } from './entry';

const { Title } = Typography;

const Config = {
  heading: 'What do you think should be included?',
};

type Props = {};

class SuggestionsRoot extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <div className={styles.page}>
        <Title level={2} className={styles.heading}>{Config.heading}</Title>
        <Card className={styles.entriesContainer}>
        {FakeEntries.map(entry => (
          <Entry entry={entry}/>
        ))}
        </Card>
      </div>
    );
  }
}

const root = createRoot(document.getElementById('root'));
root.render(<SuggestionsRoot/>);
