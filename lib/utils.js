const { Attributes } = require('./constants');

const exists = value => value != null;

const isEmptyArray = array => Array.isArray(array) && !array.filter(Boolean).length;

const convertMs = (ms, convertTo) => {
  if (!convertTo) return ms;

  const conversionMap = {
    // Order here is important, because 'sec' input will
    // match 'milliseconds' if it's before 'seconds'
    'hours|hrs': 1000 * 60 * 60,
    'minutes|mins': 1000 * 60,
    'seconds|secs': 1000,
    'ms|milliseconds': 1,
  };

  const converted = Object.keys(conversionMap)
    .find(unit => new RegExp(convertTo, 'i').test(unit));

  if (!exists(converted)) {
    throw new Error("Invalid 'convertTo' value");
  }

  return ms / conversionMap[converted];
};

const convertTimes = selector => options => {
  const {
    response,
    max,
    convertTo,
    now = Date.now(),
  } = options;

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

const selectAttribute = attr => response => {
  if (!response || !response.data) {
    console.warn('No response data...');
    return [];
  }

  return response.data.map(vehicle => vehicle.attributes[attr]);
};

const selectLinks = response => {
  if (!response) {
    throw new Error('No response, fetch data before accessing this value');
  }
  if (!response.links) {
    console.warn('response.links does not exist, "limit" must be in fetch options');
  }
  return response.links;
};

const selectIncluded = (response, type) => {
  if (!response) {
    throw new Error('included() requires an MBTA response as an argument');
  }
  if (!response.included) {
    console.warn('response.included does not exist, "include" must be in fetch options');
    return [];
  }
  return response.included.filter(inc => {
    if (Array.isArray(type)) {
      return type.includes(inc.type);
    }
    return type === inc.type || type == null;
  });
};

const selectPage = (page, response) => selectLinks(response)[page];

const selectArrivalISOs = selectAttribute(Attributes.arrival_time);
const selectDepartureISOs = selectAttribute(Attributes.departure_time);

const arrivalsWithConversion = convertTimes(selectArrivalISOs);
const departuresWithConversion = convertTimes(selectDepartureISOs);

module.exports = {
  exists,
  isEmptyArray,
  convertMs,
  selectPage,
  convertTimes,
  selectIncluded,
  arrivalsWithConversion,
  departuresWithConversion,
};
