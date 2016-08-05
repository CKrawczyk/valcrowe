import 'whatwg-fetch';

const BASE_URL = '/stats/counts/';

function jsonToURI(obj) {
  return Object.keys(obj).map((k) => (
    `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`
  )).join('&');
}

export default function getStats(params) {
  const url = `${BASE_URL}?${jsonToURI(params)}`;
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
}