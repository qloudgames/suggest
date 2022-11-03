import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Card } from 'antd';
// TODO: clean this up
import 'antd/dist/antd.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import styles from './app.module.css';
import { Details } from './details';
import { StyledLink } from './component_util';
import logo from './assets/loftia-logo.png';
import { Create } from './create';
import { HttpApiClient } from './services/http_api_client';
import { ApiService } from './services/api_service';
import { Category } from 'common/types';
import { Home, MainState } from './home';

const apiUrl = window.location.href.includes('localhost:8080') ? '//localhost:3000' : '//ideas-api.loftia.gg';

type Props = {
  apiService: ApiService;
};

class SuggestionsRoot extends React.Component<Props, MainState> {
  constructor(props: Props) {
    super(props);

    this.state = {
      selectedCategory: 'hot',
      entries: {
        hot: undefined,
        new: undefined,
        top: undefined,
      },
    };
  }

  private readonly loadEntries = (category?: Category) => {
    const { apiService } = this.props;

    if (category == null)
      category = this.state.selectedCategory;

    apiService.getEntries(category).then(resultEntries => {
      this.setState({
        entries: {
          ...this.state.entries,
          [category]: resultEntries,
        },
      });
    });
  };

  private readonly onCategoryChange = (toCategory: Category) => {
    this.setState({
      selectedCategory: toCategory,
    });
    if (this.state.entries[toCategory] == null) {
      this.loadEntries(toCategory);
    }
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
              <Route path="/" element={<Home state={this.state} apiService={apiService} onMount={this.loadEntries} onCategoryChange={this.onCategoryChange}/>} />
              <Route path="details/:entryId" element={<Details apiService={apiService}/>} />
              <Route path="/new" element={<Create apiService={apiService}/>}/>
              <Route path="*" element={<Home state={this.state} apiService={apiService} onMount={this.loadEntries} onCategoryChange={this.onCategoryChange}/>}/>
            </Routes>
          </Card>
        </div>
      </BrowserRouter>
    );
  }
}

// react
const root = createRoot(document.getElementById('root'));
const apiService: ApiService = new HttpApiClient(apiUrl);
// const apiService: ApiService = new FakeApiService();
root.render(<SuggestionsRoot apiService={apiService}/>);

// "trianglify.bundle.js" fetched in html file
const seed = `${Math.random() * 100_000_000}`;
function regenerateBackground() {
  const existing = document.getElementsByClassName('background');
  if (existing.length > 0) 
    document.body.removeChild(existing.item(0));

  const opts = {
    seed,
    width: window.innerWidth,
    height: window.innerHeight,
  };
  const pattern = (window as any).trianglify(opts);
  const element = pattern.toCanvas();
  element.classList.add('background');
  document.body.appendChild(element);
}

regenerateBackground();
window.onresize = () => {
  regenerateBackground();
};
