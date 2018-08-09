import React, { Component } from 'react';
import {
  preLog,
  getClassOf,
  isObject,
  isFunction,
  bindContextForAction,
  createStore
} from './utils';

const createContext = (contextName, contextData = {}, contextAction = {}) => {
  const log = (...args) => preLog(contextName, ...args);
  const setValue = value => ({
    [contextName]: value
  });
  const ContextIn = React.createContext();

  const withContext = ComponentIn => props => (
    <ContextIn.Consumer>
      {context => (
        <ComponentIn {...props} {...context} />
      )}
    </ContextIn.Consumer>
  );

  class ContextComponent extends Component {
    constructor(props) {
      super(props);
      this.state = {
        data: contextData,
        action: bindContextForAction(contextAction, this)
     };
     this.updateState = this.updateState.bind(this);
    }

    updateState(fnOrObject) {
      let nextState = {};
      const updater = (prevState) => {
        return {
          ...prevState,
          data: {
            ...prevState.data,
            ...nextState
          }
        };
      };

      try {
        if (isFunction(fnOrObject)) {
          nextState = fnOrObject(this.state.data);
        } else if (isObject(fnOrObject)) {
          nextState = fnOrObject;
        } else {
          throw new Error('function or object required.');
        }
        // Apply updater
        this.setState(updater);
      } catch (e) {}
    }

    render() {
      return (
        <ContextIn.Provider value={setValue(this.state)} >
          {this.props.children}
        </ContextIn.Provider>
      )
    }
  }

  return {
    contextName,
    withContext,
    ContextComponent
  }
};

export { 
  createStore
};
export default createContext;
