import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Alert, Button, Card, PageHeader, Typography } from 'antd';
// TODO: clean this up
import 'antd/dist/antd.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { FakeEntries } from 'common/fakes/fake_entries';
import styles from './app.module.css';
import { Entry } from './entry';
import { Details } from './details';
import { StyledLink } from './component_util';
import logo from './assets/loftia-logo.png';
import { Create } from './create';

const { Title } = Typography;

const Config = {
  heading: 'Welcome to the Loftia ideas hub!',
};

export const Back = () => {
  return (
    <PageHeader
      className={styles.back}
      title={
        <StyledLink to="/" enabled={true}>⬅️ Back</StyledLink>
      }
    />
  );
};

const Home = () => (
  <>
    <Alert type="info" className={styles.submitAlert} message={
      <>
        <Title level={4} className={styles.heading}>{Config.heading}</Title>
        <div className={styles.submitAlertMessage}>
          <p>Here you can check out, vote and comment on all of the cool things that others in the Loftia community have thought about.</p>
          <p>Or, do you have an idea for something you'd like to be in Loftia?</p>
        </div>
        <StyledLink to="/new" enabled={true}>
          <Button className={styles.submitAlertButton} shape="round" type="primary">Submit Your Idea!</Button>
        </StyledLink>
      </>
    }/>
    {FakeEntries.map(entry => (
      <Entry key={entry.id} entry={entry} enableLinks={true}/>
    ))}
  </>
);

class SuggestionsRoot extends React.Component<{}> {
  constructor(props: {}) {
    super(props);
  }

  render() {
    return (
      <BrowserRouter>
        <div className={styles.page}>
          <StyledLink className={styles.header} to="/" enabled={true}>
            <img className={styles.logo} src={logo}/>
          </StyledLink>
          <Card className={styles.container}>
            <Routes>
              <Route path="/" element={<Home/>} />
              <Route path="details/:entryId" element={<Details/>} />
              <Route path="/new" element={<Create/>}/>
              <Route path="*" element={<Home/>}/>
            </Routes>
          </Card>
        </div>
      </BrowserRouter>
    );
  }
}

const root = createRoot(document.getElementById('root'));
root.render(<SuggestionsRoot/>);
