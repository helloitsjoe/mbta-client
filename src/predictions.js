const { convertMs, Attributes } = require('./utils');

const Pages = {
  first: 'first',
  next: 'next',
  prev: 'prev',
  last: 'last',
};

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
    throw new Error('No predictions, call fetchPredictions() before accessing this value');
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
  convertTimes,
  arrivalsWithConversion,
  departuresWithConversion,
  selectIncluded,
  selectPage,
  Pages,
};
