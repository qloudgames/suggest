import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Card, Typography } from 'antd';
// TODO: clean this up
import 'antd/dist/antd.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { FakeEntries } from 'common/fakes/fake_entries';
import styles from './app.module.css';
import { Entry } from './entry';
import { Details } from './details';
import { StyledLink } from './component_util';
import logo from './assets/loftia-logo.png';

const { Title } = Typography;

const Config = {
  heading: 'What would you like to see in the game?',
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
          <StyledLink className={styles.header} to="/" enabled={true}>
            <img className={styles.logo} src={logo}/>
            <Title level={2} className={styles.heading}>{Config.heading}</Title>
          </StyledLink>
          <Card className={styles.container}>
            <Routes>
              <Route path="/" element={FakeEntries.map(entry => (
                  <Entry key={entry.id} entry={entry} enableLinks={true}/>
                ))} />
              <Route path="details/:entryId" element={<Details/>} />
            </Routes>
          </Card>
        </div>
      </BrowserRouter>
    );
  }
}

const root = createRoot(document.getElementById('root'));
root.render(<SuggestionsRoot/>);
