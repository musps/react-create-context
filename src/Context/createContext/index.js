import React, { Component } from 'react';

const preLog = (name, ...args) => console.log(name, ...args);
const getClassOf = target => Object.prototype.toString.call(target);
const isObject = obj => getClassOf(obj) === '[object Object]';
const isFunction = obj => getClassOf(obj) === '[object Function]';
const bindContextForAction = (action, context) => (
  Object.assign(action, ...Object.keys(action)
    .map(
      (actionName) => ({
        [actionName]: action[actionName].bind(context)
      })
    )
  )
);

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
      let isError = false;
      const updater = (prevState) => {
        return {
          ...prevState,
          data: {
            ...prevState.data,
            ...nextState
          }
        };
      };

      if (isFunction(fnOrObject)) {
        nextState = fnOrObject(this.state.data);
      } else if (isObject(fnOrObject)) {
        nextState = fnOrObject;
      } else {
        isError = true;
      }

      if (!isError) {
        // Apply updater
        this.setState(updater);
      }
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
    withContext,
    ContextComponent
  }
};

export default createContext;
