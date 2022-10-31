import * as React from 'react';
import * as ReactDOM from 'react-dom';

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
        <h1 class="heading">{Config.heading}</h1>
      </div>
    );
  }
}

const root = document.getElementById('#root');
ReactDOM.render(SuggestionsRoot, root);
