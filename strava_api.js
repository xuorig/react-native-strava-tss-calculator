var ACCESS_TOKEN = '';
var STRAVA_END_POINT = 'https://www.strava.com/api/v3/'

function fetchData(URL) {
  return fetch(URL, {
    headers: {
      "Authorization": "Bearer " + ACCESS_TOKEN
    }
  }).then((response) => response.json())
}

function getRide(id) {
  url = STRAVA_END_POINT + 'activities/' + id;
  return fetchData(url);
}

function getStream(id, callback) {
  url = STRAVA_END_POINT + 'activities/' + id + '/streams/watts?resolution=low';
  return fetchData(url);
}

module.exports = {
  getRide: getRide,
  getStream: getStream,
};
