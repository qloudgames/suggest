import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Card, Typography } from 'antd';
// TODO: clean this up
import 'antd/dist/antd.css';
import styles from './app.module.css';
import { FakeEntries } from 'common/fakes/fake_entries';
import { Entry } from './entry';
import { EntryData } from 'common/types';
import { Details } from './details';

const { Title } = Typography;

const Config = {
  heading: 'What do you think should be included?',
};

type Props = {};

type State = {
  display: 'list' | 'details' | 'new';
  entry?: EntryData;
};

class SuggestionsRoot extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      display: 'list',
    };
  }

  override componentDidMount() {
    if (window.history) {
      const prevUrl = window.location.href;
      window.addEventListener('hashchange', () => {
        window.history.pushState({}, null, prevUrl);
      });
    }
  }

  private readonly showEntryDetails = (entry: EntryData) => {
    this.setState({
      display: 'details',
      entry,
    });
  };

  render() {
    return (
      <div className={styles.page}>

        <Title level={2} className={styles.heading}>{Config.heading}</Title>
        <Card className={styles.container}>
        
        {this.state.display === 'list' && (
            FakeEntries.map(entry => (
              <Entry entry={entry} showEntryDetails={this.showEntryDetails}/>
            ))
        )}

        {this.state.display === 'details' && (
            <Details entry={this.state.entry}/>
        )}

        </Card>

      </div>
    );
  }
}

const root = createRoot(document.getElementById('root'));
root.render(<SuggestionsRoot/>);
