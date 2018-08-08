const getClassOf = target => Object.prototype.toString.call(target);

const isObject = obj => getClassOf(obj) === '[object Object]';

const getObjectLength = obj => (isObject(obj) ? Object.keys(obj).length : 0);

const log = (...v) => console.log(...v);

module.exports = {
  getClassOf,
  isObject,
  getObjectLength,
  log
};
