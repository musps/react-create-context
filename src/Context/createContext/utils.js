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

const createStore = (...stores) => {
  return Object.assign({}, ...Object.values(stores).map((store) => {
    return {
      [store.contextName]: store
    };
  }));
};


export {
  preLog,
  getClassOf,
  isObject,
  isFunction,
  bindContextForAction,
  createStore
};
