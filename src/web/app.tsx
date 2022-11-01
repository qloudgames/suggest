import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Card, Typography } from 'antd';
// TODO: clean this up
import 'antd/dist/antd.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { FakeEntries } from 'common/fakes/fake_entries';
import styles from './app.module.css';
import { Entry } from './entry';
import { EntryData } from 'common/types';
import { Details } from './details';

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
      <BrowserRouter>
        <div className={styles.page}>

          <Title level={2} className={styles.heading}>{Config.heading}</Title>
          <Card className={styles.container}>

            
          <Routes>
            <Route path="/" element={FakeEntries.map(entry => (
                <Entry entry={entry}/>
              ))} />
            <Route path="details" element={<Details/>} />
          </Routes>

          </Card>

        </div>
      </BrowserRouter>
    );
  }
}

const root = createRoot(document.getElementById('root'));
root.render(<SuggestionsRoot/>);
