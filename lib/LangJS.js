const {
  isObject,
  getObjectLength,
  log,
} = require('./LangJSTools.js');
const LangJSHTTP = require('./LangJSHTTP.js');
const LangJSCache = require('./LangJSCache.js');

const LangJSDefaultConfig = {
  endpoint: '',
  delimitor: {
    left: ':',
    right: '',
  },
  cache: {
    setCache: false,
    timeToLive: 600,
  },
};

const LangJSDefaultLangObject = {
  key: '',
  object: {},
  cache: {
    updatedAt: null,
  },
};

const LangJSDefaultData = {
  currentLang: LangJSDefaultLangObject,
  langs: [],
};

class LangJS {
  constructor(config) {
    // Config.
    this.config = LangJSDefaultConfig;
    // Data.
    this.data = LangJSDefaultData;
    // Initialize.
    this.init(config);
  }

  init(config) {
    if (!isObject(config)) {
      throw new Error('#Contructor config must be an object');
    } else {
      this.checkConfigObject(config);
    }
  }

  checkConfigObject(config) {
    if (Object.prototype.hasOwnProperty.call(config, 'endpoint')) {
      this.config.endpoint = config.endpoint;
    }

    if (Object.prototype.hasOwnProperty.call(config, 'delimitor')) {
      // Delimitor left.
      const delimitorLeft = Object.prototype.hasOwnProperty.call(config.delimitor, 'left');
      this.config.delimitor.left = delimitorLeft ? delimitorLeft : this.config.delimitor.left;
      // Delimitor right.
      const delimitorRight = Object.prototype.hasOwnProperty.call(config.delimitor, 'right');
      this.config.delimitor.right = delimitorRight ? delimitorRight : this.config.delimitor.right;
    }
    if (Object.prototype.hasOwnProperty.call(config, 'cache')) {
      // Cache setCache.
      const cacheSetCache = Object.prototype.hasOwnProperty.call(config.cache, 'setCache');
      this.config.cache.setCache = cacheSetCache ? cacheSetCache : this.config.cache.setCache;
      // Cache timeToLive.s
      const cacheTimeToLive = Object.prototype.hasOwnProperty.call(config.cache, 'timeToLive');
      this.config.cache.timeToLive = cacheTimeToLive ? cacheTimeToLive : this.config.cache.timeToLive;
    }
  }

  // --------------------------------------------------------
  // -----------------------------> START GETTERS
  getCurrentLang() {
    return this.data.currentLang;
  }

  getCurrentLangKey() {
    return this.data.currentLang.key;
  }

  getCurrentLangObject() {
    return this.data.currentLang.object;
  }

  getLangs() {
    return this.data.langs;
  }

  getEndpoint() {
    return this.config.endpoint;
  }

  doLanguageUpdateOverHTTP() {
    return this.getEndpoint() !== '';
  }

  doUseCache() {
    return this.config.cache.setCache;
  }

  createLangObject(languageKey, languageObject) {
    return Object.assign(LangJSDefaultLangObject, {
      key: languageKey,
      object: languageObject,
      cache: {
        updatedAt: Date.now(),
      },
    });
  }

  findLanguageIndex(data, languageKey) {
    return data.findIndex(language => language.key === languageKey);
  }
  // -----------------------------> END GETTERS AND SETTERS
  // --------------------------------------------------------

  // --------------------------------------------------------
  // -----------------------------> START CONFIG
  addLanguage(languageKey, languageObject, setAsCurrentLanguage = false) {
    const findLanguageIndex = this.findLanguageIndex(this.getLangs(), languageKey);

    if (findLanguageIndex !== -1) {
      throw new Error(`@addLanguage - Language key '${languageKey}' is already registered.`);
    } else {
      const langObject = this.createLangObject(languageKey, languageObject);
      // Add to the list.
      this.data.langs.push(langObject);
      // Add to the cache is feature is activated.
      if (this.doUseCache()) {
        LangJSCache.add(langObject);
      }
      // Set as current language if variable is true.
      if (setAsCurrentLanguage) {
        this.setCurrentLanguage(languageKey);
      }
    }
  }
  // --------------------------------------------------------
  // -----------------------------> END CONFIG

  do(languageObjectKey, replacementValues) {
    let value = this.getKey(languageObjectKey);

    if (getObjectLength(replacementValues) !== 0) {
      value = this.replaceStringKeyByValueAll(value, replacementValues);
    }

    return value;
  }

  getKey(languageObjectKey) {
    let value = this.getCurrentLangObject()[languageObjectKey];

    value = typeof value !== 'undefined' ? value : languageObjectKey;
    return value;
  }

  replaceStringKeyByValue(baseString, keyToReplace, replaceValue) {
    const { left, right } = this.config.delimitor;
    const searchPattern = `${left}${keyToReplace}${right}`;

    return baseString.replace(searchPattern, replaceValue);
  }

  replaceStringKeyByValueAll(baseString, replacementValues) {
    let nextBaseString = baseString;

    Object.keys(replacementValues).map((keyToReplace) => {
      const replaceValue = replacementValues[keyToReplace];

      nextBaseString = this.replaceStringKeyByValue(nextBaseString, keyToReplace, replaceValue);
      return null;
    });

    return nextBaseString;
  }

  setCurrentLang(langObject, addToLangArray = false) {
    this.data.currentLang = langObject;

    if (addToLangArray) {
      this.data.langs.push(langObject);
    }
  }

  getLangWithThis(languageKey) {
    let resp = null;
    const findLanguage = this.getLangs().find(language => language.key === languageKey);
    if (typeof findLanguage === 'undefined') {
      resp = Promise.reject(false);
    } else {
      resp = Promise.resolve(findLanguage);
    }
    return resp;
  }

  getLangWithHTTP(languageKey) {
    return LangJSHTTP(this.getEndpoint(), languageKey)
      .then((data) => {
        this.addLanguage(languageKey, data, true);
        return true;
      })
      .catch(errorCode => Promise.reject(errorCode));
  }

  getLangWithCache(languageKey) {
    let resp = null;
    const langCache = LangJSCache.getByLanguageKey(languageKey);
    if (typeof langCache === 'undefined') {
      resp = Promise.reject(false);
    } else {
      resp = Promise.resolve(langCache);
    }
    return resp;
  }

  setCurrentLanguage(languageKey) {
    const setCurrentLang = (langObject, addToLangArray = false) => {
      this.setCurrentLang(langObject, addToLangArray);
      return Promise.resolve(true);
    };

    const findWithHTTP = (_languageKey) => {
      let resp = null;
      const onNotFound = (errorCode, errorMessage) => Promise.reject({
        code: errorCode,
        message: `setCurrentLanguage #noFound ${errorMessage}`,
      });

      if (this.doLanguageUpdateOverHTTP()) {
        resp = this.getLangWithHTTP(_languageKey)
          .then(langObject => setCurrentLang(langObject, true))
          .catch(() => onNotFound('NOT_FOUND_HTTP', 'getLangWithHTTP'));
      } else {
        resp = onNotFound('NOT_FOUND_THIS', 'getLangWithThis');
      }
      return resp;
    };

    return this.getLangWithThis(languageKey).then(setCurrentLang.bind(this))
      .catch(() => {
        let resp = null;
        if (this.doUseCache()) {
          resp = this.getLangWithCache(languageKey)
            .then(langObject => setCurrentLang(langObject, true))
            .catch(() => findWithHTTP(languageKey));
        } else {
          resp = findWithHTTP(languageKey);
        }
        return resp;
      });
  }
}

module.exports = LangJS;
