import React, { Component } from 'react';

const log = (...args) => console.log(...args);

class Home extends Component {
  constructor(props) {
    super(props);
    this.updateTheme = this.updateTheme.bind(this);
    log(this);
  }

  updateTheme() {
    this.props.ThemeContext.action.isDone();
    setTimeout(() => {
      console.log('this props', this.props);
    }, 200);
  }

  render() {
    return (
      <div>
        <h1>app_name</h1>
        <button onClick={this.updateTheme}>updateTheme</button>
      </div>
    )
  }
}

export default Home;
