import React, { Component } from 'react';
import createContext, { createStore } from './Context/createContext';
import Home from './Components/Home';
import Footer from './Components/Footer';

const log = (...args) => console.log(...args);

const UserContext = createContext('UserContext');
const NewsContext = createContext('NewsContext');
const CatContext = createContext('CatContext');
const ThemeContext = createContext('ThemeContext', {}, {
  isDone: function () {
    this.updateState({
      [Date.now()]: true
    });
  }
});

const HomeRender = ThemeContext.withContext(Home);
const FooterRender = ThemeContext.withContext(Footer);

const store = createStore(
  UserContext,
  NewsContext,
  CatContext,
  ThemeContext
);

log('store', store);

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
