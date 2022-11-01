import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Alert, Button, Card, PageHeader, Spin, Typography } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
// TODO: clean this up
import 'antd/dist/antd.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import styles from './app.module.css';
import { Entry } from './entry';
import { Details } from './details';
import { StyledLink } from './component_util';
import logo from './assets/loftia-logo.png';
import { Create } from './create';
import { HttpApiClient } from './services/http_api_client';
import { ApiService } from './services/api_service';
import { EntryData, VoteAction } from 'common/types';
import { FakeApiService } from './services/fake_api_service';

const { Title } = Typography;

type MainState = { entries?: EntryData[] };

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

export const LoadingSpinner = () => (
  <div className={styles.loadContainer}>
    <Spin className={styles.load} indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
  </div>
);

const Home = ({ state, apiService, onMount }: { state: MainState, apiService: ApiService, onMount(): void }) => {

  React.useEffect(() => onMount());

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
      {state.entries && state.entries.map(entry => (
        <Entry key={entry.id} entry={entry} apiService={apiService} enableLinks={true}/>
      ))}
      {state.entries == null && (
        <LoadingSpinner/>
      )}
    </>
  );
};

type Props = {
  apiService: ApiService;
};
type MainStateInternal = MainState & {
  //
};

class SuggestionsRoot extends React.Component<Props, MainStateInternal> {
  constructor(props: Props) {
    super(props);

    this.state = {
      entries: undefined,
    };
  }

  componentDidMount() {
    this.maybeLoadEntries();
  }

  private readonly maybeLoadEntries = () => {
    const { apiService } = this.props;
    apiService.getEntries().then(entries => {
      this.setState({ entries });
      console.log('set entries = ' + JSON.stringify(entries));
    });
  };

  render() {
    const { apiService } = this.props;
    return (
      <BrowserRouter>
        <div className={styles.page}>
          <StyledLink className={styles.header} to="/" enabled={true}>
            <img className={styles.logo} src={logo}/>
          </StyledLink>
          <Card className={styles.container}>
            <Routes>
              <Route path="/" element={<Home state={this.state} apiService={apiService} onMount={this.maybeLoadEntries}/>} />
              <Route path="details/:entryId" element={<Details apiService={apiService}/>} />
              <Route path="/new" element={<Create/>}/>
              <Route path="*" element={<Home state={this.state} apiService={apiService} onMount={this.maybeLoadEntries}/>}/>
            </Routes>
          </Card>
        </div>
      </BrowserRouter>
    );
  }
}

const root = createRoot(document.getElementById('root'));
// const apiUrl = 'http://localhost:8081';
// const apiService: ApiService = new HttpApiClient(apiUrl);
const apiService: ApiService = new FakeApiService();
root.render(<SuggestionsRoot apiService={apiService}/>);
