const BASE_URL = 'https://api-v3.mbta.com';

// string enum
const TimeUnits = {
  MS: 'MS',
  SECONDS: 'SECONDS',
  MINUTES: 'MINUTES',
  HOURS: 'HOURS',
};

const Attributes = {
  arrival_time: 'arrival_time',
  departure_time: 'departure_time',
};

const convertMs = (ms, units) => {
  if (units == null) return ms;

  const conversionMap = {
    MS: 1,
    SECONDS: 1000,
    MINUTES: 1000 * 60,
    HOURS: 1000 * 60 * 60,
  };
  return ms / conversionMap[units];
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

module.exports = {
  convertMs,
  TimeUnits,
  Attributes,
  buildUrl,
};
