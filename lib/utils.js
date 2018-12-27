const { selectArrivalISOs, selectDepartureISOs } = require('./selectors');

const exists = value => value != null && value !== '';

const isEmptyArray = array => Array.isArray(array) && !array.filter(Boolean).length;

/* eslint-disable camelcase */
const BASE_URL = 'https://api-v3.mbta.com';

// CONVERSION FUNCTIONS

/**
 * Converts array or string into comma separated string
 * @param {string | Array} value
 */
const commaSeparate = value => []
  .concat(value)
  .filter(Boolean)
  .join(',')
  .replace(/,\s/g, ',');

/**
 * Convert MS to given time units
 * @param {number} ms
 * @param {string} convertTo Time unit to convert MS to
 */
const convertMs = (ms, convertTo) => {
  if (!exists(convertTo)) return ms;

  const conversionMap = {
    // Order here is important, because 'sec' input will
    // match 'milliseconds' if it's before 'seconds'
    'hours|hrs': 1000 * 60 * 60,
    'minutes|mins': 1000 * 60,
    'seconds|secs': 1000,
    'ms|milliseconds': 1,
  };

  const converted = Object.keys(conversionMap).find(unit => new RegExp(convertTo, 'i').test(unit));

  if (!exists(converted)) {
    throw new Error(`Invalid 'convertTo' value: ${convertTo}`);
  }

  return ms / conversionMap[converted];
};

/**
 * Convert an array of ISO strings to <units> from now
 * @param {function} selector Select array of ISO times from response object
 */
const convertTimes = selector => options => {
  const { response, max, convertTo, now = Date.now() } = options;

  return selector(response)
    .slice(0, max)
    .map(isoString => {
      // Note: arrival could be null if first stop on a route. Use departures
      // if it's not null. Departure could be null if final stop on a route
      // See https://www.mbta.com/developers/v3-api/best-practices for more info
      if (convertTo == null || isoString == null) return isoString;

      const msFromNow = new Date(isoString).valueOf() - now;
      const unitsFromNow = Math.floor(convertMs(msFromNow, convertTo));

      return unitsFromNow >= 0 ? unitsFromNow : 0;
    });
};

const arrivalsWithConversion = convertTimes(selectArrivalISOs);
const departuresWithConversion = convertTimes(selectDepartureISOs);

// NORMALIZATION FUNCTIONS

/**
 * Takes any kind of input, returns an ISO string.
 * Throws if input is malformed.
 * @param {number | string | Date} value
 */
const normalizeDate = value => new Date(value).toISOString();

/**
 * Handles number or string input and returns numeric type based on:
 * https://developers.google.com/transit/gtfs/reference/routes-file
 * @param {string} type
 */
const normalizeType = type => {
  const typeNames = [
    'tram|light rail|streetcar|trolley',
    'subway|metro|train',
    'rail|commuter|commuter rail',
    'bus|autobus',
    'ferry|boat',
    'cable car',
    'gondola|suspended cable car',
    'funicular',
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
  const normalized = typeNames.findIndex(name => new RegExp(type, 'i').test(name));
  return normalized > -1 ? normalized : null;
};

const addApiKey = (url, apiKey) => {
  if (!exists(apiKey)) {
    console.warn('API key is missing. Keys available at https://api-v3.mbta.com');
    return `${url}`;
  }
  const delimiter = url.includes('?') ? '&' : '?';
  return `${url}${delimiter}api_key=${apiKey}`;
};

/**
 * URL construction function
 * @param {string} endpoint
 * @param {object} queryParams Specific to each endpoint
 * @param {string} apiKey
 */
function buildUrl(endpoint, queryParams, apiKey) {
  const url = BASE_URL + endpoint;

  if (!endpoint) {
    throw new Error(
      'Please provide an endpoint. See https://api-v3.mbta.com/docs/swagger/index.html'
    );
  }

  if (!queryParams || !Object.keys(queryParams).length) {
    return addApiKey(url, apiKey);
  }

  const {
    limit,
    offset,
    latitude,
    longitude,
    descending,
    min_time,
    max_time,
    radius,
    route,
    stop,
    sort,
    trip,
  } = queryParams;

  const matchRoute = test => test === endpoint;

  if (
    (matchRoute('/predictions') || matchRoute('/schedules'))
    && (!exists(stop) && !exists(trip) && !exists(route))
  ) {
    console.warn('Please include "stop", "trip", or "route"');
  }

  if (matchRoute('/shapes') && !exists(route)) {
    console.warn('Shape requires a "route" param');
  }

  if (exists(offset) && !exists(limit)) {
    console.warn('"offset" will have no effect without "limit"');
  }

  if ((exists(latitude) && !exists(longitude)) || (!exists(latitude) && exists(longitude))) {
    console.warn('Latitude and longitude must both be present');
  }

  if (exists(radius) && (!exists(latitude) || !exists(longitude))) {
    console.warn('Radius requires latitude and longitude');
  }

  if (exists(descending) && !exists(sort)) {
    console.warn('"descending" has no effect without "sort"');
  }

  [min_time, max_time].forEach(minMax => {
    if (exists(minMax) && !/^\d{2}:\d{2}/.test(minMax)) {
      console.warn('min_time and max_time format should be HH:MM');
    }
  });

  // Convert queryParams into string values for URL
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
        case 'route_type':
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
    // Filter out falsy values, and 'descending' since it's only used for 'sort' logic
    .filter(param => !!param && !/descending/.test(param))
    .join('&');
  console.log(`queryString:`, queryString);
  return addApiKey(`${url}?${queryString}`, apiKey);
}

module.exports = {
  exists,
  buildUrl,
  convertMs,
  convertTimes,
  isEmptyArray,
  normalizeType,
  normalizeDate,
  arrivalsWithConversion,
  departuresWithConversion,
};
