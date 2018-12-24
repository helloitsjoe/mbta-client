const { exists, isEmptyArray } = require('./utils');

/* eslint-disable camelcase */
const BASE_URL = 'https://api-v3.mbta.com';

// Creates a comma separated string of multiple values,
// or just return a single value, whether or not it's in an array
const commaSeparate = value => [].concat(value)
  .filter(Boolean)
  .join(',')
  .replace(/\s/g, '');

// This handles input as a Date(), number, or
// string, and throw if the string is malformed.
const normalizeDate = value => new Date(value).toISOString();

// Handles number or string input and returns numeric type based on:
// https://developers.google.com/transit/gtfs/reference/routes-file
const normalizeType = type => {
  const typeNames = [
    'tram|light rail|streetcar|trolley',
    'subway|metro|train',
    'rail|commuter|commuter rail',
    'bus|autobus',
    'ferry|boat',
    'cable car',
    'gondola|suspended cable car',
    'funicular'
  ];

  const typeAsNum = Number(type);

  if (!exists(type) || typeAsNum >= typeNames.length) {
    console.warn(`Invalid type: ${type}`);
    return null;
  }
  // NaN !== NaN quick string check
  // eslint-disable-next-line
  if (typeAsNum === typeAsNum) {
    return typeAsNum;
  }
  const normalized = typeNames
    .findIndex(name => new RegExp(type, 'i').test(name));
  return normalized > -1 ? normalized : null;
};

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
      let finalValue;
      switch (key) {
        case 'sort':
          return queryParams.descending ? `sort=-${value}` : `sort=${value}`;
        case 'limit':
        case 'offset':
          return `page[${key}]=${value}`;
        case 'date':
          finalValue = [].concat(value).map(normalizeDate);
          break;
        case 'type':
          finalValue = [].concat(value).map(normalizeType);
          break;
        default:
          finalValue = value;
      }

      if (!exists(finalValue) || isEmptyArray(finalValue)) {
        return null;
      }

      // MBTA docs say to use filter[stop], filter[route], etc, but they
      // also support stop, route, etc. without filter
      return `${key}=${commaSeparate(finalValue)}`;
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
  normalizeType,
  normalizeDate,
};