const KEY_NAME = 'langsCache';

const findLanguageIndex = (data, languageKey) => data
  .findIndex(language => language.key === languageKey);


const findLanguage = (data, languageKey) => data
  .find(language => language.key === languageKey);

const LangJSCacheSave = (data) => {
  const dataAsJson = JSON.stringify(data);
  localStorage.setItem(KEY_NAME, dataAsJson);
  return data;
};

const LangJSCacheGet = () => {
  let data = localStorage.getItem(KEY_NAME);
  try {
    data = data === null ? [] : JSON.parse(data);
  } catch (jsonParseException) {
    data = [];
  }
  return data;
};

const LangJSCacheGetByLanguageKey = (languageKey) => {
  const langs = LangJSCacheGet();
  return findLanguage(langs, languageKey);
};

const LangJSCacheAdd = (langObject) => {
  const data = LangJSCacheGet();
  const languageIndex = findLanguageIndex(data, langObject.key);

  if (languageIndex !== -1) {
    data[languageIndex] = langObject;
  } else {
    data.push(langObject);
  }

  LangJSCacheSave(data);
};

const LangJSCache = {
  get: () => LangJSCacheGet(),
  getByLanguageKey: languageKey => LangJSCacheGetByLanguageKey(languageKey),
  add: langObject => LangJSCacheAdd(langObject),
  save: data => LangJSCacheSave(data),
};

module.exports = LangJSCache;
