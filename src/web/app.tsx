import * as React from 'react';
import { createRoot } from 'react-dom/client';
import styles from './app.css';

// TODO: split source files and import
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
      <div>
        <h1 className={styles.heading}>{Config.heading}</h1>
      </div>
    );
  }
}

const root = createRoot(document.getElementById('root'));
root.render(<SuggestionsRoot/>);
