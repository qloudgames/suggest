'use strict';

// TODO: split source files and import
const Config = {
  heading: 'What do you think should be included?',
};

// 

class SuggestionsRoot extends React.Component {
  constructor(props) {
    super(props);
    // ...
  }

  render() {
    if (this.state && this.state.liked) {
      return 'yeet!';
    }
    return (
      <div>
        <h1 class="heading">{Config.heading}</h1>
      </div>
    );
  }
}

const domContainer = document.querySelector('#root');
const root = ReactDOM.createRoot(domContainer);
root.render(React.createElement(SuggestionsRoot));
