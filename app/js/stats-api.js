import 'whatwg-fetch';

function jsonToURI(obj) {
  return Object.keys(obj).map((k) => (
    `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`
  )).join('&');
}

function getFactory(baseUrl) {
  return (params, base = '') => {
    const url = `${baseUrl}${base}?${jsonToURI(params)}`;
    const header = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    };
    return fetch(url, header)
      .then((response) => (
        response.json()
      ));
  };
}

export const getStats = getFactory('/stats/counts/');
export const getUsers = getFactory('/stats/users/');
export const getQuestions = getFactory('/stats/questions/');
export const getUserCounts = getFactory('/stats/user/counts/');
