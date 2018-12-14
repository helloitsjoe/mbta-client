const { convertMs, Attributes } = require('./utils');

const BASE_URL = 'https://api-v3.mbta.com';

const Pages = {
  first: 'first',
  next: 'next',
  prev: 'prev',
  last: 'last',
};

// This will create a comma separated string of multiple values,
// or just return a single value, whether or not it's in an array
const commaSeparate = value => [].concat(value).join(',');

function buildUrl(endpoint, apiKey, queryParams) {
  const url = BASE_URL + endpoint;

  if (!queryParams || !Object.keys(queryParams).length) {
    return url;
  }

  const { offset, limit, latitude, longitude, radius } = queryParams;

  if (offset != null && limit == null) {
    console.warn('page[offset] will have no effect without page[limit]');
  }

  if ((latitude != null && longitude == null) || (latitude == null && longitude != null)) {
    console.warn('Latitude and longitude must both be present');
  }

  if (radius != null && latitude == null) {
    console.warn('Radius requires latitude and longitude');
  }

  const queryString = Object.entries(queryParams)
    .map(([key, value]) => {
      if (value == null) {
        return null;
      }
      if (key === 'sort') {
        return queryParams.descending ? `sort=-${value}` : `sort=${value}`;
      }
      if (key === 'limit' || key === 'offset') {
        return `page[${key}]=${value}`;
      }
      // MBTA docs say to use filter[stop], filter[route], etc, but they
      // also support stop, route, etc. without filter
      return `${key}=${commaSeparate(value)}`;
    })
    .filter(Boolean)
    .join('&');

  if (apiKey == null) {
    console.warn(
      'API key is missing. Keys available at https://api-v3.mbta.com'
    );
    return `${url}?${queryString}`;
  }

  return `${url}?${queryString}&api_key=${apiKey}`;
}

const convertTimes = selector => options => {
  const {
    predictions,
    max,
    convertTo,
    now = Date.now(),
  } = options;

  return selector(predictions)
    .slice(0, max)
    .map(isoString => {
      // arrival could be null if first stop on a route. Use departures if it's not null
      // departure could be null if final stop on a route
      // See https://www.mbta.com/developers/v3-api/best-practices for more info
      if (convertTo == null || isoString == null) return isoString;

      const msFromNow = new Date(isoString).valueOf() - now;
      const unitsFromNow = Math.floor(convertMs(msFromNow, convertTo));

      return unitsFromNow >= 0 ? unitsFromNow : 0;
    });
};

const selectAttribute = attr => predictions => {
  if (!predictions || !predictions.data) {
    console.warn('No prediction data...');
    return [];
  }

  return predictions.data.map(vehicle => vehicle.attributes[attr]);
};

const selectLinks = predictions => {
  if (!predictions) {
    throw new Error('No predictions, call fetchPredictions() before getting page links');
  }
  if (!predictions.links) {
    console.warn('predictions.links does not exist, "limit" must be in fetchPredictions options');
  }
  return predictions.links;
};

const selectIncluded = (predictions, type) => {
  if (!predictions) {
    throw new Error('No predictions, call fetchPredictions() before accessing this value');
  }
  if (!predictions.included) {
    console.warn('predictions.included does not exist, "include" must be in fetchPredictions options');
    return [];
  }
  return predictions.included.filter(inc => {
    if (Array.isArray(type)) {
      return type.includes(inc.type);
    }
    return type === inc.type || type == null;
  });
};

const selectPage = (page, predictions) => selectLinks(predictions)[page];

const selectArrivalISOs = selectAttribute(Attributes.arrival_time);
const selectDepartureISOs = selectAttribute(Attributes.departure_time);

const arrivalsWithConversion = convertTimes(selectArrivalISOs);
const departuresWithConversion = convertTimes(selectDepartureISOs);

module.exports = {
  buildUrl,
  convertTimes,
  arrivalsWithConversion,
  departuresWithConversion,
  selectIncluded,
  selectPage,
  Pages,
};