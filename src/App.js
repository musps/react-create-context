import React, { Component } from 'react';
import createContext from './Context/createContext';

const log = (...args) => console.log(...args);

const ThemeContext = createContext('ThemeContext', {}, {
  isDone: function () {
    this.updateState({
      [Date.now()]: true
    });
  }
});

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

const Footer = (props) => (
  <div>
    <ul>
      {Object.entries(props.ThemeContext.data).map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  </div>
);

const HomeRender = ThemeContext.withContext(Home);
const FooterRender = ThemeContext.withContext(Footer);

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ThemeContext.ContextComponent>
        <HomeRender />
        <FooterRender />
      </ThemeContext.ContextComponent>
    )
  }
}

export default App;
