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

const Pages = {
  first: 'first',
  next: 'next',
  prev: 'prev',
  last: 'last',
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
      // arrival could be null if first stop on a route. Use departures if it's not null
      // departure could be null if final stop on a route
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
  Pages,
  TimeUnits,
  Attributes,
  convertMs,
  selectPage,
  convertTimes,
  selectIncluded,
  arrivalsWithConversion,
  departuresWithConversion,
};
