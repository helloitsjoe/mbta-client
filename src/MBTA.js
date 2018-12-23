const {exists} = require('./utils');

/* eslint-disable camelcase */
const BASE_URL = 'https://api-v3.mbta.com';

// This will handle input as a Date(), number, or
// string, and throw if the string is malformed.
const normalizeDate = value => new Date(value).toISOString();

// This will create a comma separated string of multiple values,
// or just return a single value, whether or not it's in an array
const commaSeparate = value => [].concat(value).join(',');

function buildUrl(endpoint, queryParams, apiKey) {
  const url = BASE_URL + endpoint;

  if (!queryParams || !Object.keys(queryParams).length) {
    return url;
  }

  const {
    offset,
    limit,
    latitude,
    longitude,
    min_time,
    max_time,
    radius,
    route,
    stop,
    trip,
  } = queryParams;

  const matchRoute = test => test === endpoint;

  if ((matchRoute('/predictions') || matchRoute('/schedules'))
    && (!exists(stop) && !exists(trip) && !exists(route))) {
    console.warn('Please include "stop", "trip", or "route" in query params');
  }

  if (matchRoute('/shapes') && !exists(route)) {
    console.warn('Shape requires a "route" query param');
  }

  if (exists(offset) && !exists(limit)) {
    console.warn('page[offset] will have no effect without page[limit]');
  }

  if ((exists(latitude) && !exists(longitude)) || (!exists(latitude) && exists(longitude))) {
    console.warn('Latitude and longitude must both be present');
  }

  if (exists(radius) && (!exists(latitude) || !exists(longitude))) {
    console.warn('Radius requires latitude and longitude');
  }

  [min_time, max_time].forEach(minMax => {
    if (exists(minMax) && !/^\d{2}:\d{2}/.test(minMax)) {
      console.warn('min_time and max_time should be in the format HH:MM');
    }
  });

  const queryString = Object.entries(queryParams)
    .map(([key, value]) => {
      if (!exists(value)) {
        return null;
      }
      if (key === 'sort') {
        return queryParams.descending ? `sort=-${value}` : `sort=${value}`;
      }
      if (key === 'limit' || key === 'offset') {
        return `page[${key}]=${value}`;
      }
      const normalized = key === 'date' ? normalizeDate(value) : value;
      // MBTA docs say to use filter[stop], filter[route], etc, but they
      // also support stop, route, etc. without filter
      return `${key}=${commaSeparate(normalized)}`;
    })
    .filter(Boolean)
    .join('&');

  if (!exists(apiKey)) {
    console.warn(
      'API key is missing. Keys available at https://api-v3.mbta.com'
    );
    return `${url}?${queryString}`;
  }

  return `${url}?${queryString}&api_key=${apiKey}`;
}

module.exports = {
  buildUrl,
};
