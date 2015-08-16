var ACCESS_TOKEN = 'ed05519c20dd2b68c45fb0c4f5d5fa46774b5b63';
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
