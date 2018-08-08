const LangJSHTTP = (endpoint, languageKey) => {
  const getEndpointURIWithLanguageKey = () => {
    const fileExt = '.json';
    return `${endpoint}${languageKey}${fileExt}`;
  };
  const fetchOnError = errorCode => Promise.reject(errorCode);
  const fetchOnSuccess = (response) => {
    let resp = null;
    const { status } = response;

    if (status === 404) {
      resp = fetchOnError('ERROR_FILE_NOT_FOUND');
    } else {
      resp = response.json()
        .then(data => data)
        .catch(() => fetchOnError('ERROR_FILE_JSON_PARSE'));
    }
    return resp;
  };

  const requestURI = getEndpointURIWithLanguageKey();

  return fetch(requestURI)
    .then(fetchOnSuccess)
    .catch(err => fetchOnError(err));
};

module.exports = LangJSHTTP;
